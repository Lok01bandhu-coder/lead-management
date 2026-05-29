import axiosClient from "./axiosClient";

export const getLeads = async (params) => {
  const response = await axiosClient.get("/leads", { params });
  return response.data;
};

export const getLeadById = async (leadId) => {
  const response = await axiosClient.get(`/leads/${leadId}`);
  return response.data;
};

export const createLead = async (payload) => {
  const response = await axiosClient.post("/leads", payload);
  return response.data;
};

export const updateLead = async (leadId, payload) => {
  const response = await axiosClient.put(`/leads/${leadId}`, payload);
  return response.data;
};

export const updateLeadStatus = async (leadId, payload) => {
  const response = await axiosClient.patch(`/leads/${leadId}/status`, payload);
  return response.data;
};

export const deleteLead = async (leadId) => {
  await axiosClient.delete(`/leads/${leadId}`);
};

