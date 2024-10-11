// components/TermsAndPrivacy.js
import React from 'react';

const TermsAndPrivacy = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Terms of Service and Privacy Policy</h1>

      <section>
        <h2>Data Entry Guidelines</h2>
        <p>
          Our platform is designed to provide AI-generated study guides based on user-provided course topics and general notes. 
          To ensure privacy and security, users should <strong>only input non-sensitive information</strong>, such as course titles, 
          topics, and general notes. <strong>Sensitive information</strong>, including personal details, confidential school data, 
          or any protected content, <strong>must not be entered</strong> into the system.
        </p>
      </section>

      <section>
        <h2>Authentication and Payment</h2>
        <p>
          <strong>User Authentication</strong>: We use <strong>Clerk API</strong> to manage user authentication and session data. 
          This ensures secure login and user management. By using our platform, you agree to Clerk’s{' '}
          <a href="https://clerk.dev/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{' '}
          <a href="https://clerk.dev/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
        <p>
          <strong>Payments</strong>: All payments and transactions are processed via <strong>Stripe API</strong>. Stripe handles 
          all payment data securely, and we do not store any payment information on our servers. For more details, refer to 
          Stripe’s <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2>Data Processing and Storage</h2>
        <p>
          <strong>Generated Content</strong>: The AI-generated notes, quizzes, and flashcards are created using <strong>OpenAI's API</strong>. 
          The content you generate based on course topics and general notes will be stored in our <strong>Firebase Cloud Database</strong> for 
          your convenience and future access.
        </p>
        <p>
          <strong>Data Storage</strong>: We use <strong>Firebase</strong> to securely store the AI-generated educational content. Firebase provides 
          built-in encryption and robust access control mechanisms to safeguard your data.
        </p>
      </section>

      <section>
        <h2>Important Considerations</h2>
        <p>
          <strong>No Sensitive Data</strong>: Users must not enter any personal information, sensitive data, or confidential content into the platform. 
          The system is intended to process only general educational information (e.g., course topics, titles, and notes) to create AI-powered study materials.
        </p>
        <p>
          <strong>Data Ownership</strong>: You retain ownership of the content you create using the platform, while our AI-generated content is processed 
          based on non-sensitive inputs and stored securely for your use.
        </p>
      </section>
    </div>
  );
};

export default TermsAndPrivacy;