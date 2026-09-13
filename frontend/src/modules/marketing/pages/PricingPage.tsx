import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../../mock/mockData';

export const PricingPage = () => {
  const plans = pricingPlans.map(plan => ({
    name: plan.name,
    description: plan.description,
    price: plan.pricePerMonth ? `€${plan.pricePerMonth}` : 'Custom',
    period: plan.pricePerMonth ? 'per month' : 'contact us',
    features: plan.features,
    cta: plan.pricePerMonth ? 'Start Free Trial' : 'Contact Sales',
    highlighted: plan.highlight
  }));


  const faq = [
    {
      question: 'Can I try before I buy?',
      answer: 'Yes! We offer a 14-day free trial with full access to all PME features. No credit card required to start.'
    },
    {
      question: 'What happens after the trial?',
      answer: 'You can upgrade to a paid plan at any time. If you don\'t upgrade, your account will be downgraded to read-only mode, and you can still access your data.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, bank transfers, and can issue invoices for annual subscriptions. Enterprise clients can arrange custom payment terms.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes. We use bank-grade encryption, multi-tenant isolation, and regular security audits. All data is encrypted at rest and in transit.'
    },
    {
      question: 'Do you offer discounts?',
      answer: 'Yes! We offer discounts for annual subscriptions (15% off), non-profits (25% off), and educational institutions (30% off). Contact us for details.'
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your needs. All plans include our core crisis management features with 14-day free trial.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white shadow-2xl scale-105 border-4 border-blue-700'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-center mb-4">
                    <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <Link
                  to={plan.cta === 'Start Free Trial' ? '/app/login' : '/contact'}
                  className={`block w-full py-3 px-6 rounded-lg font-semibold text-center mb-8 transition ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="inline-block ml-2 w-4 h-4" />
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-yellow-400' : 'text-green-500'}`} />
                      <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faq.map((item) => (
              <div key={item.question} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is here to help you choose the right plan for your organization
          </p>
          <Link
            to="/contact"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Contact Sales Team
          </Link>
        </div>
      </section>
    </div>
  );
};
