import type { ApiResponse } from "@/types/api";
import type { LoginPayload, LoginResult, RegisterPayload, RegisterResult } from "@/types/auth";

import { http } from "@/services/http";

export const login = async (payload: LoginPayload): Promise<LoginResult> => {
  const response = await http.post<ApiResponse<LoginResult>>("/auth/login", payload);
  const data = response.data.data;

  if (!data?.accessToken) {
    throw new Error("Thiếu access token từ máy chủ");
  }

  return { accessToken: data.accessToken };
};

type RegisterApiData = {
  user?: RegisterResult;
};

export const register = async (payload: RegisterPayload): Promise<RegisterResult> => {
  const response = await http.post<ApiResponse<RegisterApiData>>("/auth/register", payload);
  const user = response.data.data?.user;

  if (!user) {
    throw new Error("Không thể tạo tài khoản");
  }

  return user;
};
