import React from 'react'
import { MdEdit } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import DetailRow from './DetailRow';
import { useRouter } from 'next/navigation';


const UserProfile = ({detailRows,profileData}) => {
    const router = useRouter();
    return (
        <div className="w-full h-full overflow-y-auto bg-white rounded-md p-3 sm:p-4">
            <div className="w-full ">
                {/* Section */}
                <div className="w-full flex flex-col gap-3 sm:gap-4">
                    <h4 className="font-semibold text-base sm:text-lg">
                        Profile overview
                    </h4>

                    {/* Avatar + Name */}
                    <div
                        className="
                    w-full
                    flex flex-col
                    items-center
                    justify-center
                    text-center
                    rounded-md
                    gap-2
                    bg-gray-100
                    p-5 sm:p-6
                  "
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            {profileData?.profilePicture ? (
                                <img
                                    src={profileData.profilePicture}
                                    alt={profileData.fullName}
                                    className="
                          w-20 h-20
                          sm:w-24 sm:h-24
                          rounded-full
                          object-cover
                          border-2
                          border-white
                          shadow
                        "
                                />
                            ) : (
                                <div
                                    className="
                          w-20 h-20
                          sm:w-24 sm:h-24
                          rounded-full
                          bg-primary-gradient
                          flex items-center justify-center
                          shadow
                        "
                                >
                                    <FaUser
                                        size={28}
                                        className="text-white sm:hidden"
                                    />

                                    <FaUser
                                        size={32}
                                        className="text-white hidden sm:block"
                                    />
                                </div>
                            )}

                            {/* Edit Button */}
                            <button
                                onClick={() =>
                                    router.push("/dashboard/profile/edit")
                                }
                                className="
                        absolute
                        bottom-0
                        right-0
                        w-7 h-7
                        bg-primary
                        rounded-full
                        flex items-center justify-center
                        border-2
                        border-white
                        shadow
                        cursor-pointer
                        hover:opacity-90
                        transition-opacity
                      "
                                aria-label="Edit profile"
                            >
                                <MdEdit size={14} className="text-white" />
                            </button>
                        </div>

                        {/* Name + Email */}
                        <div className="max-w-full px-2">
                            <h2
                                className="
                        text-base
                        sm:text-lg
                        font-bold
                        text-gray-900
                        break-words
                      "
                            >
                                {profileData?.fullName}
                            </h2>

                            <p
                                className="
                        text-xs
                        sm:text-sm
                        text-gray-400
                        break-all
                      "
                            >
                                {profileData?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div
                    className="
                  mt-4
                  sm:mt-5
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-x-4
                "
                >
                    {detailRows.map((row, index) => (
                        <DetailRow
                            key={row.label}
                            label={row.label}
                            value={row.value}
                            verified={row.verified}
                            multiline={row.multiline}
                            last={index === detailRows.length - 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserProfile