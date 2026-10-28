import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPosition } from "../services/positionsApi";
import type { CreatePositionRequest } from "../types/position.types";

export const useCreatePosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePositionRequest) => createPosition(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
        },
    });
};