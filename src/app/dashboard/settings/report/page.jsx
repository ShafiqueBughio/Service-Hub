"use client";
import React, { useRef } from 'react';
import PageHeader from '@/components/general/PageHeader';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { useForm, useController } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reportIssueSchema } from '@/lib/validation';
import { MdClose, MdOutlineUpload } from 'react-icons/md';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

// ─── Attachment uploader ──────────────────────────────────────────────────────
const AttachmentUpload = ({ control, name, error }) => {
  const inputRef = useRef(null);
  const { field } = useController({ control, name, defaultValue: [] });

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    field.onChange([...field.value, ...newItems]);
    e.target.value = '';
  };

  const handleRemove = (idx) => {
    field.onChange(field.value.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Add Attachment</label>

      <div className="flex flex-wrap gap-3 items-start">
        {/* Uploaded thumbnails */}
        {field.value.map((item, idx) => (
          <div
            key={idx}
            className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0"
          >
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* red ✕ badge */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow cursor-pointer hover:bg-red-600 transition-colors"
            >
              <MdClose size={13} className="text-white" />
            </button>
          </div>
        ))}

        {/* Upload More box */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer"
        >
          <MdOutlineUpload size={22} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-medium">Upload More</span>
        </button>
      </div>

      {error?.Attachment && (
        <p className="text-red-500 text-sm">{error.Attachment.message}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const page = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(reportIssueSchema),
    defaultValues: { Subject: '', Description: '', Attachment: [] },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: wire up report issue API
      console.log('Report submitted:', data);
      toast.success('Issue reported successfully');
      reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="mb-4">
        <PageHeader title="Report an Issue" />
      </div>

      {/* Centered form */}
      <div className="flex flex-col items-center py-4 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 w-full max-w-xl"
        >
          <Input
            name="Subject"
            placeholder="Enter subject"
            label="Subject"
            register={register}
            errors={errors}
            type="text"
          />

          <TextArea
            errors={errors}
            name="Description"
            label="Description"
            register={register}
            placeholder="Enter description here..."
            rows={3}
          />

          <AttachmentUpload
            control={control}
            name="Attachment"
            error={errors}
          />

          {/* Submit button */}
          <Button
          text={"Submit"}
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
          className={"py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"}
          />
        </form>
      </div>
    </div>
  );
};

export default page;
