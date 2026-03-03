import { http } from "@/lib/http";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export type SearchResult = {
  projects: Project[];
  tasks: Task[];
};

export const search = async (query: string): Promise<SearchResult> => {
  const params = new URLSearchParams();
  if (query?.trim()) {
    params.set("q", query.trim());
  }
  const url = params.toString() ? `/search?${params.toString()}` : "/search";
  const response = await http.get<SearchResult>(url);
  return response.data;
};
