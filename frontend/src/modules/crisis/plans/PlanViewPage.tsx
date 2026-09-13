import { useParams, Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Zap } from 'lucide-react';
import { crisisPlans, crisisEvents } from '../../mock/mockData';
import { Button, Badge } from '../../shared/components';

export const PlanViewPage = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const plan = crisisPlans.find(p => p.id === planId);

  if (!plan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Plan non trouvé</p>
      </div>
    );
  }

  const handleActivate = () => {
    const ongoingCrisis = crisisEvents.find(e => e.status === 'EN_COURS' && e.planId === planId);
    if (ongoingCrisis) {
      navigate(`/app/crisis/events/${ongoingCrisis.id}`);
    } else {
      alert('En production, cette action créerait un nouvel événement de crise. En démo, consultez la crise ransomware en cours.');
      navigate('/app/crisis/events/event-ransomware-nov');
    }
  };

  const getCriticalityColor = (c: string) => {
    if (c === 'CRITIQUE') return 'bg-red-100 text-red-700';
    if (c === 'HAUTE') return 'bg-orange-100 text-orange-700';
    if (c === 'MOYENNE') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div>
      <Link
        to="/app/crisis/plans"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour aux plans
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div className="flex items-start flex-1">
            <FileText className="w-8 h-8 text-blue-600 mr-3 mt-1" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="neutral">{plan.type}</Badge>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getCriticalityColor(plan.criticality)}`}>
                  {plan.criticality}
                </span>
                <Badge variant={plan.status === 'ACTIVE' ? 'success' : 'warning'}>
                  {plan.status}
                </Badge>
                <span className="text-sm text-gray-500">Version {plan.version}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link to={`/app/crisis/plans/${planId}/edit`}>
              <Button variant="secondary">Éditer</Button>
            </Link>
            {plan.status === 'ACTIVE' && (
              <Button onClick={handleActivate}>
                <Zap className="w-4 h-4 mr-2" />
                Activer le plan
              </Button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900">{plan.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-500">Créé le</p>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(plan.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mis à jour le</p>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(plan.updatedAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prochaine revue</p>
              <p className="text-sm text-gray-900 mt-1">{plan.nextReviewDate}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Étapes du plan ({plan.steps.length})
            </h3>
            <div className="space-y-4">
              {plan.steps.map((step, i) => (
                <div
                  key={step.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start flex-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mr-3 flex-shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getCriticalityColor(step.criticality)}`}>
                      {step.criticality}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3 pl-13">
                    <span>
                      Rôle: <span className="font-medium text-gray-700">{step.role}</span>
                    </span>
                    {step.targetDurationMinutes && (
                      <span>
                        Durée cible:{' '}
                        <span className="font-medium text-gray-700">
                          {step.targetDurationMinutes} min
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
