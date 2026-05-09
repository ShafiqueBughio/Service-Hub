import Heading from '@/components/general/Heading';
import Image from 'next/image';

export default function SplitLayout({ children }) {
  return (
    <div className='w-[100vw] h-[100dvh] flex'>

      {/* Left Side — background image with branding */}
      <div className='hidden md:flex w-1/2 h-full relative flex-col justify-center items-center'>
        <Image
          src='/background_img.png'
          alt='background'
          fill
          className='object-cover'
          priority
        />
        {/* dark overlay */}
        <div className='absolute inset-0' />

        {/* branding */}
        <Heading description={"Connecting users with the right professionals"} />
      </div>

      {/* Right Side — page content (form) */}
      <div className='w-full md:w-1/2 h-full flex flex-col items-center overflow-hidden'>
        {children}
      </div>

    </div>
  );
}
