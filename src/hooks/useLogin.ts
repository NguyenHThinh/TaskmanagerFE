import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { login } from "@/services/authService";
import type { LoginPayload } from "@/types/auth";

export const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (result) => {
      setAccessToken(result.accessToken);
    },
  });
};





