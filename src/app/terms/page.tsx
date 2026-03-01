import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const LAST_UPDATED = "March 1, 2026";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-stone-500 mt-1">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Sola Scriptura (&ldquo;the Service&rdquo;),
              you agree to be bound by these Terms of Service. If you do not
              agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              2. Description of Service
            </h2>
            <p>
              Sola Scriptura is a free Bible reading tracker that allows you to
              log daily Scripture reading, write reflections, build reading
              streaks, and connect with other readers. The Service is provided
              &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
              warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              3. User Accounts
            </h2>
            <p>
              To use certain features, you must create an account by providing
              accurate and complete information. You are responsible for
              maintaining the confidentiality of your account credentials and for
              all activity under your account. You must notify us immediately of
              any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              4. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or its
                systems
              </li>
              <li>
                Upload or transmit malicious code, spam, or harmful content
              </li>
              <li>
                Impersonate another person or misrepresent your affiliation
              </li>
              <li>
                Interfere with or disrupt the Service or its infrastructure
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              5. Intellectual Property
            </h2>
            <p>
              You retain full ownership of your reading entries, reflections,
              and any content you create on the Service. By using the Service,
              you grant us a limited license to store and display your content
              solely for the purpose of providing the Service to you and, where
              applicable, to other users you choose to share with (e.g., public
              profiles and reflections).
            </p>
            <p className="mt-2">
              The Sola Scriptura name, logo, and interface design are our
              property and may not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              6. Termination
            </h2>
            <p>
              We may suspend or terminate your account at our discretion if you
              violate these terms. You may also delete your account at any time.
              Upon termination, your data will be handled in accordance with our{" "}
              <Link
                href="/privacy"
                className="text-emerald-700 underline hover:text-emerald-800"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Sola Scriptura and its
              developers shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of the Service. The Service is provided free of charge and without
              any guarantee of uptime or data preservation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              8. Changes to These Terms
            </h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of the Service after changes are posted constitutes your
              acceptance of the updated terms. We encourage you to review this
              page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              9. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with
              the laws of the Republic of the Philippines. Any disputes arising
              from these terms shall be subject to the exclusive jurisdiction of
              the courts of the Philippines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-3">
              10. Contact
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <a
                href="mailto:solascriptura.app@gmail.com"
                className="text-emerald-700 underline hover:text-emerald-800"
              >
                solascriptura.app@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
