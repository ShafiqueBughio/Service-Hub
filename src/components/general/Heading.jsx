import React from 'react'
import { GoLink } from 'react-icons/go';

const Heading = ({description}) => {
    return (
        <div className='relative z-10 flex flex-col items-center gap-2'>
            <div className='flex gap-1'>
                <h1 className='text-primary'>Service</h1>
                <GoLink size={34} />
                <h1 className='text-primary'>Link</h1>
            </div>
            <p className='text-gray-800 text-center px-14'>
                {description}
            </p>
        </div>

    )
}

export default Heading