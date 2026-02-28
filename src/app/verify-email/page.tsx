import { Suspense } from "react";
import { VerifyEmailClient } from "./verify-email-client";
import { verifyEmailAction } from "./actions";

type SearchParams = Promise<{ token?: string; email?: string }>;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token, email } = await searchParams;

  // If token and email are present, verify on the server
  let verifyResult: { success: boolean; error: string | null } | null = null;
  if (token && email) {
    verifyResult = await verifyEmailAction(token, email);
  }

  return (
    <Suspense>
      <VerifyEmailClient
        email={email ?? null}
        verifyResult={verifyResult}
      />
    </Suspense>
  );
}
