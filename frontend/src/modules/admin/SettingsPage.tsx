import { Building2, Globe, Shield, Save } from 'lucide-react';
import { organisations } from '../mock/mockData';
import { Button } from '../shared/components';

export const SettingsPage = () => {
  const org = organisations[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres Organisation</h1>
        <p className="text-gray-600 mt-1">Configuration de votre organisation</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Building2 className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'organisation
              </label>
              <input
                type="text"
                defaultValue={org.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine
              </label>
              <input
                type="text"
                defaultValue={org.domain}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité
              </label>
              <input
                type="text"
                defaultValue={org.sector}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille
              </label>
              <input
                type="text"
                defaultValue={org.size}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Globe className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Localisation</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                defaultValue={org.country}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuseau horaire
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                <option>Europe/Paris (UTC+1)</option>
                <option>Europe/London (UTC+0)</option>
                <option>America/New_York (UTC-5)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Conformité</h2>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Certifications et normes
            </label>
            <div className="flex flex-wrap gap-2">
              {org.compliance.map(c => (
                <span
                  key={c}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            CrisisShield vous aide à maintenir votre conformité avec des logs d'audit inviolables,
            des rapports post-mortem structurés et une traçabilité complète.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan actuel</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{org.plan}</div>
              <p className="text-sm text-gray-600 mt-1">
                Membre depuis {new Date(org.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <Button variant="secondary">Gérer l'abonnement</Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};
