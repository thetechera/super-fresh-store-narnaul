import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center animate-pulse">
    <div className="p-3 rounded-full mr-4 bg-gray-200 h-12 w-12"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md animate-pulse ${className}`}>
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
    </div>
)

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);