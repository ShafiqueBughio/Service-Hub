import React from 'react'
import { GoLink } from 'react-icons/go';

const Heading = ({description}) => {
    return (
        <div className='relative z-10 flex flex-col items-center gap-2'>
            <div className='flex gap-1'>
                <h1 className='text-primary text-4xl'>Service</h1>
                <GoLink size={38} className='text-primary' />
                <h1 className='text-primary text-4xl'>Link</h1>
            </div>
            <p className='text-gray-800 text-center text-lg opacity-80 px-14'>
                {description}
            </p>
        </div>
    )
}

export default Heading