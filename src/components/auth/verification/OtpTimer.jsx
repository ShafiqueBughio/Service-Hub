"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL = 60; // seconds
const STORAGE_KEY = 'otp_timer_end';

const getInitialSeconds = () => {
  if (typeof window === 'undefined') return TOTAL;
  const endTime = localStorage.getItem(STORAGE_KEY);
  if (!endTime) return TOTAL;
  const remaining = Math.round((parseInt(endTime) - Date.now()) / 1000);
  // if remaining is valid, use it — otherwise timer already expired
  return remaining > 0 ? remaining : 0;
};

const OtpTimer = ({ onResend }) => {
  const [seconds, setSeconds] = useState(TOTAL); // start with TOTAL, hydrate after mount
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setExpired(true);
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // on mount — read from localStorage to restore timer after refresh
  useEffect(() => {
    const initial = getInitialSeconds();

    if (initial <= 0) {
      // timer already expired before refresh
      setSeconds(0);
      setExpired(true);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // first time — set endTime in localStorage
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + TOTAL * 1000));
    }

    setSeconds(initial);
    setExpired(false);
    startInterval();

    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  const handleResend = () => {
    // reset timer and store new endTime
    const newEnd = Date.now() + TOTAL * 1000;
    localStorage.setItem(STORAGE_KEY, String(newEnd));
    setSeconds(TOTAL);
    setExpired(false);
    startInterval();
    onResend?.();
  };

  // SVG circle progress
  const size = 120;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds / TOTAL;
  const dashOffset = circumference * (1 - progress);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className='flex flex-col items-center gap-5'>
      {/* circular timer */}
      <div className='relative' style={{ width: size, height: size }}>
        <svg width={size} height={size} className='-rotate-90'>
          {/* background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke='#e2f7f8'
            strokeWidth={strokeWidth}
          />
          {/* progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke='#027D8C'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        {/* inner filled circle + time */}
        <div
          className='absolute inset-0 flex items-center justify-center rounded-full text-white font-semibold text-lg'
          style={{
            background: 'linear-gradient(160deg, #a8edea 0%, #027D8C 100%)',
            margin: strokeWidth + 4,
          }}
        >
          {mm}:{ss}
        </div>
      </div>

      {/* resend */}
      <p className='text-sm text-gray-500 text-center'>
        Didn&apos;t receive the code?{' '}
        <button
          type='button'
          onClick={handleResend}
          disabled={!expired}
          className={`font-bold underline transition-colors ${
            expired ? 'text-gray-800 cursor-pointer' : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Resend
        </button>
      </p>
    </div>
  );
};

export default OtpTimer;
