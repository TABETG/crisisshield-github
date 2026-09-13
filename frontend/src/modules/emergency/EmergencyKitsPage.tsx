import { Link } from 'react-router-dom';
import { Package, Download, QrCode, FileText } from 'lucide-react';
import { emergencyKits } from '../mock/mockData';
import { Button, Badge } from '../shared/components';

export const EmergencyKitsPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kits d'Urgence</h1>
        <p className="text-gray-600 mt-1">
          Documents PDF hors-ligne avec QR codes pour accès rapide en crise
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Qu'est-ce qu'un kit d'urgence ?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Un kit d'urgence est une version PDF imprimable de votre plan de crise, avec QR code
              pour accès rapide. À distribuer aux équipes critiques et à afficher dans les locaux.
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                Accès hors-ligne (pas besoin d'internet)
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                QR code pour lancer la war room directement
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                Contacts d'urgence et checklist complète
              </li>
            </ul>
          </div>
        </div>
      </div>

      {emergencyKits.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucun kit d'urgence généré</p>
          <Link to="/app/crisis/plans">
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Créer un kit depuis un plan
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyKits.map(kit => {
            const isExpired = new Date(kit.expiresAt) < new Date();
            return (
              <div
                key={kit.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                  {isExpired ? (
                    <Badge variant="danger">EXPIRÉ</Badge>
                  ) : (
                    <Badge variant="success">ACTIF</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{kit.planName}</h3>
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <div>Généré le {new Date(kit.generatedAt).toLocaleDateString('fr-FR')}</div>
                  <div>
                    Expire le {new Date(kit.expiresAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const content = `Kit d'Urgence: ${kit.planName}\n\nContenu du PDF:\n- Plan de crise complet\n- Checklist détaillée\n- Contacts d'urgence\n- Procédures step-by-step\n- QR code pour accès mobile\n\nGénéré le: ${new Date(kit.generatedAt).toLocaleDateString('fr-FR')}\nExpire le: ${new Date(kit.expiresAt).toLocaleDateString('fr-FR')}`;
                      alert(content);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium inline-flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                  <button
                    onClick={() => {
                      const url = `https://app.crisisshield.io/warroom/${kit.planId}`;
                      alert(`QR Code - ${kit.planName}\n\nURL: ${url}\n\nScannez ce QR code pour:\n- Accéder au plan hors-ligne\n- Lancer la war room\n- Consulter la checklist\n\nImprimez et affichez dans vos locaux.`);
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium inline-flex items-center justify-center"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
