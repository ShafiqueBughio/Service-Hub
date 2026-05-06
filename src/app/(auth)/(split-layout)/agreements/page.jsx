"use client"
import Agreements from '@/components/auth/Agreements'
import Title from '@/components/general/Title'
import React from 'react'
import { useSearchParams } from 'next/navigation'

const page = () => {
    const searchParams = useSearchParams();

    const activeTab = searchParams.get("active");
  return (
    <div className='w-full min-h-screen flex flex-col gap-6  py-8'>
        <Title title={"Agreements"}/>
        <Agreements active={activeTab}/>
    </div>
  )
}

export default page