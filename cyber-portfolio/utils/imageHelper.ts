export default function prependApiUrl(url: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://cyber-portfolio-72310aa69f55.herokuapp.com';
  return `${baseUrl}${url}`;
}