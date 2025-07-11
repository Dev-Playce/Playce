import http from "../api/http";
import type { SearchResultItem } from "../types/search";

export interface SearchParams {
  search?: string;
  sports?: string[];
  leagues?: string[];
  team?: string;
  big_regions?: string[];
  small_regions?: string[];
  sort?: string;
}

export const fetchSearchResults = async (
  params: SearchParams
): Promise<{ success: boolean; message: string; data: SearchResultItem[] }> => {
  const response = await http.get("/search", { params });
  return response.data;
};
