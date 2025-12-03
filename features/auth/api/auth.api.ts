import axios from "axios";
import { ErrorApiResponse } from "../../../types/general.types";
import { LoginResponse } from "../types/api.types";
import { API_URL } from "../../../constants/general.constants";

export const login = async (
    mail: string,
    mdp: string
): Promise<LoginResponse | ErrorApiResponse> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { mail, mdp });

        return {
            success: true,
            message: response.data.message,
            headers: response.headers,
            data: { accessToken: response.data.token, refreshToken: response.data.newRefreshToken }
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, message: error.response?.data.message };
        }

        if (error instanceof Error) {
            return { success: false, message: error.message };
        }

        return { success: false, message: "Login : Erreur inconnue" };
    }
}