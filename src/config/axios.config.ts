import { refreshAccessTokenThunk } from "@/app/functions/auth";
import { store } from "@/app/store";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const { access } = store.getState().auth;
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await store.dispatch(refreshAccessTokenThunk());
      const { access } = store.getState().auth;
      if (access) {
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest); // Retry the failed request
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
