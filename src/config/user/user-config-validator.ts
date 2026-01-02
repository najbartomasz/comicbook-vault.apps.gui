const isHttpUrlString = (value: unknown): value is string => {
    if (typeof value !== 'string') {
        return false;
    }
    return value.startsWith('http://') || value.startsWith('https://');
};

export const isUserConfigValid = (value: unknown): value is { vaultApiUrl: string } => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    return 'vaultApiUrl' in value && isHttpUrlString(value.vaultApiUrl);
};
