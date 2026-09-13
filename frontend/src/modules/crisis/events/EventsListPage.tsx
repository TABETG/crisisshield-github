import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { EmptyState, Button, Badge } from '../../shared/components';
import { crisisEvents, crisisPlans } from '../../mock/mockData';

export const EventsListPage = () => {
  const events = crisisEvents.map(e => ({
    ...e,
    planName: crisisPlans.find(p => p.id === e.planId)?.name || 'Unknown'
  }));

  const getStatusBadge = (status: string) => {
    if (status === 'EN_COURS') return <Badge variant="danger">EN COURS</Badge>;
    if (status === 'CLOTURE') return <Badge variant="success">CLÔTURÉE</Badge>;
    return <Badge variant="warning">{status}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === 'CRITIQUE') return <Badge variant="danger">CRITIQUE</Badge>;
    if (severity === 'HAUTE') return <Badge variant="danger">HAUTE</Badge>;
    if (severity === 'MOYENNE') return <Badge variant="warning">MOYENNE</Badge>;
    return <Badge variant="info">{severity}</Badge>;
  };

  const calculateDuration = (startTime: string, endTime?: string | null) => {
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Événements de Crise</h1>
      </div>

      {!events || events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <EmptyState
            icon={AlertTriangle}
            title="Aucun événement de crise"
            description="Aucune crise n'a été activée pour le moment"
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sévérité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.planName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(event.severity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.startedAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateDuration(event.startedAt, event.closedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/app/crisis/events/${event.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        War Room
                      </Button>
                    </Link>
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
