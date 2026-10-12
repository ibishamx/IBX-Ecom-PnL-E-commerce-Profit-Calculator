import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ValidationIssue } from '../types/calculator';

interface Props {
  issues: ValidationIssue[];
}

export const ValidationBanner: React.FC<Props> = ({ issues }) => {
  if (issues.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {issues.map((issue, idx) => {
        const isError = issue.type === 'error';
        const isWarning = issue.type === 'warning';

        return (
          <div
            key={idx}
            className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm transition-all ${
              isError
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : isWarning
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-semibold mr-1.5">
                {isError ? 'Order Conflict Error:' : isWarning ? 'Warning:' : 'Note:'}
              </span>
              <span>{issue.message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
