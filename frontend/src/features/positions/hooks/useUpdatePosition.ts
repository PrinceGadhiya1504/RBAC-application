import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePosition } from "../services/positionsApi";
import type { UpdatePositionRequest } from "../types/position.types";

interface UpdatePositionParams {
    positionId: number;
    data: UpdatePositionRequest;
}

export const useUpdatePosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ positionId, data }: UpdatePositionParams) =>
            updatePosition(positionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
        },
    });
};