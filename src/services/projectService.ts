import { http } from "@/services/http";
import type { Project } from "@/types/project";

export const getProjects = async (): Promise<Project[]> => {
  const response = await http.get<Project[]>("/projects");
  return response.data;
};
