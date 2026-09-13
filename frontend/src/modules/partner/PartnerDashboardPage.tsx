import { Building2 } from 'lucide-react';
import { usePartnerOrganisations } from '../api';
import { LoadingSpinner, EmptyState, Badge } from '../shared/components';
import { formatDate } from '../shared/utils/formatters';
import { Link } from 'react-router-dom';

export const PartnerDashboardPage = () => {
  const { data: orgs, isLoading } = usePartnerOrganisations();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center mb-8">
        <Building2 className="w-8 h-8 text-gray-700 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your client organisations</p>
        </div>
      </div>

      {!orgs || orgs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <EmptyState icon={Building2} title="No organisations" description="No client organisations available" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orgs.map((org) => (
            <Link key={org.id} to={`/partner/organisations/${org.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                    <Badge variant="info">{org.plan}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div><p className="text-xs text-gray-500">Plans</p><p className="text-xl font-bold text-gray-900">{org.stats.plansCount}</p></div>
                    <div><p className="text-xs text-gray-500">Active Crises</p><p className="text-xl font-bold text-gray-900">{org.stats.activeCrisesCount}</p></div>
                    <div><p className="text-xs text-gray-500">Users</p><p className="text-xl font-bold text-gray-900">{org.stats.usersCount}</p></div>
                    <div><p className="text-xs text-gray-500">Overdue Reviews</p><p className="text-xl font-bold text-gray-900">{org.stats.overdueReviewsCount}</p></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>Created {formatDate(org.createdAt)}</span>
                {org.lastActivity && <span>Last activity {formatDate(org.lastActivity)}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
