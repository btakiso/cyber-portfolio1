export default function prependApiUrl(url: string): string {
  if (url.startsWith('https://')) {
    // If it's already a full URL (likely from S3), return it as is
    return url;
  }
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.bereketakiso.com';
  return `${baseUrl}${url}`;
}