import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Zap, FileText } from 'lucide-react';
import { EmptyState, Button, Badge } from '../../shared/components';
import { crisisPlans } from '../../mock/mockData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PlansListPage = () => {
  const plans = crisisPlans;
  const navigate = useNavigate();
  const [activatingId] = useState<string | null>(null);

  const handleActivate = async (_planId: string) => {
    if (!window.confirm('Voulez-vous activer ce plan de crise ?')) return;
    alert('Fonctionnalité disponible en production. En démo, consultez la crise ransomware en cours.');
    navigate('/app/crisis/events/event-ransomware-nov');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') return <Badge variant="success">{status}</Badge>;
    if (status === 'DRAFT') return <Badge variant="warning">{status}</Badge>;
    return <Badge variant="neutral">{status}</Badge>;
  };

  const getCriticalityBadge = (criticality: string) => {
    if (criticality === 'CRITIQUE') return <Badge variant="danger">{criticality}</Badge>;
    if (criticality === 'HAUTE') return <Badge variant="danger">{criticality}</Badge>;
    if (criticality === 'MOYENNE') return <Badge variant="warning">{criticality}</Badge>;
    return <Badge variant="info">{criticality}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crisis Plans</h1>
        <Link to="/app/crisis/plans/new"><Button><Plus className="w-4 h-4 mr-2" />Créer un plan</Button></Link>
      </div>
      {!plans || plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <EmptyState icon={FileText} title="Aucun plan de crise" description="Créez votre premier plan de crise" action={<Link to="/app/crisis/plans/new"><Button><Plus className="w-4 h-4 mr-2" />Créer un plan</Button></Link>} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criticité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prochaine revue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mis à jour</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{plan.name}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{plan.type.replace(/_/g, ' ')}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">{getCriticalityBadge(plan.criticality)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(plan.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.nextReviewDate || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(plan.updatedAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/app/crisis/plans/${plan.id}`}><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></Link>
                      <Link to={`/app/crisis/plans/${plan.id}/edit`}><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></Link>
                      {plan.status === 'ACTIVE' && <Button variant="ghost" size="sm" onClick={() => handleActivate(plan.id)} disabled={activatingId === plan.id}><Zap className="w-4 h-4" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
