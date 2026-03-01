import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const LAST_UPDATED = "March 1, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Privacy Policy
          </h1>
          <p className="text-stone-500 mt-1">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              1. Introduction
            </h2>
            <p>
              Sola Scriptura (&ldquo;the Service&rdquo;) is committed to
              protecting your privacy in accordance with Republic Act No. 10173,
              also known as the{" "}
              <strong className="text-stone-800">
                Data Privacy Act of 2012
              </strong>{" "}
              of the Philippines, and its Implementing Rules and Regulations.
              This Privacy Policy explains how we collect, use, store, and
              protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              2. Information We Collect
            </h2>
            <p>We collect the following personal information when you use the Service:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong className="text-stone-800">Account information:</strong>{" "}
                name, email address, birthday, gender, phone number, and country
              </li>
              <li>
                <strong className="text-stone-800">Reading data:</strong> Bible
                reading entries including book, chapter, and verse references
              </li>
              <li>
                <strong className="text-stone-800">Reflections:</strong> personal
                notes and reflections you write about your readings
              </li>
              <li>
                <strong className="text-stone-800">Usage data:</strong> reading
                streaks, login timestamps, and feature interactions
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              3. Legal Basis for Processing
            </h2>
            <p>
              We process your personal data based on the following criteria under
              RA 10173:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong className="text-stone-800">Consent:</strong> You provide
                consent when you create an account and agree to this policy
              </li>
              <li>
                <strong className="text-stone-800">
                  Contractual necessity:
                </strong>{" "}
                Processing is necessary to provide the Service you signed up for
              </li>
              <li>
                <strong className="text-stone-800">Legitimate interest:</strong>{" "}
                To improve the Service and ensure its security
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              4. How We Use Your Information
            </h2>
            <p>Your personal information is used to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide and maintain the Service (reading tracking, streaks, reflections)</li>
              <li>Authenticate your identity and secure your account</li>
              <li>Send transactional emails (e.g., password resets, notifications) via Resend</li>
              <li>Enable social features (public profiles, following, shared reflections)</li>
              <li>Improve the Service based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              5. Data Storage & Security
            </h2>
            <p>
              Your data is stored in a PostgreSQL database. Passwords are hashed
              using industry-standard algorithms and are never stored in plain
              text. We use HTTPS for all data transmission and implement
              appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              6. Data Sharing
            </h2>
            <p>
              We do not sell, trade, or rent your personal information to third
              parties. Your data may be shared only in the following limited
              circumstances:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong className="text-stone-800">Resend:</strong> We use
                Resend as our email service provider to send transactional
                emails. Only your email address is shared for this purpose.
              </li>
              <li>
                <strong className="text-stone-800">Public profiles:</strong> If
                you choose to make your profile public, your name, reading
                activity, and reflections may be visible to other users.
              </li>
              <li>
                <strong className="text-stone-800">Legal requirements:</strong>{" "}
                We may disclose information if required by law or valid legal
                process.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              7. Your Rights Under RA 10173
            </h2>
            <p>
              As a data subject under the Data Privacy Act of 2012, you have the
              following rights:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong className="text-stone-800">Right to be informed:</strong>{" "}
                You have the right to know how your data is being collected and
                used
              </li>
              <li>
                <strong className="text-stone-800">Right to access:</strong>{" "}
                You may request a copy of your personal data
              </li>
              <li>
                <strong className="text-stone-800">Right to correction:</strong>{" "}
                You may request correction of inaccurate or incomplete data
              </li>
              <li>
                <strong className="text-stone-800">Right to erasure:</strong>{" "}
                You may request deletion of your personal data
              </li>
              <li>
                <strong className="text-stone-800">Right to object:</strong>{" "}
                You may object to the processing of your personal data
              </li>
              <li>
                <strong className="text-stone-800">
                  Right to data portability:
                </strong>{" "}
                You may request your data in a structured, commonly used format
              </li>
              <li>
                <strong className="text-stone-800">
                  Right to file a complaint:
                </strong>{" "}
                You may file a complaint with the National Privacy Commission
              </li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at the email
              address provided below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              8. Cookies & Local Storage
            </h2>
            <p>
              The Service uses essential cookies for authentication and session
              management. We do not use tracking cookies or third-party
              analytics. Local storage may be used to preserve your preferences
              and improve performance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              9. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as your account is
              active. If you delete your account, your personal data will be
              removed from our systems within a reasonable timeframe, except
              where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              10. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected data from a child
              under 13, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use
              of the Service after changes are posted constitutes your
              acceptance of the updated policy. We encourage you to review this
              page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              12. Contact
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy or
              wish to exercise your rights under RA 10173, please contact us:
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li>
                Email:{" "}
                <a
                  href="mailto:solascriptura.app@gmail.com"
                  className="text-emerald-700 underline hover:text-emerald-800"
                >
                  solascriptura.app@gmail.com
                </a>
              </li>
            </ul>
            <p className="mt-4">
              You may also contact the National Privacy Commission (NPC) of the
              Philippines:
            </p>
            <ul className="list-none mt-2 space-y-1 text-stone-500">
              <li>
                Website:{" "}
                <a
                  href="https://privacy.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline hover:text-emerald-800"
                >
                  https://privacy.gov.ph
                </a>
              </li>
              <li>Email: complaints@privacy.gov.ph</li>
              <li>Phone: (02) 8234-2228</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
