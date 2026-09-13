import { Target, Heart, Users, Zap } from 'lucide-react';

export const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe every organization deserves to be resilient. Our mission is to make enterprise-grade crisis management accessible to businesses of all sizes.'
    },
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'We build features our customers need, not what looks good on paper. Your feedback shapes our roadmap and drives our innovation.'
    },
    {
      icon: Users,
      title: 'Transparency',
      description: 'We believe in honest communication about our capabilities, limitations, and roadmap. No hidden fees, no surprise limitations.'
    },
    {
      icon: Zap,
      title: 'Continuous Improvement',
      description: 'Crisis management best practices evolve, and so do we. We constantly update our platform based on real-world incidents and lessons learned.'
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About CrisisShield
            </h1>
            <p className="text-xl text-gray-600">
              Building the future of enterprise crisis management
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6">
              CrisisShield was born from a simple observation: when crises strike, organizations scramble to find their response plans, coordinate teams, and document actions. Critical time is lost searching through emails, wikis, and shared drives. Miscommunication leads to mistakes. And after the crisis, there's no systematic way to learn and improve.
            </p>
            <p className="text-gray-700 mb-6">
              We knew there had to be a better way. A platform purpose-built for crisis management that would be always available, easy to use under pressure, and powerful enough for enterprise needs.
            </p>
            <p className="text-gray-700 mb-6">
              Today, CrisisShield helps organizations around the world prepare for and respond to critical incidents. From small businesses to large enterprises, from cyber incidents to natural disasters, our platform helps teams coordinate faster and respond more effectively.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-white rounded-lg p-8 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Us in Building Resilient Organizations
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Whether you're a customer, partner, or future team member, we'd love to hear from you.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
