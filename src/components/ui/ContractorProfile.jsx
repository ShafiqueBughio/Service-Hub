"use client"
import React, { useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { MdEdit, MdCheckCircle } from 'react-icons/md';
import { FaUser, FaFilePdf } from 'react-icons/fa';
import { MdChevronRight } from 'react-icons/md';
import DetailRow from './DetailRow';
import { MdVerifiedUser } from "react-icons/md";

const ServiceAreasDisplayMap = lazy(() => import('./ServiceAreasDisplayMap'));

// ─── Section title ────────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <h3 className="text-base font-bold text-gray-900 mb-3">{children}</h3>
);

// ─── Experience card ──────────────────────────────────────────────────────────
const ExperienceCard = ({ exp }) => {
  const years = [exp.start_year, exp.end_year].filter(Boolean).join('–');
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-primary">{exp.company || '—'}</p>
        {years && <p className="text-sm text-gray-500 shrink-0">{years}</p>}
      </div>
      {(exp.designation || exp.job_type) && (
        <p className="text-sm text-gray-500 mt-0.5">
          {[exp.designation, exp.job_type].filter(Boolean).join(' · ')}
        </p>
      )}
    </div>
  );
};

// ─── Document tile ────────────────────────────────────────────────────────────
const DocTile = ({ url, label }) => {
  if (!url) return null;
  const isPdf = typeof url === 'string' && url.toLowerCase().includes('.pdf');
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1 cursor-pointer group"
    >
      {isPdf ? (
        <div className="w-16 h-20 bg-red-50 rounded-lg flex items-center justify-center border border-red-100 group-hover:border-red-300 transition-colors">
          <FaFilePdf size={32} className="text-red-500" />
        </div>
      ) : (
        <img
          src={url}
          alt={label}
          className="w-[50%] h-[50%] object-cover rounded-lg border border-gray-200"
        />
      )}
      <p className="text-xs text-gray-500">{label}</p>
    </a>
  );
};

// ─── Main ContractorProfile component ────────────────────────────────────────
const ContractorProfile = ({ profileData, contractorData }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null); // 'services' | 'portfolio'

  const cp = contractorData ?? {};
  const experiences  = cp.contractor_experiences  ?? [];
  const services     = cp.contractor_services     ?? [];
  const serviceAreas = cp.contractor_service_areas ?? [];
  const documents    = cp.contractor_documents    ?? [];
  const portfolios   = cp.contractor_portfolios   ?? [];

  const businessLicense = documents.find((d) => d.document_type === 'BUSINESS_LICENSE');
  const certifications  = documents.filter((d) => d.document_type === 'CERTIFICATION');

  return (
    <div className="w-full h-full overflow-y-auto bg-white rounded-md p-3 sm:p-4 flex flex-col gap-5">

      {/* ── Header card ── */}
      <div className="w-full flex flex-col items-center justify-center text-center rounded-md gap-2 bg-gray-100 p-5 relative">
        {/* Avatar */}
        <div className="relative shrink-0">
          {profileData?.profilePicture ? (
            <img
              src={profileData.profilePicture}
              alt={profileData.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary-gradient flex items-center justify-center shadow">
              <FaUser size={32} className="text-white" />
            </div>
          )}
          {/* Edit button */}
          <button
            onClick={() => router.push('/dashboard/profile/edit')}
            className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Edit profile"
          >
            <MdEdit size={14} className="text-white" />
          </button>
        </div>

        {/* Name + verified + location */}
        <div className="flex items-center gap-2 justify-center">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">{profileData?.fullName || '—'}</h2>
          {profileData?.emailVerified && (
            <MdVerifiedUser size={20} className="text-green-500 shrink-0" />
          )}
        </div>
        {(profileData?.city || profileData?.state) && (
          <p className="text-sm text-gray-400">
            {[profileData.city, profileData.state].filter(Boolean).join(', ')}
          </p>
        )}
      </div>

      {/* ── Quick-action tabs ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab(activeTab === 'services' ? null : 'services')}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-colors
            ${activeTab === 'services' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-primary/40'}`}
        >
          Service Offering
          <MdChevronRight size={18} className={`transition-transform ${activeTab === 'services' ? 'rotate-90' : ''}`} />
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'portfolio' ? null : 'portfolio')}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-colors
            ${activeTab === 'portfolio' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-primary/40'}`}
        >
          Portfolio
          <MdChevronRight size={18} className={`transition-transform ${activeTab === 'portfolio' ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* ── Services panel ── */}
      {activeTab === 'services' && (
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionTitle>Services Offered</SectionTitle>
          {services.length === 0 ? (
            <p className="text-sm text-gray-400">No services listed.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s.id} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {s.service_name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Portfolio panel ── */}
      {activeTab === 'portfolio' && (
        <div className="bg-gray-50 rounded-xl p-4">
          <SectionTitle>Portfolio</SectionTitle>
          {portfolios.length === 0 ? (
            <p className="text-sm text-gray-400">No portfolio images.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {portfolios.map((p) => (
                <a key={p.id} href={p.image_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={p.image_url}
                    alt="portfolio"
                    className="w-full aspect-square object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── About Contractor ── */}
      <div>
        <SectionTitle>About Contractor</SectionTitle>
        <p className="text-sm text-gray-500 leading-relaxed">
          {cp.about || '—'}
        </p>
      </div>

      {/* ── Experience ── */}
      {experiences.length > 0 && (
        <div>
          <SectionTitle>Experience</SectionTitle>
          <div className="bg-white rounded-xl border border-gray-100 px-4">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} />
            ))}
          </div>
        </div>
      )}

      {/* ── Service Areas — one map, multiple pins ── */}
      {serviceAreas.length > 0 && (
        <div>
          <SectionTitle>Service Areas</SectionTitle>
          <Suspense
            fallback={
              <div className="w-full h-52 rounded-xl bg-gray-100 animate-pulse" />
            }
          >
            <ServiceAreasDisplayMap areas={serviceAreas} />
          </Suspense>
        </div>
      )}

      {/* ── Contact & Business Info ── */}
      <div>
        <SectionTitle>Contact &amp; Business Info</SectionTitle>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <DetailRow
            label="Contact Email"
            value={profileData?.contact_email}
            verified={profileData?.emailVerified}
          />
          <DetailRow
            label="Phone Number"
            value={profileData?.phone}
            verified={profileData?.phoneVerified}
            last
          />
        </div>
      </div>

      {/* ── Verification Documents ── */}
      {(businessLicense || certifications.length > 0) && (
        <div>
          <SectionTitle>Verification Documents</SectionTitle>
          <div className="flex flex-col gap-4">
            {businessLicense && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Business License</p>
                <DocTile url={businessLicense.document_url} label="Business License" />
              </div>
            )}
            {certifications.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert, i) => (
                    <DocTile key={cert.id ?? i} url={cert.document_url} label={`Cert ${i + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorProfile;
