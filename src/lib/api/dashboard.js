import api from "@/lib/api/client";
import { buildJobFormData } from "./buildFormData";


export const createJob = async (payload) => {
  const formData = buildJobFormData(payload);
  const response = await api.post("/job/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getMyJobs = async ({ tab } = {}) => {
  const params = {};
  if (tab) params.tab = tab;
  const response = await api.get("/job/my-jobs", { params });
  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/job/${id}`);
  return response.data;
};

export const deleteJobById = async (id) => {
  const response = await api.delete(`/job/${id}`);
  return response.data;
};

export const editJobById = async (id, payload) => {
  const formData = buildJobFormData(payload);
  const response = await api.patch(`/job/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export { default as api } from "@/lib/api/client";
