import { FileText, Download } from 'lucide-react';
import { EmptyState, Button, Badge } from '../shared/components';
import { reports, organisationUsers } from '../mock/mockData';
import { Link } from 'react-router-dom';

export const ReportsPage = () => {
  const getStatusBadge = (status: string) => {
    if (status === 'SIGNED') return <Badge variant="success">SIGNÉ</Badge>;
    if (status === 'DRAFT') return <Badge variant="warning">BROUILLON</Badge>;
    return <Badge variant="info">{status}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600 mt-1">Rapports post-mortem et d'audit générés</p>
        </div>
      </div>

      {!reports || reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <EmptyState icon={FileText} title="Aucun rapport" description="Aucun rapport n'a été généré" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rapport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signé par</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><Link to={`/app/reports/${report.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">{report.title}</Link></td>
                  <td className="px-6 py-4 whitespace-nowrap"><Badge variant="neutral">{report.type}</Badge></td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(report.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.signedBy ? organisationUsers.find(u => u.id === report.signedBy)?.fullName : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {report.status === 'SIGNED' && (
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    )}
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
