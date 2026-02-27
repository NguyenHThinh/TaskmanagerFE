import { http } from "@/lib/http";
import type { Project, CreateProjectPayload } from "@/types/project";
import type { ApiResponse } from "@/types/api";

export const getProjects = async (): Promise<Project[]> => {
  const response = await http.get<Project[]>("/projects");
  return response.data;
};

export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const response = await http.post<Project>("/projects", payload);
  return response.data;
};
