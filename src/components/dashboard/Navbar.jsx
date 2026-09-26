"use client"
import React, { useState, useEffect } from 'react';
import { MdNotifications, MdChat, MdLocationOn, MdKeyboardArrowDown } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import useProfileStore from '@/lib/store/profileStore';

const Navbar = () => {
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const [location, setLocation] = useState('Fetching location...');

  // Derive display name and email from profile
  const firstName = profile?.user_details?.first_name || '';
  const lastName  = profile?.user_details?.last_name  || '';
  const userName  = [firstName, lastName].filter(Boolean).join(' ') || profile?.email || 'User';
  const userEmail = profile?.email || '';
  const avatarLetter = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Location unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();
          const addr = data.address;
          const short = [addr?.road, addr?.city || addr?.town || addr?.village, addr?.country]
            .filter(Boolean)
            .join(', ');
          setLocation(short || data.display_name);
        } catch {
          setLocation(`${lat.toFixed(3)}, ${lng.toFixed(3)}`);
        }
      },
      () => setLocation('Location unavailable')
    );
  }, []);

  return (
    <header
      className='h-16 flex items-center justify-between px-6 bg-cover bg-center relative shrink-0'
      style={{ backgroundImage: "url('/background_img.png')" }}
    >
      {/* overlay */}
      <div className='absolute inset-0 bg-black/30' />

      {/* content */}
      <div className='relative z-10 flex items-center justify-between w-full gap-4'>

        {/* location */}
        <button className='w-full flex flex-col items-center gap-0.5 min-w-0'>
          <span className='text-white/70 text-xs'>Your Location</span>
          <div className='flex items-center gap-1 text-white'>
            <MdLocationOn size={16} className='text-primary shrink-0' style={{ filter: 'brightness(2)' }} />
            <span className='text-sm font-semibold truncate max-w-[180px] md:max-w-xs'>
              {location}
            </span>
            <MdKeyboardArrowDown size={18} className='shrink-0' />
          </div>
        </button>

        {/* right side */}
        <div className='flex items-center gap-3'>

          {/* chat */}
          <button className='relative w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors'>
            <MdChat size={18} />
          </button>

          {/* notifications */}
          <button className='relative w-9 h-9 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors'>
            <MdNotifications size={18} />
            <span className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold'>
              3
            </span>
          </button>

          {/* user — click to go to profile */}
          <button
            onClick={() => router.push('/dashboard/profile')}
            className='flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer'
          >
            <div className='w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center text-white font-bold text-sm shrink-0'>
              {avatarLetter}
            </div>
            <div className='hidden md:block text-left'>
              <p className='text-white text-sm font-semibold leading-tight'>{userName}</p>
              <p className='text-white/60 text-xs'>{userEmail}</p>
            </div>
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
