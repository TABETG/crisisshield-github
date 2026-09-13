export const PrivacyPage = () => {
  return (
    <div className="bg-white">
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 30, 2024</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
          <h2>1. Introduction</h2>
          <p>
            CrisisShield ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our crisis management platform.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Information You Provide</h3>
          <ul>
            <li>Account information (name, email, company details)</li>
            <li>Crisis plans and procedures you create</li>
            <li>Documents and files you upload</li>
            <li>Communications and support requests</li>
            <li>Payment and billing information</li>
          </ul>

          <h3>Information We Collect Automatically</h3>
          <ul>
            <li>Log data (IP address, browser type, access times)</li>
            <li>Usage information (features used, actions taken)</li>
            <li>Device information (operating system, device identifiers)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your data, including:
          </p>
          <ul>
            <li>Encryption at rest (AES-256) and in transit (TLS 1.3)</li>
            <li>Multi-tenant data isolation</li>
            <li>Regular security audits and penetration testing</li>
            <li>Access controls and authentication</li>
            <li>Comprehensive audit logging</li>
          </ul>

          <h2>5. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul>
            <li><strong>With your consent:</strong> When you explicitly authorize us to share specific information</li>
            <li><strong>Service providers:</strong> With third-party vendors who perform services on our behalf (e.g., hosting, analytics)</li>
            <li><strong>Legal requirements:</strong> When required by law, subpoena, or other legal process</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us at privacy@crisisshield.com.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to delete your data</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>

          <h2>8. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: privacy@crisisshield.com<br />
            Address: 123 Business Ave, Suite 456, New York, NY 10001, United States
          </p>
        </div>
      </section>
    </div>
  );
};
