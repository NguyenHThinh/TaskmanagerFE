export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type ProjectMember = {
  userId: string;
  role: ProjectRole;
};

export type Project = {
  _id: string;
  name: string;
  key: string;
  description?: string;
  ownerId: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
};
