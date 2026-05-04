import HomePage from '@/components/auth/HomePage';
import React from 'react';

const page = () => {

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background_img.png')",
      }}>
      <HomePage/>
    </div>
  );
}

export default page;
