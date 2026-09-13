import { Lock, Shield, Eye, Database, Key, FileCheck, Users, Server } from 'lucide-react';

export const SecurityPage = () => {
  const features = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3. Documents are encrypted per tenant with unique encryption keys, ensuring complete data isolation.'
    },
    {
      icon: Shield,
      title: 'Multi-Tenant Isolation',
      description: 'Complete logical and physical separation between tenants. Your data is isolated at the database, application, and infrastructure levels. No tenant can ever access another tenant\'s data.'
    },
    {
      icon: Eye,
      title: 'Comprehensive Audit Logging',
      description: 'Every action is logged with immutable audit trails. Track who did what, when, and why. Audit logs use tamper-proof signatures to ensure integrity and are retained for compliance requirements.'
    },
    {
      icon: Database,
      title: 'Secure Data Storage',
      description: 'Data is stored in geographically redundant datacenters with automatic backups. Choose your data residency location to meet regulatory requirements. Point-in-time recovery available.'
    },
    {
      icon: Key,
      title: 'Role-Based Access Control',
      description: 'Granular permissions with least-privilege access. Define custom roles, assign permissions at document and feature levels. Support for single sign-on (SSO) and multi-factor authentication (MFA).'
    },
    {
      icon: FileCheck,
      title: 'Compliance Ready',
      description: 'Built with compliance in mind. SOC 2 Type II compliant, GDPR ready, ISO 27001 certified infrastructure. Regular penetration testing and security audits by third-party experts.'
    },
    {
      icon: Users,
      title: 'Identity & Access Management',
      description: 'Integrate with your existing identity provider via SAML, OAuth, or OpenID Connect. Automated user provisioning and deprovisioning. Session management with automatic timeout.'
    },
    {
      icon: Server,
      title: 'Infrastructure Security',
      description: 'Hosted on enterprise-grade cloud infrastructure with DDoS protection, intrusion detection, and 24/7 security monitoring. Regular security patches and updates applied automatically.'
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', status: 'Certified' },
    { name: 'ISO 27001', status: 'In Progress' },
    { name: 'GDPR', status: 'Compliant' },
    { name: 'HIPAA', status: 'Ready' }
  ];

  const practices = [
    'Regular third-party penetration testing',
    'Automated vulnerability scanning',
    'Security awareness training for all team members',
    'Incident response plan with 24/7 on-call',
    'Responsible disclosure program',
    'Annual security audits',
    'Encrypted backups with tested restore procedures',
    'Network segmentation and firewalls',
    'Regular security updates and patches',
    'Secure development lifecycle (SDLC)'
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Security
            </h1>
            <p className="text-xl text-gray-600">
              Your crisis data is sensitive. We protect it with bank-grade encryption, comprehensive auditing, and industry-leading security practices.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Compliance & Certifications
          </h2>
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-sm text-green-600 font-medium">{cert.status}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Security Practices</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {practices.map((practice) => (
                <div key={practice} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{practice}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Future: PKI & HSM Integration
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              We're building next-generation security features including Public Key Infrastructure (PKI) for document signing and Hardware Security Module (HSM) integration for cryptographic key management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-blue-700 rounded-lg px-6 py-3 text-blue-50">
                Digital Document Signing
              </div>
              <div className="bg-blue-700 rounded-lg px-6 py-3 text-blue-50">
                Hardware Key Storage
              </div>
              <div className="bg-blue-700 rounded-lg px-6 py-3 text-blue-50">
                Advanced Threat Detection
              </div>
              <div className="bg-blue-700 rounded-lg px-6 py-3 text-blue-50">
                Zero-Knowledge Architecture
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Security Questions?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-8">
            Our security team is happy to discuss our practices, provide detailed documentation, or arrange a security review.
          </p>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Contact Security Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
