import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../shared/components';
import { Link, useSearchParams } from 'react-router-dom';

export const BillingCheckoutReturnPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {isSuccess ? <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" /> : <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{isSuccess ? 'Payment Successful!' : 'Payment Failed'}</h1>
        <p className="text-gray-600 mb-6">{isSuccess ? 'Your subscription has been upgraded successfully.' : 'There was an issue processing your payment. Please try again.'}</p>
        <Link to="/billing"><Button>{isSuccess ? 'View Billing' : 'Back to Billing'}</Button></Link>
      </div>
    </div>
  );
};
