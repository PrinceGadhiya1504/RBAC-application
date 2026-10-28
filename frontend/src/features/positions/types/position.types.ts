export interface Position {
    position_id: number;
    name: string;
    description: string | null;
}

export interface PositionsResponse {
    success: boolean;
    positions: Position[];
}

export interface SinglePositionResponse {
    success: boolean;
    position: Position;
}

export interface CreatePositionRequest {
    name: string;
    description?: string;
}

export interface UpdatePositionRequest {
    name?: string;
    description?: string;
}