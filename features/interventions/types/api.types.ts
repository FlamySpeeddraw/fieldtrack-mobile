import { ApiResponse } from "@/types/general.types";

export type Intervention = {
	id: string;
	date_intervention: string;
	status: string;
	description?: string;
	commentaire?: string;
    photo?: string;
	adresse?: string;
	titre: string;
};

export type GetListInterventionReponse = ApiResponse<Intervention[]>;
export type PutInterventionResponse = ApiResponse<void>;