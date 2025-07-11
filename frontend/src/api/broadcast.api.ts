import httpClient from "./http";

import type { CreateBroadcastPayload } from "../types/broadcastForm";

export const createBroadcast = async (data: CreateBroadcastPayload) => {
  const response = await httpClient.post("/broadcasts", data);
  return response.data;
};

export const getBroadcast = async (storeId: number) => {
  const response = await httpClient.get(`/broadcasts/stores/${storeId}`);
  return response.data.data;
};

export const editBroadcast = async (
  id: number,
  data: Omit<CreateBroadcastPayload, "store_id">
) => {
  const response = await httpClient.patch(`/broadcasts/${id}`, data);
  return response.data;
};

export const deleteBroadcast = async (id: number) => {
  const response = await httpClient.delete(`/broadcasts/${id}`);
  return response.data;
};
