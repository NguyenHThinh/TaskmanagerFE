"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import { getProjects } from "@/services/projectService";
import { isProjectRequiredRoute } from "@/constants/routeGuards";

type AuthGuardProps = {
  children: React.ReactNode;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        let token = accessToken;

        if (!token) {
          try {
            const refreshResponse = await axios.post<{ data?: { accessToken?: string } }>(
              `${API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true },
            );

            const refreshedToken = refreshResponse.data?.data?.accessToken;
            if (refreshedToken) {
              token = refreshedToken;
              setAccessToken(refreshedToken);
            }
          } catch {
            // ignore, handled below
          }
        }

        if (!token) {
          clearAccessToken();
          if (isMounted) router.replace("/login");
          return;
        }

        if (isProjectRequiredRoute(pathname)) {
          const projects = await getProjects();
          if (projects.length === 0 && isMounted) {
            router.replace("/projects/new");
            return;
          }
        }
      } catch {
        clearAccessToken();
        if (isMounted) router.replace("/login");
        return;
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [accessToken, clearAccessToken, pathname, router, setAccessToken]);

  if (isChecking) {
    return <div className="px-6 py-10 text-sm text-muted-foreground">Đang kiểm tra truy cập...</div>;
  }

  return <>{children}</>;
};
