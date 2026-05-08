"use client";

import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from 'next/navigation';

const Title = ({ title,className }) => {

  const router = useRouter();

  return (
    <div className={`flex gap-6 items-center  ${className}`}>

      <div
        onClick={() => router.back()}
        className='cursor-pointer bg-primary text-white rounded-md p-1'
      >
        <IoIosArrowBack size={22} />
      </div>

      <h1 className='text-center'>{title}</h1>
    </div>
  )
}

export default Title