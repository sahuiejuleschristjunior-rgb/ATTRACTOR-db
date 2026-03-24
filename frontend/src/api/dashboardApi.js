import http from './http';

export const getDashboardApi = async () => {
  const { data } = await http.get('/dashboard');
  return data;
};
