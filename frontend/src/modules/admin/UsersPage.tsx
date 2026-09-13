import { UserPlus, Mail } from 'lucide-react';
import { organisationUsers } from '../mock/mockData';
import { Button, Badge } from '../shared/components';

export const UsersPage = () => {
  const getRoleBadge = (role: string) => {
    if (role === 'ORG_ADMIN') return <Badge variant="danger">ADMIN</Badge>;
    if (role === 'ORG_MANAGER') return <Badge variant="info">MANAGER</Badge>;
    if (role === 'ORG_AUDITOR') return <Badge variant="warning">AUDITOR</Badge>;
    return <Badge variant="neutral">USER</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">
            {organisationUsers.length} membres de l'équipe HexaBank
          </p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organisationUsers.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              {getRoleBadge(user.role)}
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{user.fullName}</h3>
            <p className="text-sm text-gray-600 mb-3">{user.jobTitle}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </div>
            <div className="text-xs text-gray-500">
              Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Rôles et permissions</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="danger">ADMIN</Badge>
            <p className="text-sm text-gray-600">
              Accès complet : gestion des utilisateurs, plans, crises, facturation
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="info">MANAGER</Badge>
            <p className="text-sm text-gray-600">
              Création et activation des plans, gestion des crises, war room
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="neutral">USER</Badge>
            <p className="text-sm text-gray-600">
              Consultation des plans, participation aux crises, tâches assignées
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="warning">AUDITOR</Badge>
            <p className="text-sm text-gray-600">
              Lecture seule : plans, crises, rapports, logs d'audit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
