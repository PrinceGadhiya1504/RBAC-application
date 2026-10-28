export interface Page {
    page_id: number;
    name: string;
}

export interface PagesResponse {
    success: boolean;
    pages: Page[];
}