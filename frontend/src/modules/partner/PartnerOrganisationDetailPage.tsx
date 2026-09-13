import { useParams, Link } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { usePartnerOrganisation } from '../api';
import { LoadingSpinner, Badge } from '../shared/components';
import { formatDate } from '../shared/utils/formatters';

export const PartnerOrganisationDetailPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { data: org, isLoading } = usePartnerOrganisation(orgId!);

  if (isLoading) return <LoadingSpinner />;
  if (!org) return <div className="text-center py-12"><p className="text-gray-600">Organisation not found</p></div>;

  return (
    <div>
      <Link to="/partner/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Back to dashboard</Link>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start">
          <Building2 className="w-8 h-8 text-blue-600 mr-3 mt-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
              <Badge variant="info">{org.plan}</Badge>
            </div>
            <p className="text-gray-600">Organisation ID: {org.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4"><p className="text-sm text-blue-600 mb-1">Crisis Plans</p><p className="text-3xl font-bold text-blue-900">{org.stats.plansCount}</p></div>
          <div className="bg-red-50 rounded-lg p-4"><p className="text-sm text-red-600 mb-1">Active Crises</p><p className="text-3xl font-bold text-red-900">{org.stats.activeCrisesCount}</p></div>
          <div className="bg-green-50 rounded-lg p-4"><p className="text-sm text-green-600 mb-1">Users</p><p className="text-3xl font-bold text-green-900">{org.stats.usersCount}</p></div>
          <div className="bg-yellow-50 rounded-lg p-4"><p className="text-sm text-yellow-600 mb-1">Overdue Reviews</p><p className="text-3xl font-bold text-yellow-900">{org.stats.overdueReviewsCount}</p></div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div><p className="text-sm font-medium text-gray-500">Created</p><p className="mt-1 text-sm text-gray-900">{formatDate(org.createdAt)}</p></div>
          {org.lastActivity && <div><p className="text-sm font-medium text-gray-500">Last Activity</p><p className="mt-1 text-sm text-gray-900">{formatDate(org.lastActivity)}</p></div>}
        </div>
      </div>
    </div>
  );
};
