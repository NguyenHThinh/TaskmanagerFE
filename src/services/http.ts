import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import type { ApiResponse } from "@/types/api";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const createHttpClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });
};

const http = createHttpClient();
const authHttp = createHttpClient();

let refreshPromise: Promise<string> | null = null;

const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
  const originalRequest = error.config;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  const status = error.response?.status;
  const isAuthRefresh = originalRequest.url?.includes("/auth/refresh") ?? false;
  const hasRetried = (originalRequest as { _retry?: boolean })._retry === true;

  if (status !== 401 || isAuthRefresh || hasRetried) {
    return Promise.reject(error);
  }

  (originalRequest as { _retry?: boolean })._retry = true;

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;
    useAuthStore.getState().setAccessToken(newAccessToken);

    originalRequest.headers = AxiosHeaders.from({
      ...originalRequest.headers,
      Authorization: `Bearer ${newAccessToken}`,
    });

    return http(originalRequest);
  } catch (refreshError) {
    useAuthStore.getState().clearAccessToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(refreshError);
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const response = await authHttp.post<ApiResponse<{ accessToken: string }>>("/auth/refresh");
  const token = response.data.data?.accessToken;

  if (!token) {
    throw new Error("Missing access token in refresh response");
  }

  return token;
};

http.interceptors.request.use(requestInterceptor);
http.interceptors.response.use((response) => response, responseErrorInterceptor);

export { http };


