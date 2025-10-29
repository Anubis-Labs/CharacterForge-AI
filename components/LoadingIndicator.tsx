
import React from 'react';
import { ForgeIcon } from './icons';

interface LoadingIndicatorProps {
  stage: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ stage }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-secondary border-2 border-dashed border-border rounded-lg p-8 text-center">
      <ForgeIcon className="w-16 h-16 text-accent animate-pulse-fast" />
      <h3 className="text-2xl font-bold text-light mt-4">Forging in Progress...</h3>
      <p className="text-medium mt-2">{stage}</p>
    </div>
  );
};
