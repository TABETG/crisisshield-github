import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CheckCircle, Clock } from 'lucide-react';
import { reports, crisisEvents, organisationUsers } from '../mock/mockData';
import { Button, Badge } from '../shared/components';

export const ReportDetailPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const report = reports.find(r => r.id === reportId);
  const event = report ? crisisEvents.find(e => e.id === report.relatedEventId) : null;
  const author = report && report.signedBy ? organisationUsers.find(u => u.id === report.signedBy) : null;

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Rapport non trouv�</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/app/reports" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Retour aux rapports
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div className="flex items-start flex-1">
            <FileText className="w-8 h-8 text-blue-600 mr-3 mt-1" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="neutral">{report.type}</Badge>
                <Badge variant={report.status === 'SIGNED' ? 'success' : 'warning'}>
                  {report.status === 'SIGNED' ? 'SIGN�' : 'BROUILLON'}
                </Badge>
              </div>
            </div>
          </div>
          {report.status === 'SIGNED' && (
            <Button>
              <Download className="w-4 h-4 mr-2" />
              T�l�charger PDF
            </Button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-500">�v�nement associ�</p>
              <p className="text-sm text-gray-900 mt-1">{event?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date de cr�ation</p>
              <p className="text-sm text-gray-900 mt-1">{new Date(report.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
            {report.signedBy && report.signedAt && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sign� par</p>
                  <p className="text-sm text-gray-900 mt-1">{author?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de signature</p>
                  <p className="text-sm text-gray-900 mt-1">{new Date(report.signedAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">R�sum�</h3>
            <p className="text-gray-700 leading-relaxed">{report.summary}</p>
          </div>

          {event && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">D�tails de l'�v�nement</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">S�v�rit�</span>
                  <span className="text-sm font-medium text-gray-900">{event.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date de d�but</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(event.startedAt).toLocaleString('fr-FR')}</span>
                </div>
                {event.closedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date de cl�ture</span>
                    <span className="text-sm font-medium text-gray-900">{new Date(event.closedAt).toLocaleString('fr-FR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {report.status === 'SIGNED' ? (
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-green-900 mb-1">Rapport sign� et valid�</div>
                <div className="text-sm text-green-800">
                  Ce rapport post-mortem a �t� valid� et sign� �lectroniquement.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-900 mb-1">Brouillon en cours</div>
                <div className="text-sm text-yellow-800">Ce rapport est encore en cours de r�daction.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
