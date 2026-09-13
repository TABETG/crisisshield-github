import { CreditCard, Download, TrendingUp, Users, HardDrive } from 'lucide-react';
import { billingOverview } from '../mock/mockData';
import { Button, Badge } from '../shared/components';

export const BillingOverviewPage = () => {
  const { currentPlan, usage, invoices } = billingOverview;

  const usagePercentUsers = (usage.currentUsers / usage.maxUsers) * 100;
  const usagePercentStorage = (usage.storageUsedGB / usage.storageMaxGB) * 100;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
        <p className="text-gray-600 mt-1">Gérez votre abonnement et consultez vos factures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h2>
                {currentPlan.highlight && <Badge variant="success">ACTUEL</Badge>}
              </div>
              <p className="text-gray-700">{currentPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {currentPlan.pricePerMonth ? `${currentPlan.pricePerMonth}€` : 'Sur mesure'}
              </div>
              <div className="text-sm text-gray-600">par mois</div>
            </div>
          </div>
          <div className="space-y-2">
            {currentPlan.features.slice(0, 4).map((feature, i) => (
              <div key={i} className="flex items-center text-sm text-gray-700">
                <span className="text-blue-600 mr-2">✓</span>
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-blue-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Prochaine facturation: <span className="font-semibold">{billingOverview.nextBillingDate}</span>
            </div>
            <Button variant="secondary">Changer de plan</Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Résumé du mois</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentPlan.pricePerMonth}€
              </div>
              <div className="text-sm text-gray-600">Montant HT</div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Crises actives</span>
                <span className="font-medium">{usage.activeCrises}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plans créés</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Utilisateurs</h3>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {usage.currentUsers} / {usage.maxUsers === 999 ? '∞' : usage.maxUsers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(usagePercentUsers, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {usagePercentUsers.toFixed(0)}% d'utilisation
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HardDrive className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Stockage</h3>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {usage.storageUsedGB} GB / {usage.storageMaxGB} GB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-green-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(usagePercentStorage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {usagePercentStorage.toFixed(0)}% d'utilisation
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Factures</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.amount} {invoice.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={invoice.status === 'PAID' ? 'success' : 'warning'}>
                      {invoice.status === 'PAID' ? 'PAYÉE' : 'EN ATTENTE'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
