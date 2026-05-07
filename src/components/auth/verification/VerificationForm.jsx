"use client"
import React, { useState } from 'react';
import OtpInput from './OtpInput';
import OtpTimer from './OtpTimer';

const VerificationForm = ({ onSubmit, onResend, length = 6 }) => {
  const [otp, setOtp] = useState('');

  const isComplete = otp.length === length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) return;
    onSubmit?.(otp);
  };

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col   gap-16'>

      {/* otp boxes */}
      <OtpInput length={length} value={otp} onChange={setOtp} />

      {/* circular timer + resend */}
      <div className='flex justify-center'>
        <OtpTimer onResend={() => { setOtp(''); onResend?.(); }} />
      </div>

      {/* verify button — disabled until all boxes filled */}
      <div className='flex justify-center'>
        <button
          type='submit'
          disabled={!isComplete}
          className={`w-full max-w-lg rounded-lg py-2.5 text-sm font-semibold transition-all bg-primary-gradient text-white
            ${isComplete
              ? 'cursor-pointer hover:opacity-90'
              : 'cursor-not-allowed opacity-50'
            }`}
        >
          Verify
        </button>
      </div>
    </form>
  );
};

export default VerificationForm;
