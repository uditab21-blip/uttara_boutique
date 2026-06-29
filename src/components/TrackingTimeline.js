'use client';

import React from 'react';

const ALL_MILESTONES = [
  { id: 'placed', label: 'Order Placed' },
  { id: 'confirmed', label: 'Order Confirmed' },
  { id: 'packed', label: 'Packed & Ready' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'in_transit', label: 'In Transit' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

const TrackingTimeline = ({ trackingHistory = [] }) => {
  // If cancelled, show a different view or add a cancelled state
  const isCancelled = trackingHistory.some(t => t.milestone === 'cancelled');
  
  const completedMilestones = trackingHistory.map(t => t.milestone);
  
  // Find the index of the latest milestone in our ALL_MILESTONES array
  let currentStepIndex = -1;
  for (let i = ALL_MILESTONES.length - 1; i >= 0; i--) {
    if (completedMilestones.includes(ALL_MILESTONES[i].id)) {
      currentStepIndex = i;
      break;
    }
  }

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <h3 className="text-red-800 font-bold">Order Cancelled</h3>
        <p className="text-red-600 text-sm">This order has been cancelled and is no longer being tracked.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 md:left-0 md:top-4 md:h-0.5 md:w-full"></div>
        
        {/* Active Progress Line */}
        {currentStepIndex >= 0 && (
          <div 
            className="absolute left-4 top-0 w-0.5 bg-gold-600 md:left-0 md:top-4 md:h-0.5" 
            style={{ 
              height: typeof window !== 'undefined' && window.innerWidth < 768 ? `${(currentStepIndex / (ALL_MILESTONES.length - 1)) * 100}%` : '0.5rem',
              width: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(currentStepIndex / (ALL_MILESTONES.length - 1)) * 100}%` : '0.5rem'
            }}
          ></div>
        )}

        <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:justify-between">
          {ALL_MILESTONES.map((milestone, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={milestone.id} className="relative flex items-start md:flex-col md:items-center md:text-center group">
                {/* Dot */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 z-10 transition-colors duration-200 ${
                  isCompleted ? 'bg-gold-600 border-gold-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="ml-4 md:ml-0 md:mt-2">
                  <h4 className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {milestone.label}
                  </h4>
                  {isCurrent && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gold-100 text-gold-800 rounded-full mt-1">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackingTimeline;
