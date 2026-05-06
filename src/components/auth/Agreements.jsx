"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const TABS = [
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'policy', label: 'Privacy Policy' },
]

const CONTENT = {
  terms: [
    {
      heading: null,
      body: `Lorem Ipsum Dolor Sit Amet Consectetur. Sit Scelerisque Nibh Ullamcorper Justo Nisl Tortor Habitant Egestas Cras. Vitae Mauris Duis Faucibus Aliquam Nascetur. Quam Ut Id Mi Ut. Tempus In Amet Sed Volutpat Tristique Vestibulum Elementum. Ipsum Viverra Vitae Egestas Facilisis. Tempus Sed Egestas Ullamcorper Dictum Integer Magna Sit Quam Pellentesque. Accumsan Nunc Risus Donec Quis Purus Sed Id. Diam Sit Massa Ornare Purus Nisi Quam. Donec Scelerisque Eu Lectus Aliquam Tellus Nisl Eget Ut. Consequat Faucibus Sagittis Semper Felis Orci Eu. Posuere Gravida Etiam Suspendisse Proin Auctor Netus. Aliquam At At Aliquam Eget. Aliquam Eget Pretium Malesuada Lacus In. Arcu Scelerisque Quis Dui Accumsan Sagittis Vel Eu.`,
    },
    {
      heading: 'Lorem ipsum dolor sit amet consectetur.',
      body: `Lorem Ipsum Dolor Sit Amet Consectetur. Sit Scelerisque Nibh Ullamcorper Justo Nisl Tortor Habitant Egestas Cras. Vitae Mauris Duis Faucibus Aliquam Nascetur. Quam Ut Id Mi Ut. Tempus In Amet Sed Volutpat Tristique Vestibulum Elementum. Ipsum Viverra Vitae Egestas Facilisis. Tempus Sed Egestas Ullamcorper Dictum Integer Magna Sit Quam Pellentesque. Accumsan Nunc Risus Donec Quis Purus Sed Id. Diam Sit Massa Ornare Purus Nisi Quam. Donec Scelerisque Eu Lectus Aliquam Tellus Nisl Eget Ut. Consequat Faucibus Sagittis Semper Felis Orci Eu. Posuere Gravida Etiam Suspendisse Proin Auctor Netus. Aliquam At At Aliquam Egestas Felis Eget. Pretium Malesuada Lacus In.`,
    },
  ],
  policy: [
    {
      heading: null,
      body: `This Privacy Policy describes how Service Link collects, uses, and shares information about you when you use our services. We are committed to protecting your personal data and your right to privacy. If you have any questions or concerns about this policy, please contact us.`,
    },
    {
      heading: 'Information We Collect.',
      body: `We collect information you provide directly to us, such as when you create an account, fill out a form, or contact us for support. This may include your name, email address, phone number, and any other information you choose to provide. We also collect information automatically when you use our services, including log data, device information, and cookies.`,
    },
  ],
}

const Agreements = ({ active = 'terms' }) => {
  const [activeTab, setActiveTab] = useState(active)

  const router = useRouter();

  const handleTabChange = (tabId)=>{
    setActiveTab(tabId)

    router.push(`/agreements?active=${tabId}`)
  }

  useEffect(()=>{
    setActiveTab(active);
  },[active])

  return (
    <div className='w-full  bg-blue-50 rounded-2xl flex flex-col overflow-hidden'>

      {/* Tab Header */}
      <div className='flex border-b border-gray-200 bg-blue-50'>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors
              ${activeTab === tab.id
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-400 border-b-2 border-transparent'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5'>
        {CONTENT[activeTab].map((section, idx) => (
          <div key={idx} className='flex flex-col gap-2'>
            {section.heading && (
              <h4 className='font-bold text-gray-900'>{section.heading}</h4>
            )}
            <p className='text-gray-600 text-justify leading-6'>{section.body}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Agreements
