import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim());
};
