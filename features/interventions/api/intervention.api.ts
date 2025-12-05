import { ErrorApiResponse } from "@/types/general.types";
import { GetListInterventionReponse, Intervention, PutInterventionResponse } from "../types/api.types";
import { authRequestHandler } from "@/features/auth/utils/authRequestHandler";
import { API_URL } from "@/constants/general.constants";
import { Router } from "expo-router";
import axios from "axios";

export const getListInterventions = async (
    technicienId: string | number,
    router: Router
): Promise<GetListInterventionReponse | ErrorApiResponse> => {
    try {
        const response = await authRequestHandler(() => axios.get(`${API_URL}/interventions/user/${technicienId}`), router);

        return {
            success: true,
            message: response.data.message,
            headers: response.headers,
            data: response.data.data
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

export const putIntervention = async (
    intervention: Intervention,
    router: Router
): Promise<PutInterventionResponse | ErrorApiResponse> => {
    try {
        const response = await authRequestHandler(() => axios.put(`${API_URL}/interventions/${intervention.id}`, { status: intervention.status, commentaire: intervention.commentaire, photo: intervention.photo }), router);

        return {
            success: true,
            message: response.data.message,
            headers: response.headers
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