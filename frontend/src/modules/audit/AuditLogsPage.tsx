import { Shield, Download } from 'lucide-react';
import { auditLogs } from '../mock/mockData';
import { Button } from '../shared/components';

export const AuditLogsPage = () => {
  const getActionColor = (action: string) => {
    if (action.includes('CREATED')) return 'bg-green-100 text-green-700';
    if (action.includes('ACTIVATED')) return 'bg-blue-100 text-blue-700';
    if (action.includes('CHANGED')) return 'bg-yellow-100 text-yellow-700';
    if (action.includes('DECISION')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs d'Audit</h1>
          <p className="text-gray-600 mt-1">
            Traçabilité complète des actions - {auditLogs.length} entrées
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Détails
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4 flex items-start">
        <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
        <div className="text-sm text-blue-900">
          <span className="font-semibold">Conformité NIS2 & ISO 22301 :</span> Tous les logs sont
          conservés pendant 2 ans minimum et chiffrés en base. Exportation disponible sur demande.
        </div>
      </div>
    </div>
  );
};
