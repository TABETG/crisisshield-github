import { Shield, Server, Users, Megaphone, Building, Heart } from 'lucide-react';

export const SolutionsPage = () => {
  const solutions = [
    {
      icon: Shield,
      title: 'Cybersecurity Incidents',
      subtitle: 'Ransomware, Data Breaches, DDoS Attacks',
      problem: 'Cyberattacks are increasing in frequency and sophistication. The average cost of a data breach is $4.45 million, and recovery time can take months.',
      risks: [
        'Loss of sensitive customer data',
        'Regulatory fines and legal liability',
        'Damage to brand reputation',
        'Extended downtime and revenue loss',
        'Loss of competitive advantage'
      ],
      solution: 'CrisisShield helps you respond faster with pre-built cybersecurity incident response plans. Activate your plan in seconds, coordinate your security team, notify stakeholders, and document every action for compliance.',
      benefits: [
        'Pre-tested response procedures reduce response time by 60%',
        'Clear role assignments eliminate confusion',
        'Automated compliance documentation',
        'Real-time coordination between IT, legal, and PR teams',
        'Post-incident analysis for continuous improvement'
      ]
    },
    {
      icon: Server,
      title: 'Infrastructure Outages',
      subtitle: 'Datacenter Failures, Cloud Outages, Network Disruptions',
      problem: 'IT infrastructure failures can halt business operations instantly. Every minute of downtime costs money and damages customer trust.',
      risks: [
        'Complete service unavailability',
        'Revenue loss from interrupted operations',
        'SLA breaches and penalties',
        'Customer churn and negative reviews',
        'Competitive disadvantage'
      ],
      solution: 'With CrisisShield, your incident response team has instant access to detailed recovery procedures. Track restoration progress in real-time, coordinate teams across time zones, and keep stakeholders informed.',
      benefits: [
        'Reduce mean time to recovery (MTTR) by 40%',
        'Parallel task execution across teams',
        'Automated stakeholder communication',
        'Mobile-accessible emergency runbooks',
        'Integration with monitoring and ticketing systems'
      ]
    },
    {
      icon: Users,
      title: 'HR & Workplace Crises',
      subtitle: 'Employee Safety, Workplace Violence, Executive Departures',
      problem: 'HR crises require immediate, sensitive handling. Mistakes can lead to legal liability, damaged morale, and public relations nightmares.',
      risks: [
        'Employee safety and wellbeing',
        'Legal liability and lawsuits',
        'Loss of key talent',
        'Damage to company culture',
        'Media scrutiny and reputation damage'
      ],
      solution: 'CrisisShield provides structured workflows for sensitive HR situations. Ensure proper protocols are followed, maintain confidentiality, coordinate with legal counsel, and document actions appropriately.',
      benefits: [
        'Standardized procedures ensure compliance',
        'Secure documentation with access controls',
        'Coordination between HR, legal, and security',
        'Template communications for various scenarios',
        'Protection of employee privacy'
      ]
    },
    {
      icon: Megaphone,
      title: 'Public Relations Crises',
      subtitle: 'Social Media Backlash, Product Recalls, Executive Scandals',
      problem: 'In the age of social media, PR crises can explode within hours. A single misstep in communication can turn a manageable situation into a catastrophe.',
      risks: [
        'Viral negative publicity',
        'Stock price decline',
        'Customer boycotts',
        'Loss of business partnerships',
        'Long-term brand damage'
      ],
      solution: 'Activate PR crisis playbooks instantly. Coordinate messaging across PR, legal, and executive teams. Track media coverage, monitor social sentiment, and ensure consistent communication.',
      benefits: [
        'Pre-approved message templates',
        'Clear approval workflows',
        'Centralized media inquiry tracking',
        'Timeline of all communications',
        'Post-crisis analysis and lessons learned'
      ]
    },
    {
      icon: Building,
      title: 'Supply Chain Disruptions',
      subtitle: 'Vendor Failures, Logistics Issues, Quality Problems',
      problem: 'Modern supply chains are complex and fragile. A single supplier failure can cascade through your entire operation.',
      risks: [
        'Production delays and stoppages',
        'Inability to fulfill customer orders',
        'Cost increases from emergency sourcing',
        'Contract penalties and SLA breaches',
        'Market share loss to competitors'
      ],
      solution: 'Maintain business continuity with supply chain contingency plans. Quickly identify alternative suppliers, reroute logistics, adjust production schedules, and communicate with customers.',
      benefits: [
        'Pre-vetted alternative suppliers',
        'Automated customer notifications',
        'Cross-functional coordination',
        'Financial impact tracking',
        'Lessons learned for resilience improvement'
      ]
    },
    {
      icon: Heart,
      title: 'Health & Safety Emergencies',
      subtitle: 'Pandemics, Workplace Accidents, Natural Disasters',
      problem: 'Health and safety crises put employee wellbeing at risk and can shut down operations. Swift, coordinated response is essential.',
      risks: [
        'Employee injury or loss of life',
        'Facility damage or inaccessibility',
        'Regulatory investigations',
        'Operational shutdown',
        'Legal and financial liability'
      ],
      solution: 'Activate emergency response procedures, coordinate with emergency services, manage facility evacuations, track employee safety, and ensure business continuity.',
      benefits: [
        'Mobile-accessible emergency procedures',
        'Employee check-in and accountability',
        'Coordination with emergency services',
        'Remote work activation protocols',
        'Compliance with safety regulations'
      ]
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Solutions for Every Crisis Scenario
            </h1>
            <p className="text-xl text-gray-600">
              Whether you face cyberattacks, infrastructure failures, or PR nightmares, CrisisShield helps you respond faster and more effectively.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={solution.title}>
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-start mb-12`}>
                    <div className="flex-1">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{solution.title}</h2>
                      <p className="text-lg text-blue-600 font-semibold mb-6">{solution.subtitle}</p>
                      <p className="text-gray-700 mb-6">{solution.problem}</p>
                    </div>
                    <div className="flex-1">
                      <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                        <h3 className="font-semibold text-gray-900 mb-3">At Risk:</h3>
                        <ul className="space-y-2">
                          {solution.risks.map((risk) => (
                            <li key={risk} className="flex items-start text-sm text-gray-700">
                              <span className="text-red-500 mr-2">•</span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 rounded-lg p-8">
                      <h3 className="font-semibold text-gray-900 mb-4 text-xl">How CrisisShield Helps</h3>
                      <p className="text-gray-700">{solution.solution}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-8">
                      <h3 className="font-semibold text-gray-900 mb-4 text-xl">Key Benefits</h3>
                      <ul className="space-y-2">
                        {solution.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start text-sm text-gray-700">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Handle Any Crisis?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            See how CrisisShield can help your organization prepare for and respond to critical incidents
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Schedule a Demo
          </button>
        </div>
      </section>
    </div>
  );
};
