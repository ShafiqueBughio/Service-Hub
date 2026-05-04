"use client"
import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { contractor_avatar, user_avatar } from '@/assets/images';
import { GoLink } from "react-icons/go";
import useAuthStore from '@/lib/store/store';
import Heading from '../general/Heading';

const HomePage = () => {
  const router = useRouter();
  const setRole = useAuthStore((state) => state.setRole);

  const userTypes = [
    { id: 1, title: "I'M A USER", role: "user", desc: "Post Jobs & hire professional", avatar: user_avatar },
    { id: 2, title: "I'M A CONTRACTOR", role: "contractor", desc: "Post Jobs & hire professional", avatar: contractor_avatar }
  ];

  const handleSelect = (role) => {
    setRole(role);
    router.push('/login');
  };

  return (
    <div className='w-[100vw] h-[100dvh] flex justify-center items-center'>
      <div className='w-full flex flex-col gap-24 items-center justify-center'>
        <Heading description={"Select your role to get the experience tailored to your needs"}/>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-8'>
          {userTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleSelect(type.role)}
              className='relative flex flex-col gap-1 border border-primary rounded-2xl text-center p-8 cursor-pointer'
            >
              <h5 className='text-secondary font-semibold'>{type?.title}</h5>
              <p className='text-gray-800'>{type?.desc}</p>

              <Image
                src={type?.avatar}
                alt='user'
                unoptimized
                width={140}
                height={140}
                className='absolute -top-20 right-14 border rounded-sm'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
