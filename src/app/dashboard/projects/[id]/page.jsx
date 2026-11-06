"use client"
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { deleteJobById, editJobById, getJobById } from '@/lib/api/dashboard';
import PageHeader from '@/components/general/PageHeader';
import JobStatCard from '@/components/projects/JobStatCard';
import JobAttachmentRow from '@/components/projects/JobAttachmentRow';
import BidderRow from '@/components/projects/BidderRow';
import toast from 'react-hot-toast';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import ConfirmationModal from '@/components/general/ConfirmationModal';
import { useRouter } from 'next/navigation';
import CreateJobModal from '@/components/Job/CreateJobModal';


const ServiceAreasDisplayMap = lazy(() => import('@/components/ui/ServiceAreasDisplayMap'));

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const expireLabel = (days, createdAt) => {
    if (!days || !createdAt) return '—';
    const exp = new Date(createdAt).getTime() + days * 86400000;
    const rem = Math.ceil((exp - Date.now()) / 86400000);
    if (rem <= 0) return 'Expired';
    return rem === 1 ? '1 Day' : `${rem} Days`;
};

const jobStatus = (job) => {
    if (job?.is_cancelled) return 'Cancelled';
    if (job?.is_completed) return 'Completed';
    if (job?.accepted_bid_id) return 'Active';
    return 'Pending';
};

// ─── Section title ────────────────────────────────────────────────────────────
const Section = ({ title, children, action }) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            {action}
        </div>
        {children}
    </div>
);

// ─── Status + type badges ─────────────────────────────────────────────────────
const StatusBadge = ({ label }) => (
    <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 bg-white">
        {label}
    </span>
);

