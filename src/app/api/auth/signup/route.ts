import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signupSchema } from "@/lib/validations/auth";
import { generateId } from "@/lib/ulid";
import { createVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      username,
      email,
      password,
      birthday,
      gender,
      phoneNumber,
      country,
    } = parsed.data;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    if (username) {
      const existingUserByUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUserByUsername) {
        return NextResponse.json(
          { error: "This username is already taken" },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        id: generateId(),
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username: username || null,
        birthday: new Date(birthday),
        gender,
        phoneNumber: phoneNumber || null,
        country,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });

    // Send verification email
    const identifier = `email_verify:${email}`;
    const token = await createVerificationToken(identifier);
    await sendVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Account created successfully. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
