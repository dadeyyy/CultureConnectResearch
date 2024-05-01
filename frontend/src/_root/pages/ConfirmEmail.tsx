
import { useLocation } from 'react-router-dom';

const ConfirmEmail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isSuccess = searchParams.get('success') === 'true';

  return (
    <div className="container mx-auto mt-10">
      <div className="max-w-md mx-auto bg-white p-8 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          {isSuccess ? 'Email Confirmed Successfully!' : 'Email Confirmation Failed'}
        </h2>
        <p className="text-lg">
          {isSuccess
            ? 'Thank you for confirming your email. You can now proceed to login.'
            : 'Oops! Something went wrong with the email confirmation. Please try again.'}
        </p>
        <div className="mt-6">
          <a href="/signin" className="text-blue-600 font-semibold hover:underline">
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
