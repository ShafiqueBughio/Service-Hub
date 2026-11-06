"use client"
import React from 'react';
import { MdLocationOn } from 'react-icons/md';

// ─── Job type badge ───────────────────────────────────────────────────────────
const JobTypeBadge = ({ type }) => {
  const isLive = type === 'LIVE';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
      ${isLive ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
      <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-primary'}`} />
      {isLive ? 'Live Auction' : 'Regular Bidding'}
    </span>
  );
};

// ─── Bid avatars ──────────────────────────────────────────────────────────────
const BidAvatars = ({ count }) => {
  if (!count || count === 0) return null;
  const visible = Math.min(count, 2);
  const extra   = count - visible;

  return (
    <div className="flex items-center -space-x-2">
      {Array.from({ length: visible }).map((_, i) => (
        <div key={i}
          className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center shrink-0 overflow-hidden">
          <span className="text-xs text-gray-500 font-medium">
            {String.fromCharCode(65 + i)}
          </span>
        </div>
      ))}
      {extra > 0 && (
        <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white text-xs font-bold shrink-0">
          +{extra}
        </div>
      )}
    </div>
  );
};

// ─── Expire label ─────────────────────────────────────────────────────────────
const expireLabel = (expireDays, createdAt) => {
  if (!expireDays || !createdAt) return null;
  const expiresAt   = new Date(createdAt).getTime() + expireDays * 24 * 60 * 60 * 1000;
  const remaining   = Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
  if (remaining <= 0) return 'Expired';
  if (remaining === 1) return '1 day';
  return `${remaining} days`;
};

// ─── Date formatter ───────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

// ─── Main ProjectCard ─────────────────────────────────────────────────────────
const ProjectCard = ({ job, onClick }) => {
  const expire   = expireLabel(job?.expire_days, job?.created_at);
  const bidCount = job?._count?.bids ?? 0;
  const isExpired = expire === 'Expired';

  return (
    <button
      type="button"
      onClick={() => onClick?.(job)}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
    >
      {/* Title + Badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-gray-900 flex-1 min-w-0 line-clamp-1">
          {job?.title || '—'}
        </h3>
        <JobTypeBadge type={job?.job_type} />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        {job?.description || '—'}
      </p>

      {/* Expire + Created */}
      <div className="flex items-center gap-6 text-sm">
        <span>
          Expire in:{' '}
          <span className={`font-semibold ${isExpired ? 'text-gray-400' : 'text-red-500'}`}>
            {expire ?? '—'}
          </span>
        </span>
        <span>
          Created on:{' '}
          <span className="font-semibold text-primary">{formatDate(job?.created_at)}</span>
        </span>
      </div>

      {/* Avatars */}
      {bidCount > 0 && <BidAvatars count={bidCount} />}

      {/* Location */}
      {job?.location?.loc && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MdLocationOn size={16} className="text-primary shrink-0" />
          <span className="line-clamp-1">{job.location.loc}</span>
        </div>
      )}
    </button>
  );
};

export default ProjectCard;