const JobTypeBadge = ({ type }) => {
    const isLive = type === 'LIVE';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
      ${isLive ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-primary'}`} />
            {isLive ? 'Live Auction' : 'Regular Bidding'}
        </span>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const Page = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [editJobModal, setEditJobModal] = useState(false);
    const [projectPhotos, setProjectPhotos] = useState([]);

    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                const res = await getJobById(id);
                if (res?.status?.success) {
                    setJob(res.data)
                    const attachments = Array.isArray(res.data.attachments)
                        ? res.data.attachments
                        : JSON.parse(res.data.attachments || '[]');


                    const photos = attachments.filter(
                        (item) => item.type === 'image'
                    );

                    setProjectPhotos(photos);

                    console.log("Job", res?.data);
                }
                else toast.error(res?.message || 'Failed to load job');
            } catch (err) {
                const msg = err?.response?.data?.message;
                toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to load job');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 text-sm">Project not found.</p>
            </div>
        );
    }

    // Parse JSON fields
    const attachments = Array.isArray(job.attachments)
        ? job.attachments
        : (() => { try { return JSON.parse(job.attachments || '[]'); } catch { return []; } })();

    const preferences = Array.isArray(job.provider_preferences)
        ? job.provider_preferences
        : (() => { try { return JSON.parse(job.provider_preferences || '[]'); } catch { return []; } })();

    const status = jobStatus(job);
    const bidCount = job._count?.bids ?? 0;
    const expire = expireLabel(job.expire_days, job.created_at);
    const createdDate = formatDate(job.created_at);

    // Photo attachments vs document attachments
    const photoAttachments = projectPhotos;
    const docAttachments = attachments.filter((a) => a.type !== 'image');

    const handleDeleteJob = async () => {
        try {
            const res = await deleteJobById(id);
            if (res?.status?.success) {
                toast.success(res?.message);
                setOpenConfirmModal(false);
                router.push("/dashboard/projects");
            }
            else {
                toast.error(res?.message || 'Failed to delete job');
            }
        } catch (error) {
            const msg = error?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to delete the job');
        }
    }


    const mimeToType = (file) => {
        if (!file?.type) return 'file';
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type === 'application/pdf') return 'pdf';
        return 'file';
    };

    const handleEditJob = async (data) => {
        try {
            const payload = {
                job_type:    data.job_type,
                title:       data.title,
                description: data.description,
                expire_days: Number(data.expire_days),
                min_budget:  Number(data.min_budget),
                max_budget:  Number(data.max_budget),
                timeline:    data.timeline || null,
                location:    data.location || null,
                provider_preferences: data.provider_preferences ?? [],
                // Pass raw attachment items — buildJobFormData separates Files from existing URLs
                attachments: data.attachments ?? [],
            };

            const res = await editJobById(id, payload);

            if (res?.status?.success) {
                setJob(res?.data);
                const updatedAttachments = Array.isArray(res.data.attachments)
        ? res.data.attachments
        : JSON.parse(res.data.attachments || '[]');

    setProjectPhotos(
        updatedAttachments.filter(item => item.type === 'image')
    );
                toast.success('Changes Saved successfully!');
                setEditJobModal(false);
            } else {
                toast.error(res?.message);
            }
        } catch (error) {
            const msg = error?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong');
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* ── Header ── */}
            <div className="mb-4">
                <PageHeader title={'Project Detail'} />
            </div>

            {/* ── Scrollable content ── */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-6">

                {/* Status badges row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 flex-wrap order-2 md:order-1">
                        <StatusBadge label={status} />
                        <StatusBadge label={`#${id.slice(0, 8).toUpperCase()}`} />
                        <JobTypeBadge type={job.job_type} />
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex justify-end items-center gap-4 pr-4 order-1 md:order-2">
                        <button
                            onClick={() => setEditJobModal(true)}
                            className="px-3 py-2 bg-primary-gradient text-white cursor-pointer rounded-md flex gap-2 items-center hover:shadow-md">
                            <FaEdit size={16} />
                            <span className='text-sm'>Edit Job</span>
                        </button>

                        <button
                            onClick={() => setOpenConfirmModal(true)}
                            className="px-3 py-2 bg-red-600 text-white cursor-pointer rounded-md flex gap-2 items-center hover:shadow-lg">
                            <RiDeleteBinLine size={16} />
                            <span className='text-sm'>Delete Job</span>
                        </button>
                    </div>

                </div>

                {/* Title + Description */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">{job.description || '—'}</p>
                </div>

                {/* Stats row */}
                <div className="flex gap-3">
                    <JobStatCard value={createdDate} label="Jobs Created" />
                    <JobStatCard value={String(bidCount).padStart(2, '0')} label="Bids Requests" />
                    <JobStatCard value={expire} label="Expired in" />
                </div>

                {/* Budget */}
                {(job.min_budget != null || job.max_budget != null) && (
                    <Section title="Budget">
                        <p className="text-sm text-gray-600">
                            ${(job.min_budget ?? 0).toLocaleString()} — ${(job.max_budget ?? 0).toLocaleString()}
                        </p>
                    </Section>
                )}

                {/* Timeline */}
                {job.timeline && (
                    <Section title="Timeline">
                        <p className="text-sm text-gray-600">{job.timeline}</p>
                    </Section>
                )}

                {/* Attachments — documents */}
                {docAttachments.length > 0 && (
                    <Section
                        title="Project Attached Files"
                        action={
                            <a
                                href={docAttachments[0]?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors"
                            >
                                ↓ Download All
                            </a>
                        }
                    >
                        <div className="flex flex-col gap-2">
                            {docAttachments.map((a, i) => (
                                <JobAttachmentRow key={i} attachment={a} index={i} />
                            ))}
                        </div>
                    </Section>
                )}

                {/* Project Photos */}
                {photoAttachments.length > 0 && (
    <Section title="Project Photos">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photoAttachments.map((a, i) => (
                <a
                    key={a.url || i}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={a.url}
                        alt={`Project photo ${i + 1}`}
                        className="w-full aspect-video object-cover rounded-xl border border-gray-200 hover:opacity-80 transition-opacity"
                    />
                </a>
            ))}
        </div>
    </Section>
)}

                {/* Provider Preferences */}
                {preferences.length > 0 && (
                    <Section title="Service Provider Preferences">
                        <div className="flex flex-wrap gap-2">
                            {preferences.map((p, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Location */}
                {job.location && (
                    <Section title="Location">
                        <Suspense fallback={<div className="w-full h-52 rounded-xl bg-gray-100 animate-pulse" />}>
                            <ServiceAreasDisplayMap location={job.location.loc} lat={job.location.latitude} lng={job.location.longitude} />
                        </Suspense>
                    </Section>
                )}

                {/* Bidding Requests — accepted bid shown as accepted bidder */}
                {job.accepted_bid && (
                    <Section title="Accepted Bid">
                        <BidderRow
                            bid={job.accepted_bid}
                            onAccept={undefined}
                            onReject={undefined}
                            onChat={() => console.log('Chat with contractor:', job.accepted_bid.contractor_id)}
                        />
                    </Section>
                )}


            </div>
            {/* confirm delte modal  */}
            {
                openConfirmModal && (
                    <ConfirmationModal
                        isOpen={openConfirmModal}
                        icon={<RiDeleteBinLine size={40} />}
                        onClose={() => setOpenConfirmModal(false)}
                        onConfirm={handleDeleteJob}
                        cancelText="No, I don't"
                        confirmText="Yes, Sure"
                        title="Delete Job"
                        description="Are you sure you want to delete this job?"

                    />
                )
            }
            {/* Edit Job modal  */}
            {
                editJobModal && (
                    <CreateJobModal
                        data={{
                            ...job,
                            provider_preferences: preferences,
                        }}
                        projectPhotos={projectPhotos}
                        setProjectPhotos={setProjectPhotos}
                        mode='edit'
                        onClose={() => setEditJobModal(false)}
                        onSubmit={handleEditJob}
                    />
                )
            }
        </div>
    );
};

export default Page;
