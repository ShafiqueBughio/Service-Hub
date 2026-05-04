import React from 'react'

const Divider = () => {
  return (
    <div className="flex items-center gap-3 w-full">
  <div className="flex-1 h-px bg-gray-300"></div>

  <span className="text-sm text-gray-700 font-medium">
    Or
  </span>

  <div className="flex-1 h-px bg-gray-300"></div>
</div>
  )
}

export default Divider