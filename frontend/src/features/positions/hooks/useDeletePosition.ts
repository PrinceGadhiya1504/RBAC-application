import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePosition } from "../services/positionsApi";

export const useDeletePosition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (positionId: number) => deletePosition(positionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};