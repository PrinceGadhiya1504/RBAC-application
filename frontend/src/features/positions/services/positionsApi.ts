import { api } from "@/lib/api";
import type {
    PositionsResponse,
    SinglePositionResponse,
    CreatePositionRequest,
    UpdatePositionRequest,
} from "../types/position.types";

export const fetchPositions = async (): Promise<PositionsResponse> => {
    const response = await api.get<PositionsResponse>("/positions");
    return response.data;
};

export const createPosition = async (
    data: CreatePositionRequest
): Promise<SinglePositionResponse> => {
    const response = await api.post<SinglePositionResponse>("/positions", data);
    return response.data;
};

export const updatePosition = async (
    positionId: number,
    data: UpdatePositionRequest
): Promise<SinglePositionResponse> => {
    const response = await api.put<SinglePositionResponse>(
        `/positions/${positionId}`,
        data
    );
    return response.data;
};

export const deletePosition = async (positionId: number): Promise<void> => {
    await api.delete(`/positions/${positionId}`);
};