import { useQuery } from "@tanstack/react-query";
import { fetchPages } from "../services/pagesApi";

export const usePages = () => {
    return useQuery({
        queryKey: ["pages"],
        queryFn: fetchPages,
    });
};