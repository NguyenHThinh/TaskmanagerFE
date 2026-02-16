"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projectService";

export const PROJECTS_QUERY_KEY = ["projects"];

export const useProjects = () => {
  const query = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
  });

  const firstProject = useMemo(() => query.data?.[0] ?? null, [query.data]);

  return {
    projects: query.data ?? [],
    firstProject,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
