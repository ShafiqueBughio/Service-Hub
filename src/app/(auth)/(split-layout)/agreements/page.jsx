"use client"
import Agreements from '@/components/auth/Agreements'
import MobileAuthLayout from '@/components/auth/MobileAuthLayout'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import Title from '@/components/general/Title'

const page = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("active") ?? "terms";

  return (
    <>
      {/* ── MOBILE ── */}
      <MobileAuthLayout>
        <div className='flex-1 flex flex-col min-h-0'>
          <Agreements active={activeTab} />
        </div>
      </MobileAuthLayout>

      {/* ── DESKTOP ── */}
      <div className='hidden md:flex w-full h-full flex-col gap-4 px-12 py-10 min-h-0'>
        <Title title={"Agreements"}/>
        <div className='flex-1 min-h-0 flex flex-col'>
          <Agreements active={activeTab}/>
        </div>
      </div>
    </>
  )
}

export default page
