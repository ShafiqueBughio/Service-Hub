"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdNotifications,
  MdLocationOn,
  MdLock,
  MdHelpOutline,
  MdChat,
  MdInfo,
  MdBugReport,
  MdDeleteOutline,
  MdPlayCircleOutline,
} from 'react-icons/md';
import { FaShieldAlt } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import Modal from '@/components/general/Modal';
import { deleteUser } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import useTokenStore from '@/lib/store/tokenStore';

// ─── Chevron right icon ───────────────────────────────────────────────────────
const ChevronRight = () => (
  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </span>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, label, iconBg, iconColor, onClick, right }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:shadow-md hover:border-primary/20 transition-all text-left w-full group cursor-pointer"
  >
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <Icon size={20} className={iconColor} />
    </span>
    <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
      {label}
    </span>
    {right}
  </button>
);

// ─── Toggle switch ────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
    className={`relative inline-flex w-11 h-6 rounded-full shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
      ${checked ? 'bg-primary' : 'bg-gray-200'}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
        ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// ─── Section ─────────────────────────────────────────────────────────────────
const Section = ({ title, children, cols = 3 }) => (
  <div className="mb-8">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1 mb-3">
      {title}
    </h2>
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-3`}>
      {children}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [allowLocation, setAllowLocation] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //delete user 
  const confirmDelete = async()=>{
    try {
       const res = await deleteUser();
       if(res?.status?.success){
        setShowDeleteModal(false);
        // Clear access token from Zustand store
        useTokenStore.getState().clearAccessToken();
        // refresh_token is cleared by the backend via Set-Cookie: Max-Age=0
        router.push('/');
       }else{
        toast.error(res?.message || "Failed to delete account");
       }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || "Something went wrong");
      console.log("Error : ", error);
    }
  }


  return (
    <div className="h-full flex flex-col py-4">

      {/* ── Page heading ── */}
      <div className="mb-6 grid grid-cols-2">
        <h1 className="font-bold text-gray-900">Settings</h1>

          {/* ── Delete Account button ── */}
      <div className="ml-auto">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-8 py-3.5 rounded-2xl font-semibold text-white text-sm bg-primary-gradient hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer md:flex hidden"
        >
          <MdDeleteOutline size={20} />
          Delete Account
        </button>

        <button className='md:hidden block p-2 bg-primary text-white rounded-lg'
        onClick={()=>setShowDeleteModal(true)}
        >
          <MdDeleteOutline size={28} />
        </button>
      </div>
      </div>

      {/* ── Account Settings ── */}
      <div>
              <Section title="Account Settings" cols={3}>
        <FeatureCard
          icon={MdNotifications}
          label="Push Notifications"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() => setPushNotifications((v) => !v)}
          right={<Toggle checked={pushNotifications} onChange={setPushNotifications} />}
        />
        <FeatureCard
          icon={MdLocationOn}
          label="Allow Location"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() => setAllowLocation((v) => !v)}
          right={<Toggle checked={allowLocation} onChange={setAllowLocation} />}
        />
        <FeatureCard
          icon={MdLock}
          label="Change Password"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() => router.push('/dashboard/settings/change-password')}
          right={<ChevronRight />}
        />
      </Section>

      {/* ── Help & Support ── */}
      <Section title="Help & Support" cols={3}>
        <FeatureCard
          icon={MdHelpOutline}
          label="FAQs"
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          onClick={() => router.push('/dashboard/settings/faqs')}
          right={<ChevronRight />}
        />
        <FeatureCard
          icon={MdChat}
          label="Chat with Support"
          iconBg="bg-green-50"
          iconColor="text-green-500"
          onClick={() => router.push('/dashboard/settings/support')}
          right={<ChevronRight />}
        />
        <FeatureCard
          icon={MdPlayCircleOutline}
          label="How It Works"
          iconBg="bg-purple-50"
          iconColor="text-purple-500"
          onClick={() => router.push('/dashboard/settings/how-it-works')}
          right={<ChevronRight />}
        />
        <FeatureCard
          icon={MdBugReport}
          label="Report an Issue"
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
          onClick={() => router.push('/dashboard/settings/report')}
          right={<ChevronRight />}
        />
      </Section>

      {/* ── Legal Policies ── */}
      <Section title="Legal Policies" cols={3} >
        <FeatureCard
          icon={MdInfo}
          label="About App"
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
          onClick={() => router.push('/dashboard/settings/about')}
          right={<ChevronRight />}
        />
        <FeatureCard
          icon={IoDocumentTextOutline}
          label="Terms & Conditions"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() => router.push('/dashboard/settings/terms')}
          right={<ChevronRight />}
        />
        <FeatureCard
          icon={FaShieldAlt}
          label="Privacy Policy"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          onClick={() => router.push('/dashboard/settings/policy')}
          right={<ChevronRight />}
        />
      </Section>
      </div>

    

      {/* ── Delete Confirm Modal ── */}
      {showDeleteModal && (
        <Modal
          title="Delete Account"
          desc="Are you sure you want to delete your account?"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            confirmDelete();
          }}
        />
      )}
    </div>
  );
};

export default SettingsPage;
