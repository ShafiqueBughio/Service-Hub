import React from 'react'
import {
  BadgeCheck,
  Clock3,
  CircleX,
  ShieldCheck,
} from "lucide-react";

const statusConfig = {
  VERIFIED: {
    label: "Verified",
    icon: BadgeCheck,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  PENDING: {
    label: "Verification Pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  REJECTED: {
    label: "Verification Rejected",
    icon: CircleX,
    className: "bg-red-50 text-red-700 border-red-200",
  },
  NOT_SUBMITTED: {
    label: "Not Submitted",
    icon: ShieldCheck,
    className: "bg-gray-50 text-gray-600 border-gray-200",
  },
};

const VerificationBadge = ({
  status = "PENDING",
  showLabel = true,
  handleClick,
  className = "",
}) => {
     const config = statusConfig[status] ?? statusConfig.NOT_SUBMITTED;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex w-fit items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${config.className} ${className}`}
      title={config.label}
      onClick={handleClick}
    >
      <Icon size={14} strokeWidth={2.2}  className="shrink-0" />

      {showLabel && <span className='leading-none text-center'>{config.label}</span>}
    </span>
  )
}

export default VerificationBadge