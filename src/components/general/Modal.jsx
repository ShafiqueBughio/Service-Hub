import React from 'react'
import {  MdDeleteOutline} from "react-icons/md"

const Modal = ({title,desc,onCancel,onConfirm}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-4">
                  <MdDeleteOutline size={28} className="text-red-500" />
                </div>
                <h3 className="text-center font-bold text-gray-900 text-lg mb-1">{title}</h3>
                <p className="text-center text-sm text-gray-500 mb-6">
                  {desc}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
  )
}

export default Modal