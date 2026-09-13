import { Server, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useSystemStatus } from '../api';
import { LoadingSpinner, Badge } from '../shared/components';
import { formatDateTime } from '../shared/utils/formatters';

export const SystemStatusPage = () => {
  const { data: status, isLoading } = useSystemStatus();

  if (isLoading) return <LoadingSpinner />;
  if (!status) return null;

  const getStatusIcon = (status: 'UP' | 'DOWN' | 'DEGRADED') => {
    if (status === 'UP') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'DOWN') return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusBadge = (status: 'UP' | 'DOWN' | 'DEGRADED') => {
    const variants = { UP: 'success' as const, DOWN: 'danger' as const, DEGRADED: 'warning' as const };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Server className="w-8 h-8 text-gray-700 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600 mt-1">Platform health and services monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Platform Version</p>
          <p className="text-2xl font-bold text-gray-900">{status.version}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Uptime</p>
          <p className="text-2xl font-bold text-gray-900">{Math.round(status.uptime / 3600)}h</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Last Health Check</p>
          <p className="text-sm font-medium text-gray-900">{formatDateTime(status.security.lastHealthCheck)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-gray-700 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Security Status</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">PKI Status</p>
            <div className="flex items-center space-x-2">
              {status.security.pkiStatus === 'HEALTHY' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
              <span className="font-medium text-gray-900">{status.security.pkiStatus}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">HSM Connection</p>
            <div className="flex items-center space-x-2">
              {status.security.hsmConnected ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
              <span className="font-medium text-gray-900">{status.security.hsmConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        {status.security.certificateInfo && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">Certificate Information</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-gray-500">Common Name</p><p className="font-medium text-gray-900">{status.security.certificateInfo.commonName}</p></div>
              <div><p className="text-gray-500">Issuer</p><p className="font-medium text-gray-900">{status.security.certificateInfo.issuer}</p></div>
              <div><p className="text-gray-500">Expires</p><p className="font-medium text-gray-900">{formatDateTime(status.security.certificateInfo.expiresAt)}</p></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Services</h2>
        <div className="space-y-4">
          {status.services.map((service, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                {service.responseTime && <span className="text-sm text-gray-600">{service.responseTime}ms</span>}
                {getStatusBadge(service.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
