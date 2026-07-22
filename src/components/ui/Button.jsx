import React from 'react'

const Button = ({ text, className, isSubmitting, disabled }) => {
  return (
    <button
      type='submit'
      disabled={isSubmitting || disabled}
      className={`bg-primary-gradient w-full text-white rounded-lg py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? `${text}ing` : text}
    </button>
  )
}

export default Button
