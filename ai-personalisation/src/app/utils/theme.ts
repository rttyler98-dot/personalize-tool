export const validateThemeColor = (color: string | undefined | null): string => {
    if (!color) return '#3b82f6';
    const hexPattern = /^#([0-9A-F]{3}){1,2}$/i;
    return hexPattern.test(color) ? color : '#3b82f6';
};
