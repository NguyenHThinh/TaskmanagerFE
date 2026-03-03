import { ProjectDetailPageContent } from "@/components/main/ProjectDetailPageContent";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  return <ProjectDetailPageContent projectId={id} />;
}
