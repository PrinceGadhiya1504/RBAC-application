import { useQuery } from "@tanstack/react-query";
import { fetchPositions } from "../services/positionsApi";

export const usePositions = () => {
    return useQuery({
        queryKey: ["positions"],
        queryFn: fetchPositions,
    });
};