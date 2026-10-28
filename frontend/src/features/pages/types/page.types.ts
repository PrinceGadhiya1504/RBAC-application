export interface Page {
    page_id: number;
    name: string;
}

export interface PagesResponse {
    success: boolean;
    pages: Page[];
}

export interface PageResponse {
    success: boolean;
    page: Page;
    message?: string;
}
