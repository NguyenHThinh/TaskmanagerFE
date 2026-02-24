export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED";

export type ProjectCategory =
  | "SOFTWARE"
  | "MARKETING"
  | "DESIGN"
  | "HR"
  | "FINANCE"
  | "OPERATIONS"
  | "OTHER";

export type ProjectVisibility = "PRIVATE";

export type ProjectMember = {
  userId: string;
  role: ProjectRole;
};

export type Project = {
  _id: string;
  name: string;
  key: string;
  description?: string;
  status: ProjectStatus;
  category: ProjectCategory;
  visibility: ProjectVisibility;
  icon: string;
  startDate?: string | null;
  endDate?: string | null;
  ownerId: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectPayload = {
  name: string;
  key: string;
  description?: string;
  category?: ProjectCategory;
  startDate?: string;
  endDate?: string;
};
