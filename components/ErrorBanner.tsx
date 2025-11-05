
import React from 'react';
import { InfoIcon } from './Icons';

interface ErrorBannerProps {
  message: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  return (
    <div className="bg-red-500 text-white p-3 flex items-center" role="alert">
      <InfoIcon className="h-5 w-5 mr-3 flex-shrink-0" />
      <p className="text-sm font-medium">
        <span className="font-bold">Error:</span> An issue occurred while communicating with the server. ({message})
      </p>
    </div>
  );
};

export default ErrorBanner;
