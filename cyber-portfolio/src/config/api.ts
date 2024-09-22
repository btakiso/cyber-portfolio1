const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cyber-portfolio-72310aa69f55.herokuapp.com';

export const getStrapiURL = (path = '') => {
  return `${API_URL}${path}`;
};

export const fetchAPI = async (path: string) => {
  const requestUrl = getStrapiURL(path);
  const response = await fetch(requestUrl);
  const data = await response.json();
  return data;
};
