// components/TermsAndPrivacy.js
import React from 'react';
import Link from "next/link"

const TermsAndPrivacy = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service and Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white-700">Data Entry Guidelines</h2>
        <p className="leading-relaxed">
          Our platform is designed to provide AI-generated study guides based on user-provided course topics and general notes. 
          To ensure privacy and security, users should <strong className="font-semibold">only input non-sensitive information</strong>, such as course titles, 
          topics, and general notes. <strong className="font-semibold">Sensitive information</strong>, including personal details, confidential school data, 
          or any protected content, <strong className="font-semibold">must not be entered</strong> into the system.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white-700">Authentication and Payment</h2>
        <p className="leading-relaxed mb-4">
          <strong className="font-semibold">User Authentication</strong>: We use <strong className="font-semibold">Clerk API</strong> to manage user authentication and session data. 
          This ensures secure login and user management. By using our platform, you agree to Clerk’s{' '}
          <a 
            href="https://clerk.dev/terms" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800"
          >
            Terms of Service
          </a> and{' '}
          <a 
            href="https://clerk.dev/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800"
          >
            Privacy Policy
          </a>.
        </p>
        <p className="leading-relaxed">
          <strong className="font-semibold">Payments</strong>: All payments and transactions are processed via <strong className="font-semibold">Stripe API</strong>. Stripe handles 
          all payment data securely, and we do not store any payment information on our servers. For more details, refer to 
          Stripe’s <a 
            href="https://stripe.com/legal" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800"
          >
            Terms of Service
          </a> and{' '}
          <a 
            href="https://stripe.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800"
          >
            Privacy Policy
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white-700">Data Processing and Storage</h2>
        <p className="leading-relaxed mb-4">
          <strong className="font-semibold">Generated Content</strong>: The AI-generated notes, quizzes, and flashcards are created using <strong className="font-semibold">OpenAI&#39;s API</strong>.
          Refer to OpenAI&#39;s <Link className="text-blue-600 hover:text-blue-800" target="_blank" href="https://openai.com/policies/row-privacy-policy/">Privacy policy</Link>,&nbsp;
          <Link className="text-blue-600 hover:text-blue-800" target="_blank" href="https://openai.com/policies/service-terms/">Service Terms</Link>,&nbsp;
          <Link className="text-blue-600 hover:text-blue-800" target="_blank" href="https://openai.com/policies/row-terms-of-use/">Terms of Use</Link>,&nbsp;
          and <Link className="text-blue-600 hover:text-blue-800" target="_blank" href="https://openai.com/policies/business-terms/">Business Terms</Link>.
          The content you generate based on course topics and general notes will be stored in our <strong className="font-semibold">Firebase Cloud Database</strong> for 
          your convenience and future access.
        </p>
        <p className="leading-relaxed">
          <strong className="font-semibold">Data Storage</strong>: We use <strong className="font-semibold">Firebase</strong> to securely store the AI-generated educational content. Firebase provides 
          built-in encryption and robust access control mechanisms to safeguard your data: <Link className="text-blue-600 hover:text-blue-800" target="_blank" href="https://firebase.google.com/terms">Terms of Service </Link>
          and <Link className="text-blue-600 hover:text-blue-800" target="_blank" href="https://firebase.google.com/support/privacy">Privacy and Security</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white-700">Important Considerations</h2>
        <p className="leading-relaxed mb-4">
          <strong className="font-semibold">No Sensitive Data</strong>: Users must not enter any personal information, sensitive data, or confidential content into the platform. 
          The system is intended to process only general educational information (e.g., course topics, titles, and notes) to create AI-powered study materials.
        </p>
        <p className="leading-relaxed">
          <strong className="font-semibold">Data Ownership</strong>: You retain ownership of the content you create using the platform, while our AI-generated content is processed 
          based on non-sensitive inputs and stored securely for your use.
        </p>
      </section>
    </div>
  );
};

export default TermsAndPrivacy;