import api, { refreshAccessToken } from "@/lib/api/client";
import { buildProfileFormData } from "@/lib/api/buildFormData";

export const createJob = async(payload)=>{
 const response = await api.post("/job/create", payload);
  return response.data;
}

export { default as api } from "@/lib/api/client";