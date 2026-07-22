import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from 'next/navigation';


const PageHeader = ({title}) => {
  const router = useRouter();
  return (
      <div className={`flex gap-3 items-center`}>
              <div
            onClick={() => router.back()}
            className='cursor-pointer bg-gray-300 shadow-sm text-black rounded-md p-1'
          >
            <IoArrowBack size={22} />
          </div>
    
          <h1 className='text-center font-semibold text-2xl text-gray-900'>{title}</h1>
        </div>
  )
}

export default PageHeader