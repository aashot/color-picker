export const rgbToHex = (r: number, g: number, b: number): string => {
  return ((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase();
};

export const validateUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)([a-zA-Z0-9.-]+)(:[0-9]{1,5})?(\/.*)?$/i;
  return regex.test(url);
};
