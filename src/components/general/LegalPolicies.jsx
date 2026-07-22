import React from 'react'
import PageHeader from './PageHeader'

const LegalPolicies = ({title,data}) => {
  return (
     <div className="h-full flex flex-col">

      {/* Header with back button */}
      <div className="mb-6">
        <PageHeader title={title} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="md:px-12 px-4 flex flex-col gap-6">
          {data.map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              {section.heading && (
                <h2 className="text-base font-bold text-gray-900">
                  {section.heading}
                </h2>
              )}
              <p className="text-sm text-gray-600 leading-7">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LegalPolicies