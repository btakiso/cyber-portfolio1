import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = "Failed to load data. Please try again.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
      <p className="text-white text-lg mb-4">{message}</p>
      <button 
        onClick={onRetry}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorMessage;