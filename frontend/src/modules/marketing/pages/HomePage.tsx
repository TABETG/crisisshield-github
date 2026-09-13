import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, FileText, Users, BarChart3, Clock, CheckCircle, ArrowRight, TrendingUp, Award, AlertTriangle, ShieldCheck, Sparkles, Database, Activity } from 'lucide-react';
import { marketingStats } from '../../mock/mockData';

export const HomePage = () => {
  const stats = [
    { label: 'Organizations Protected', value: marketingStats.organisationsProtected.toString(), icon: Shield },
    { label: 'Incidents Handled', value: marketingStats.incidentsHandled.toString(), icon: Zap },
    { label: 'Avg. Detection', value: `${marketingStats.avgDetectionMinutes}min`, icon: Clock },
    { label: 'System Uptime', value: `${marketingStats.availabilityPercent}%`, icon: TrendingUp }
  ];

  const features = [
    {
      icon: FileText,
      title: 'Crisis Plans Builder',
      description: 'Create comprehensive crisis response plans with step-by-step procedures, role assignments, and automated workflows.'
    },
    {
      icon: Zap,
      title: 'Real-Time War Room',
      description: 'Coordinate crisis response in real-time with task tracking, timeline updates, and team collaboration in a centralized command center.'
    },
    {
      icon: ShieldCheck,
      title: 'Emergency Kits',
      description: 'Offline-ready crisis documentation with QR codes for instant access when systems are compromised or down.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Compliance',
      description: 'Complete audit trails, compliance reporting, and regulatory documentation for every action taken during incidents.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, multi-tenant isolation, role-based access control, and SOC 2 Type II compliance.'
    },
    {
      icon: Users,
      title: 'Team Orchestration',
      description: 'Coordinate across departments with clear role assignments, automated notifications, and real-time status updates.'
    }
  ];

  const useCases = [
    {
      icon: AlertTriangle,
      title: 'Ransomware Attack',
      description: 'Structured response with system isolation, secure communication, and recovery procedures.',
      stat: '92% faster'
    },
    {
      icon: Database,
      title: 'Data Breach',
      description: 'GDPR-compliant incident response with automated notifications and regulatory reporting.',
      stat: '100% compliant'
    },
    {
      icon: Activity,
      title: 'Service Outage',
      description: 'Coordinated failover, stakeholder communication, and impact mitigation protocols.',
      stat: '65% less downtime'
    }
  ];

  const benefits = [
    'Reduce response time by 80%',
    'Maintain compliance',
    'Coordinate teams',
    'Audit-ready reports',
    'Offline QR codes',
    'Threat intelligence'
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-200/40 to-accent-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent-200/30 to-primary-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full text-primary-700 text-sm font-medium mb-8 border border-primary-200 shadow-lg">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by {marketingStats.organisationsProtected}+ organizations worldwide
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Protect What Matters
              <span className="block bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 bg-clip-text text-transparent mt-2">
                With Confidence
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
              Enterprise crisis management platform that helps your team respond faster and smarter. Be prepared for any incident with battle-tested response procedures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/app/login"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl hover:from-primary-700 hover:to-primary-600 transition-all font-bold text-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-2xl hover:bg-primary-50 transition-all font-bold text-lg border-2 border-primary-200 shadow-lg hover:border-primary-300"
              >
                Explore Features
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-100">
                  <CheckCircle className="w-4 h-4 text-success-500 mr-2" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-b from-transparent to-primary-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-5 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by AI & Automation
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Manage Crises</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete platform designed to help you prepare, respond, and learn from critical incidents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="group bg-white rounded-3xl p-8 border-2 border-primary-100 hover:border-primary-300 transition-all shadow-lg hover:shadow-2xl hover:scale-105">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 mb-6 group-hover:from-primary-200 group-hover:to-accent-200 transition-all">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-5 py-2 bg-accent-100 rounded-full text-accent-700 text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Real-World Success Stories
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Proven in <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">Critical Situations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Organizations using CrisisShield respond faster and recover stronger from incidents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div key={useCase.title} className="bg-gradient-to-br from-white to-primary-50 rounded-3xl p-8 border-2 border-primary-200 hover:border-primary-300 transition-all shadow-lg hover:shadow-xl">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-primary-200 mb-6">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{useCase.description}</p>
                  <div className="inline-flex items-center px-4 py-2 bg-success-100 rounded-xl border border-success-300">
                    <TrendingUp className="w-4 h-4 text-success-700 mr-2" />
                    <span className="text-success-700 font-bold text-sm">{useCase.stat}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600">
        <div className="absolute inset-0 bg-dots-pattern opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 mb-8">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Secure Your Future?
          </h2>
          <p className="text-xl text-primary-50 mb-10 max-w-2xl mx-auto">
            Join hundreds of organizations that trust CrisisShield to protect their operations. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app/login"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-2xl hover:bg-primary-50 transition-all font-bold text-lg shadow-2xl hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all font-bold text-lg border-2 border-white/30"
            >
              Contact Sales
            </Link>
          </div>
          <p className="text-sm text-primary-100 mt-8">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};
