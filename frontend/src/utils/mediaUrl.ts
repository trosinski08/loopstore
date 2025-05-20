export const getMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already a full URL (e.g. S3 URL), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative URL (e.g. /media/products/...)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}; 