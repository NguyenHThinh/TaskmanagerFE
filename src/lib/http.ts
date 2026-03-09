import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import type { ApiResponse } from "@/types/api";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

type RequestMetaConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRedirect?: boolean;
  skipStatusRedirect?: number[];
};

const createHttpClient = (): AxiosInstance => {
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });
};

const http = createHttpClient();
const authHttp = createHttpClient();

let refreshPromise: Promise<string> | null = null;

const safeRedirect = (to: string): void => {
  if (typeof window === "undefined") return;
  if (window.location.pathname === to) return;
  window.location.href = to;
};

const hasSkipRedirectStatus = (config: RequestMetaConfig, status?: number): boolean => {
  if (!status) return false;
  return Array.isArray(config.skipStatusRedirect) && config.skipStatusRedirect.includes(status);
};

const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const responseErrorInterceptor = async (error: AxiosError): Promise<never> => {
  const originalRequest = error.config as RequestMetaConfig | undefined;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  const status = error.response?.status;
  const requestUrl = originalRequest.url ?? "";
  const isAuthEndpoint = requestUrl.includes("/auth/");
  const isAuthRefresh = requestUrl.includes("/auth/refresh");
  const hasRetried = originalRequest._retry === true;

  if (!originalRequest.skipAuthRedirect && !hasSkipRedirectStatus(originalRequest, status)) {
    if (status === 403 || status === 404) {
      safeRedirect("/404");
      return Promise.reject(error);
    }
  }

  if (status !== 401 || isAuthRefresh || hasRetried || isAuthEndpoint) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

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
    if (!originalRequest.skipAuthRedirect) {
      safeRedirect("/login");
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
