export const getSelectedStatuses = (statuses: string | null) => {
    if (!statuses || statuses?.trim() === '') {
        return [];
    }
    return statuses?.split(',') || [];
};