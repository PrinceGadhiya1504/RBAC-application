import { api } from "@/lib/api";
import type { PagesResponse, PageResponse } from "../types/page.types";

export const fetchPages = async (): Promise<PagesResponse> => {
    const response = await api.get<PagesResponse>("/pages");
    return response.data;
};

export const fetchPageById = async (pageId: number): Promise<PageResponse> => {
    const response = await api.get<PageResponse>(`/pages/${pageId}`);
    return response.data;
};
