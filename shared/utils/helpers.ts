/**
 * Generate a unique ID
 */
export const generateId = (prefix: string = "item"): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date to ISO string
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

