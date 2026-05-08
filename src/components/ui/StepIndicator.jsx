import React from 'react';

const StepIndicator = ({ totalSteps, currentStep }) => {
  return (
    <div className='flex items-center gap-2 w-full'>
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={stepNum}>
            {/* step circle */}
            <div className='flex flex-col items-center gap-1'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${isCompleted ? 'bg-primary text-white' : ''}
                  ${isActive ? 'bg-primary text-white ring-4 ring-primary/20' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? (
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3'>
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
            </div>

            {/* connector line — not after last step */}
            {idx < totalSteps - 1 && (
              <div className={`flex-1 h-0.5 transition-all ${stepNum < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
