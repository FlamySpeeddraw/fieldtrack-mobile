import { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

export type ApiResponse<T = undefined> = {
    success: boolean;
    message: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    data?: T;
}

export type ErrorApiResponse = {
    success: false;
    message: string;
}