import { api } from "@/lib/api";
import type { PagesResponse } from "../types/page.types";

export const fetchPages = async (): Promise<PagesResponse> => {
    const response = await api.get<PagesResponse>("/pages");
    return response.data;
};