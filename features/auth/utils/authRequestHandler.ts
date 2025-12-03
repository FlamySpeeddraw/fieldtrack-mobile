import { API_URL } from "@/constants/general.constants";
import axios, { AxiosResponse } from "axios";
import { Router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

export const authRequestHandler = async (
    apiCall: () => Promise<AxiosResponse>,
    router: Router
): Promise<AxiosResponse> => {
    try {
        return await apiCall();

    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data.code === "TOKEN_EXPIRED") {
            try {
                const refreshToken = SecureStore.getItem("refresh");
                const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, { refreshToken, appType: "mobile" });
                axios.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.token}`;
                SecureStore.setItem("refresh", refreshResponse.data.newRefreshToken);
                return await apiCall();

            } catch (error2) {
                if (axios.isAxiosError(error2) && error2.response?.data.code === "TOKEN_EXPIRED") {
                    axios.defaults.headers.common["Authorization"] = "";
                    router.replace("/index");

                    throw new Error("Session expirée");
                }

                if (error2 instanceof Error) {
                    throw error2;
                }

                throw new Error("Erreur inconnue");
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("Erreur inconnue");
    }
}