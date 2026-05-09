"use client";

import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';

const Title = ({ title,className,isBack=true }) => {

  const router = useRouter();

  return (
    <div className={`flex gap-6 items-center  ${className}`}>

      {
        isBack && (
          <div
        onClick={() => router.back()}
        className='cursor-pointer bg-primary text-white rounded-md p-1'
      >
        <IoIosArrowBack size={22} />
      </div>
        )
      }

      <h1 className='text-center uppercase md:text-3xl text-2xl'>{title}</h1>
    </div>
  )
}

export default Title