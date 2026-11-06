import React from 'react';
import { FaUser } from 'react-icons/fa';
import { MdClose, MdCheck, MdChat } from 'react-icons/md';

/**
 * Single bidder row — avatar, name, location, action buttons.
 * @param {object}   bid        — bid object from API
 * @param {Function} onAccept
 * @param {Function} onReject
 * @param {Function} onChat
 */
const BidderRow = ({ bid, onAccept, onReject, onChat }) => {
  const details = bid?.contractor?.user_details ?? {};
  const name    = [details.first_name, details.last_name].filter(Boolean).join(' ') || 'Contractor';
  const avatar  = details.profile_picture;

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 flex items-center justify-center">
        {avatar
          ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
          : <FaUser size={20} className="text-gray-400" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
        </div>
        {bid?.quote_price != null && (
          <p className="text-xs text-gray-500">${bid.quote_price.toLocaleString()}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onReject?.(bid)}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors cursor-pointer"
          aria-label="Reject"
        >
          <MdClose size={16} />
        </button>
        <button
          type="button"
          onClick={() => onAccept?.(bid)}
          className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="Accept"
        >
          <MdCheck size={16} />
        </button>
        <button
          type="button"
          onClick={() => onChat?.(bid)}
          className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label="Chat"
        >
          <MdChat size={16} />
        </button>
      </div>
    </div>
  );
};

export default BidderRow;
