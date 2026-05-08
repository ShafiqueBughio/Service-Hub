import React from 'react';
import Input from '@/components/ui/Input';

const ExperienceFields = ({ index, register, errors }) => {
  const base = `experiences.${index}`;
  const err = errors?.experiences?.[index];

  return (
    <div className='flex flex-col gap-3'>
      <Input
        name={`${base}.company`}
        type='text'
        placeholder='Company'
        register={register}
        errors={{ [`${base}.company`]: err?.company }}
      />
      <Input
        name={`${base}.jobType`}
        type='text'
        placeholder='Job Type'
        register={register}
        errors={{ [`${base}.jobType`]: err?.jobType }}
      />
      <Input
        name={`${base}.designation`}
        type='text'
        placeholder='Designation'
        register={register}
        errors={{ [`${base}.designation`]: err?.designation }}
      />
      <div className='grid grid-cols-2 gap-3'>
        <Input
          name={`${base}.startYear`}
          type='number'
          placeholder='Start Year'
          register={register}
          errors={{ [`${base}.startYear`]: err?.startYear }}
        />
        <Input
          name={`${base}.endYear`}
          type='number'
          placeholder='End Year'
          register={register}
          errors={{ [`${base}.endYear`]: err?.endYear }}
        />
      </div>
    </div>
  );
};

export default ExperienceFields;
