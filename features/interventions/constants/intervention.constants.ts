export const STATUS = ["Tous", "Terminé", "En cours", "Planifié"];
export const STATUS_STYLES: Record<string, { backgroundColor: string }> = {
    "termine": { backgroundColor: "#10B981" },
    "en cours": { backgroundColor: "#ef4444" },
    "planifie": { backgroundColor: "#f59e0b" }
};
export const STATUS_ENUM: Record<string, string> = {
    "termine": "Terminé",
    "en cours": "En cours",
    "planifie": "Planifié"
}