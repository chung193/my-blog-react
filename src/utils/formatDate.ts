export const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return "—";

    const date = new Date(iso);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

// Kèm giờ
export const formatDateTime = (iso: string | null | undefined): string => {
    if (!iso) return "—";

    const date = new Date(iso);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};