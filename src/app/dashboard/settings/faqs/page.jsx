"use client"
import React, { useState } from 'react'
import PageHeader from '@/components/general/PageHeader'
import { IoMdAdd, IoMdRemove } from "react-icons/io";

const faqs = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 5,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 6,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 7,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 8,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 9,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
  {
    id: 10,
    title: "Lorem ipsum dolor sit, consectetur",
    desc: "Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua. Ut enim ad minim veniam, quis eiusmod tempor incididunt"
  },
];

const page = () => {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="mb-4">
        <PageHeader title="FAQ'S" />
      </div>

      {/* Accordion list */}
      <div className="w-full flex flex-col gap-3 py-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="w-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
            >
              {/* Question row */}
              <button
                onClick={() => toggle(faq.id)}
                className={`w-full flex justify-between items-center px-5 py-4 text-left transition-all cursor-pointer
                  ${isOpen ? 'bg-primary-gradient' : 'bg-white hover:bg-gray-50'}`}
              >
                <span className={`text-sm font-semibold ${isOpen ? 'text-white' : 'text-gray-800'}`}>
                  {faq.title}
                </span>
                <span className={`shrink-0 ml-4 text-xl font-light ${isOpen ? 'text-white' : 'text-gray-500'}`}>
                  {isOpen ? <IoMdRemove size={20} /> : <IoMdAdd size={20} />}
                </span>
              </button>

              {/* Answer — slides open */}
              {isOpen && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
