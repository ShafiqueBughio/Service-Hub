"use client"
import React, { useRef } from 'react';

const OtpInput = ({ length = 6, value, onChange }) => {
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, ''); // digits only
    if (!val) return;

    const newOtp = value.split('');
    newOtp[idx] = val[val.length - 1]; // take last digit if pasted multiple
    onChange(newOtp.join(''));

    // move focus forward
    if (idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = value.split('');
      if (newOtp[idx]) {
        newOtp[idx] = '';
        onChange(newOtp.join(''));
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        const prev = value.split('');
        prev[idx - 1] = '';
        onChange(prev.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = value.split('');
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    onChange(newOtp.join(''));
    // focus last filled or next empty
    const nextIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[nextIdx]?.focus();
  };

  return (
    <div className='w-full flex justify-center gap-3'>
      {Array.from({ length }).map((_, idx) => {
        const isFilled = !!value[idx];
        const isActive = value.length === idx || (idx === 0 && value.length === 0);

        return (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={value[idx] || ''}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className={`
              w-12 h-12 md:w-14 md:h-14 text-center text-lg font-semibold
              rounded-2xl border-2 outline-none transition-all
              ${isFilled
                ? 'bg-primary-gradient text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-200'
              }
              ${isActive ? 'border-primary' : ''}
              focus:border-primary
            `}
          />
        );
      })}
    </div>
  );
};

export default OtpInput;
