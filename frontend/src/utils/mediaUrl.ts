export const getMediaUrl = (url: string): string => {
  if (!url) return '';
    // If it's already a full URL (e.g. from S3 or a remote API), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Use NEXT_PUBLIC_MEDIA_URL for constructing media paths for client-side rendering.
  // Nginx will proxy requests from http://localhost/media/... to http://backend:8000/media/...
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost';
  
  // Ensure the path starts with /media/ if it's a relative path from the backend
  let path = url;
  if (!url.startsWith('/media/') && !url.startsWith('media/')) {
    path = `/media/${url.startsWith('/') ? url.substring(1) : url}`;
  } else if (url.startsWith('media/')) {
    path = `/${url}`;
  }

  // Clean up any potential double slashes
  const cleanPath = path.replace(/\/\/+/g, '/');
  return `${baseUrl}${cleanPath}`;
};