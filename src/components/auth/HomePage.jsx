import React from 'react'
import Image from 'next/image';
import { contractor_avatar, user_avatar } from '@/assets/images';
import { GoLink } from "react-icons/go";
import Link from 'next/link';

const HomePage = () => {
    const userTypes = [
    {id:1,title:"I'M A USER",desc : "Post Jobs & hire professional",avatar : user_avatar,path:`/login?role=user`},
    {id:2,title : "I'M A CONTRACTOR",desc : "Post Jobs & hire professional",avatar:contractor_avatar,path:"/login?role=contractor"}
  ]
  return (
       <div className='w-[100vw] h-[100dvh] flex justify-center items-center '>
      <div className='w-full flex flex-col gap-24 items-center justify-center'>
        <div className='w-full flex flex-col justify-center items-center gap-2'>
          <div className='flex gap-1'>
          <h1 className='text-primary'>Service</h1>
          <GoLink size={34}/>
          <h1 className='text-primary'>Link</h1>
          </div>
        <p className='px-12 text-center'>Select your role to get the experience tailored to your needs</p>
        </div>

        <div className='grid md:grid-cols-2 grid-cols-1 md:gap-8 gap-24'>
      {
        userTypes.map((type)=>(
                  <Link href={type?.path} key={type.id} className='relative flex flex-col gap-1 border border-primary rounded-2xl text-center p-8 cursor-pointer'>
          <h5 className='text-secondary font-semibold'>{type?.title}</h5>
          <p className='text-gray-800'>{type?.desc}</p>

          <Image src={type?.avatar} alt='user' unoptimized width={140} height={140} className='absolute -top-20  right-14 border rounded-sm'/>

        </Link>
        ))
      }
        </div>
      </div>
    </div>
  )
}

export default HomePage