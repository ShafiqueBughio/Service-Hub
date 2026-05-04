import React from 'react'

const Button = ({text,className}) => {
  return (
    <button type='submit' className={`bg-primary-gradient w-full  text-white rounded-lg py-2.5 text-sm font-semibold  transition-colors cursor-pointer ${className}`}>{text}</button>
  )
}

export default Button