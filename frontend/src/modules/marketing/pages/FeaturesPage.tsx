import { Link } from 'react-router-dom';
import {
  FileText, Zap, Download, BarChart3, Users, Lock, Bell,
  Database, Eye, GitBranch, Clock, Shield, CheckCircle, ArrowRight
} from 'lucide-react';

export const FeaturesPage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Crisis Plans Builder',
      subtitle: 'Intuitive Plan Creation',
      gradient: 'from-blue-500 to-cyan-500',
      details: [
        'Drag-and-drop plan editor with customizable templates',
        'Step-by-step procedures with role assignments',
        'Version control and approval workflows',
        'Rich text editing with embedded media support',
        'Plan categorization by type and criticality',
        'Automated review schedules and notifications'
      ]
    },
    {
      icon: Zap,
      title: 'War Room Coordination',
      subtitle: 'Real-Time Crisis Management',
      gradient: 'from-orange-500 to-red-500',
      details: [
        'Centralized command center for active crises',
        'Kanban-style task board (To Do, In Progress, Done, Blocked)',
        'Real-time timeline of all crisis activities',
        'Team collaboration with @mentions and notifications',
        'Severity escalation and status tracking',
        'Export detailed incident reports'
      ]
    },
    {
      icon: Download,
      title: 'Emergency Kits',
      subtitle: 'Offline Access When You Need It Most',
      gradient: 'from-green-500 to-emerald-500',
      details: [
        'Generate PDF packages of critical plans',
        'QR code access for instant mobile retrieval',
        'Print-ready formats for physical distribution',
        'Automated kit generation and expiration',
        'Include relevant documents and contact lists',
        'Works without internet connectivity'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      subtitle: 'Measure and Improve',
      gradient: 'from-purple-500 to-pink-500',
      details: [
        'Dashboard with key performance indicators',
        'Crisis frequency and duration tracking',
        'Response time metrics and SLA monitoring',
        'Team performance and task completion rates',
        'Compliance report generation',
        'Export data for custom analysis'
      ]
    },
    {
      icon: Users,
      title: 'Team Management',
      subtitle: 'Organize Your Response Teams',
      gradient: 'from-sky-500 to-blue-500',
      details: [
        'Role-based access control (RBAC)',
        'Support for multiple user roles (Admin, Manager, User, Auditor)',
        'Team assignment and notification settings',
        'User activity tracking and audit logs',
        'Single sign-on (SSO) integration ready',
        'Guest access for external stakeholders'
      ]
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      subtitle: 'Bank-Grade Protection',
      gradient: 'from-red-500 to-rose-500',
      details: [
        'End-to-end encryption for sensitive data',
        'Multi-tenant architecture with complete isolation',
        'SOC 2 Type II compliance ready',
        'Regular security audits and penetration testing',
        'GDPR and data residency compliance',
        'Secure document storage with access logs'
      ]
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      subtitle: 'Stay Informed',
      gradient: 'from-yellow-500 to-orange-500',
      details: [
        'Email notifications for critical events',
        'SMS alerts for high-priority incidents (coming soon)',
        'In-app notification center',
        'Customizable notification preferences',
        'Escalation paths for unacknowledged alerts',
        'Integration with Slack and Microsoft Teams (roadmap)'
      ]
    },
    {
      icon: Database,
      title: 'Document Management',
      subtitle: 'Centralize Critical Information',
      gradient: 'from-teal-500 to-cyan-500',
      details: [
        'Upload and organize crisis-related documents',
        'Version history and rollback capabilities',
        'Search across all documents and plans',
        'Secure sharing with external parties',
        'Support for all major file formats',
        'Automatic virus scanning'
      ]
    },
    {
      icon: Eye,
      title: 'Audit & Compliance',
      subtitle: 'Complete Transparency',
      gradient: 'from-slate-500 to-gray-600',
      details: [
        'Immutable audit log of all system activities',
        'Track who did what, when, and why',
        'Export audit logs for regulatory compliance',
        'Retention policies and automatic archival',
        'Tamper-proof logging with integrity verification',
        'Custom audit report generation'
      ]
    },
    {
      icon: GitBranch,
      title: 'Workflow Automation',
      subtitle: 'Streamline Your Processes',
      gradient: 'from-violet-500 to-purple-500',
      details: [
        'Automated task creation from plan activation',
        'Conditional workflows based on crisis severity',
        'Email templates for stakeholder communications',
        'Scheduled plan reviews and updates',
        'Automatic document expiration warnings',
        'Integration webhooks for external systems'
      ]
    },
    {
      icon: Clock,
      title: 'Timeline & History',
      subtitle: 'Never Lose Context',
      gradient: 'from-amber-500 to-orange-500',
      details: [
        'Chronological timeline of all crisis events',
        'Annotate timeline with notes and decisions',
        'Track task status changes over time',
        'Historical view of past crises',
        'Export timeline for post-mortem analysis',
        'Search and filter timeline entries'
      ]
    },
    {
      icon: Shield,
      title: 'Compliance Ready',
      subtitle: 'Meet Regulatory Requirements',
      gradient: 'from-emerald-500 to-green-600',
      details: [
        'Pre-built templates for common compliance frameworks',
        'ISO 22301 business continuity alignment',
        'NIST cybersecurity framework mapping',
        'Evidence collection for auditors',
        'Regular compliance reporting',
        'Certification support documentation'
      ]
    }
  ];

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Features Built for Crisis Management
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Everything you need to prepare for, respond to, and learn from critical incidents. Designed by crisis management experts, built for enterprise scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="group bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition shadow-xl inline-flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition border border-white/30 inline-flex items-center justify-center"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={feature.title} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}>
                  <div className="flex-1 lg:max-w-xl">
                    <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl items-center justify-center mb-6 shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">{feature.title}</h2>
                    <p className="text-xl text-blue-600 font-semibold mb-8">{feature.subtitle}</p>
                    <ul className="space-y-4">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-start group">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-lg leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className={`relative bg-gradient-to-br ${feature.gradient} rounded-3xl h-[450px] flex items-center justify-center shadow-2xl overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                      </div>
                      <div className="relative text-center p-8">
                        <Icon className="w-32 h-32 text-white/40 mx-auto mb-6" />
                        <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold border border-white/30">
                          Feature Preview
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            See CrisisShield in Action
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Schedule a personalized demo to see how CrisisShield can transform your crisis management capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition shadow-xl inline-flex items-center justify-center"
            >
              Book Your Demo
            </Link>
            <Link
              to="/pricing"
              className="bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-800 transition inline-flex items-center justify-center border border-blue-500"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
