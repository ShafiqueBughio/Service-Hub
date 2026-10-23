"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useProfileStore from '@/lib/store/profileStore';
import { UpdateProfile, getUserProfile } from '@/lib/api/auth';
import { editUserProfileSchema, editContractorProfileSchema } from '@/lib/validation';
import PageHeader from '@/components/general/PageHeader';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Dropdown from '@/components/ui/Dropdown';
import ServicesTagInput from '@/components/ui/ServicesTagInput';
import ServiceAreaInput from '@/components/ui/ServiceAreaInput';
import { MdAdd, MdDelete, MdUploadFile, MdClose } from 'react-icons/md';
import { FaUser, FaFilePdf } from 'react-icons/fa';

const GENDER_OPTIONS = [
  { value: 'MALE',   label: 'Male'   },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER',  label: 'Other'  },
];

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">{children}</h3>
);

// Each item is { type: 'existing', url: string } | { type: 'new', file: File }
const getPreview = (item) =>
  item.type === 'existing' ? item.url : URL.createObjectURL(item.file);

const isPdfItem = (item) =>
  item.type === 'existing'
    ? item.url?.toLowerCase().includes('.pdf')
    : item.file.type === 'application/pdf';

// ─── Document/Image tile with remove button ───────────────────────────────────
const ItemTile = ({ item, onRemove }) => {
  const preview = getPreview(item);
  const isPdf   = isPdfItem(item);

  return (
    <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shrink-0">
      {isPdf ? (
        <div className="w-full h-full bg-red-50 flex items-center justify-center">
          <FaFilePdf size={24} className="text-red-500" />
        </div>
      ) : (
        <img src={preview} alt="" className="w-full h-full object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors z-10"
      >
        <MdClose size={11} className="text-white" />
      </button>
    </div>
  );
};

// ─── Single-item uploader (business license) ─────────────────────────────────
const SingleUpload = ({ item, onSet, onRemove, label }) => {
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3 flex-wrap">
        {item ? (
          <ItemTile item={item} onRemove={onRemove} />
        ) : (
          <div className="w-20 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0">
            <MdUploadFile size={22} className="text-gray-300" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 px-3 py-2 rounded-full hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <MdUploadFile size={14} /> {item ? 'Replace' : 'Upload'}
        </button>
        <input
          ref={inputRef} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onSet({ type: 'new', file: f }); e.target.value = ''; }}
        />
      </div>
    </div>
  );
};

// ─── Multi-item uploader (certifications, portfolio) ─────────────────────────
const MultiUpload = ({ items, onItemsChange, label, accept = 'image/*,.pdf' }) => {
  const inputRef = useRef(null);

  const handleAdd = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    onItemsChange([...items, ...files.map((f) => ({ type: 'new', file: f }))]);
    e.target.value = '';
  };

  const remove = (idx) => onItemsChange(items.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2 items-start">
        {items.map((item, i) => (
          <ItemTile key={i} item={item} onRemove={() => remove(i)} />
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/40 transition-colors shrink-0"
        >
          <MdUploadFile size={18} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">Add</span>
        </button>
        <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={handleAdd} />
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const page = () => {
  const router     = useRouter();
  const profile    = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  

  const isContractor = profile?.user_type === 'CONTRACTOR';
  const details      = profile?.user_details ?? {};
  const cp           = profile?.contractor_profile ?? {};
  const documents    = cp.contractor_documents ?? [];
  const portfolios   = cp.contractor_portfolios ?? [];

  // ── State ─────────────────────────────────────────────────────────────────
  const [services,       setServices]       = useState([]);
  const [serviceAreas,   setServiceAreas]   = useState([]);
  const [avatarFile,     setAvatarFile]     = useState(null);
  const [avatarPreview,  setAvatarPreview]  = useState(null);
  // Business license: single item
  const [licenseItem,    setLicenseItem]    = useState(null);
  // Certifications: list of items
  const [certItems,      setCertItems]      = useState([]);
  // Portfolio: list of items
  const [portfolioItems, setPortfolioItems] = useState([]);

  const schema = isContractor ? editContractorProfileSchema : editUserProfileSchema;
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experiences' });

  // ── Populate from store ───────────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    const base = {
      first_name:    details.first_name    || '',
      last_name:     details.last_name     || '',
      address:       details.address       || '',
      city:          details.city          || '',
      state:         details.state         || '',
      contact_phone: details.contact_phone || '',
      gender:        details.gender        || '',
      email:         profile?.user_details?.contact_email || '',
    };
    if (isContractor) {
      const exps = (cp.contractor_experiences ?? []).map((e) => ({
        company: e.company || '', designation: e.designation || '',
        job_type: e.job_type || '', start_year: e.start_year || '', end_year: e.end_year || '',
      }));
      reset({ ...base, about: cp.about || '', experiences: exps });
      setServices((cp.contractor_services ?? []).map((s) => s.service_name));
      setServiceAreas(
        (cp.contractor_service_areas ?? []).map((a) => ({
          address: a.location || '',
          lat: a.latitude != null && a.latitude !== '' ? Number(a.latitude) : null,
          lng: a.longitude != null && a.longitude !== '' ? Number(a.longitude) : null,
        }))
      );

      // Business license
      const bl = documents.find((d) => d.document_type === 'BUSINESS_LICENSE');
      setLicenseItem(bl ? { type: 'existing', url: bl.document_url } : null);

      // Certifications
      setCertItems(
        documents.filter((d) => d.document_type === 'CERTIFICATION')
                 .map((d) => ({ type: 'existing', url: d.document_url }))
      );

      // Portfolio
      setPortfolioItems(portfolios.map((p) => ({ type: 'existing', url: p.image_url })));
    } else {
      reset(base);
    }
    if (details.profile_picture) setAvatarPreview(details.profile_picture);
  }, [profile]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      // Build flat arrays for backend:
      // existing items send their URL strings → backend keeps them
      // new items send File objects → backend uploads and gets new URLs
      const toPayloadList = (items) =>
        items.map((item) => item.type === 'existing' ? item.url : item.file);

      const payload = {
        first_name:    data.first_name,
        last_name:     data.last_name,
        address:       data.address,
        city:          data.city,
        state:         data.state,
        contact_phone: data.contact_phone || undefined,
        gender:        data.gender,
        email:         data.email,
        profile_picture: avatarFile ?? undefined,
        ...(isContractor && {
          about:       data.about || undefined,
          services,
          experiences: (data.experiences ?? []).map((e) => ({
            company: e.company, designation: e.designation,
            job_type: e.job_type, start_year: e.start_year, end_year: e.end_year || undefined,
          })),
          service_areas: serviceAreas
            .filter((a) => a?.address)
            .map((a) => ({
              location: a.address,
              latitude: a.lat != null ? String(a.lat) : '',
              longitude: a.lng != null ? String(a.lng) : '',
            })),
          // Always send these so backend knows the final desired state
          business_license: licenseItem
            ? (licenseItem.type === 'existing' ? licenseItem.url : licenseItem.file)
            : undefined,
          certifications:   toPayloadList(certItems),
          portfolio_images: toPayloadList(portfolioItems),
        }),
      };

      const res = await UpdateProfile(payload);
      if (res?.status?.success) {
        const fresh = await getUserProfile();
        if (fresh?.status?.success) setProfile(fresh.data);
        toast.success(res?.message || 'Profile updated successfully');
        router.push('/dashboard/profile');
      } else {
        toast.error(res?.message || 'Failed to update profile');
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 sm:mb-6"><PageHeader title="Edit Profile" /></div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto flex flex-col gap-6 pb-6">

        {/* ── Avatar ── */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-white shadow" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-gradient flex items-center justify-center shadow">
                <FaUser size={32} className="text-white" />
              </div>
            )}
            <label htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer hover:opacity-90 transition-opacity">
              <MdAdd size={14} className="text-white" />
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); } }} />
          </div>
          <p className="text-xs text-gray-400">Tap + to change photo</p>
        </div>

        {/* ── Basic Info ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <SectionTitle>Basic Info</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="first_name" label="First Name" placeholder="First name" register={register} errors={errors} type="text" />
            <Input name="last_name"  label="Last Name"  placeholder="Last name"  register={register} errors={errors} type="text" />
          </div>
          <Input name="contact_phone" label="Phone Number" placeholder="Phone number" register={register} errors={errors} type="text" />
          <Input name="email" label="Contact Email" placeholder="Email" register={register} errors={errors} type="email" />
          <Dropdown name="gender" label="Gender" register={register} errors={errors} options={GENDER_OPTIONS} placeholder="Select gender" />
        </div>

        {/* ── Address ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <SectionTitle>Address</SectionTitle>
          <TextArea name="address" label="Address" placeholder="Enter address" register={register} errors={errors} rows={3} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="city"  label="City"  placeholder="City"  register={register} errors={errors} type="text" />
            <Input name="state" label="State" placeholder="State" register={register} errors={errors} type="text" />
          </div>
        </div>

        {/* ── Contractor-only ── */}
        {isContractor && (
          <>
            {/* About */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionTitle>About</SectionTitle>
              <TextArea name="about" label="About Contractor" placeholder="Write something about yourself..."
                register={register} errors={errors} rows={4} />
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionTitle>Services</SectionTitle>
              <ServicesTagInput value={services} onChange={setServices} />
            </div>

            {/* Service Areas */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionTitle>Service Areas</SectionTitle>
              <ServiceAreaInput
                value={serviceAreas}
                onChange={setServiceAreas}
              />
            </div>

            {/* Experiences */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <SectionTitle>Experience</SectionTitle>
                <button type="button"
                  onClick={() => appendExp({ company: '', designation: '', job_type: '', start_year: '', end_year: '' })}
                  className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors cursor-pointer">
                  <MdAdd size={14} /> Add
                </button>
              </div>
              {expFields.length === 0 && <p className="text-sm text-gray-400">No experience added.</p>}
              {expFields.map((field, idx) => (
                <div key={field.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 relative">
                  <button type="button" onClick={() => removeExp(idx)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 cursor-pointer">
                    <MdDelete size={18} />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input name={`experiences.${idx}.company`}     label="Company"     placeholder="Company name"    register={register} errors={errors} type="text" />
                    <Input name={`experiences.${idx}.designation`} label="Designation" placeholder="e.g. Painter"    register={register} errors={errors} type="text" />
                    <Input name={`experiences.${idx}.job_type`}    label="Job Type"    placeholder="e.g. Full Time"  register={register} errors={errors} type="text" />
                    <Input name={`experiences.${idx}.start_year`}  label="Start Year"  placeholder="2020"            register={register} errors={errors} type="text" />
                    <Input name={`experiences.${idx}.end_year`}    label="End Year"    placeholder="2023 (optional)" register={register} errors={errors} type="text" />
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Documents */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-6">
              <SectionTitle>Verification Documents</SectionTitle>
              <SingleUpload
                label="Business License"
                item={licenseItem}
                onSet={setLicenseItem}
                onRemove={() => setLicenseItem(null)}
              />
              <MultiUpload
                label="Certifications"
                items={certItems}
                onItemsChange={setCertItems}
              />
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <SectionTitle>Portfolio Images</SectionTitle>
              <MultiUpload
                label="Portfolio"
                items={portfolioItems}
                onItemsChange={setPortfolioItems}
                accept="image/*"
              />
            </div>
          </>
        )}

        {/* ── Update Button ── */}
        <button type="submit" disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm bg-primary-gradient hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </button>

      </form>
    </div>
  );
};

export default page;
