import React from 'react'
import { MdCheckCircle } from "react-icons/md";

const DetailRow = ({
    label,
  value,
  verified = false,
  multiline = false,
  last = false
}) => {
  return (
     <div
        className={`
          px-4 sm:px-5 py-4
          ${!last ? "border-b border-gray-100" : ""}
        `}
      >
        {multiline ? (
          <>
            <p className="text-sm font-bold text-gray-800 mb-1">
              {label}
            </p>
    
            <p className="text-sm text-gray-500 leading-relaxed break-words">
              {value || "—"}
            </p>
          </>
        ) : (
          <div
            className="
              flex flex-col
              xs:flex-row
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-1 sm:gap-4
            "
          >
            <p className="text-sm font-bold text-gray-800 shrink-0">
              {label}
            </p>
    
            <div className="flex items-center gap-1.5 min-w-0">
              {verified && (
                <MdCheckCircle
                  size={16}
                  className="text-green-500 shrink-0"
                />
              )}
    
              <p className="text-sm text-gray-500 break-words sm:text-right">
                {value || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
  )
}

export default DetailRow