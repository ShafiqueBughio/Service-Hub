"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { getMyJobs } from '@/lib/api/dashboard';
import ProjectCard      from '@/components/projects/ProjectCard';
import ProjectTabs      from '@/components/projects/ProjectTabs';
import ProjectSearchBar from '@/components/projects/ProjectSearchBar';
import ProjectEmptyState from '@/components/projects/ProjectEmptyState';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TABS = [
  { key: 'pending',   label: 'Pending'           },
  { key: 'active',    label: 'Active Project'     },
  { key: 'completed', label: 'Completed Project'  },
  { key: 'cancelled', label: 'Cancelled'          },
];

const Page = () => {
  const [activeTab, setActiveTab]   = useState('pending');
  const [search,    setSearch]      = useState('');
  const [jobs,      setJobs]        = useState([]);
  const [loading,   setLoading]     = useState(false);

  const router = useRouter();

  const fetch = async () => {
    setLoading(true);
    setJobs([]);
    try {
      const res = await getMyJobs({ tab: activeTab });
      if (res?.status?.success) {
        setJobs(Array.isArray(res.data) ? res.data : []);
      } else {
        toast.error(res?.message || 'Failed to load projects');
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  // Fetch jobs when tab changes
  useEffect(() => {
    fetch();
  }, [activeTab]);

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
    );
  }, [jobs, search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch('');
  };

  return (
    <div className="h-full flex flex-col gap-5">

      {/* ── Page heading ── */}
        <h1 className="font-bold text-gray-900">Projects</h1>

      {/* ── Search bar ── */}
      <ProjectSearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search projects by title, description or location..."
      />

      {/* ── Tabs ── */}
      <ProjectTabs active={activeTab} onChange={handleTabChange} TABS = {TABS} />

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <ProjectEmptyState tab={activeTab} />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered?.map((job) => (
              <ProjectCard
                key={job.id}
                job={job}
                onClick={() => router.push(`/dashboard/projects/${job.id}`)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Page;
