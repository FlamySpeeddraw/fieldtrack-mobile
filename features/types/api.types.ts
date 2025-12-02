import { ApiResponse } from "../../types/general.types";

export type tokens = {
    accessToken: string;
    refreshToken: string;
}

export type LoginResponse = ApiResponse<tokens>;