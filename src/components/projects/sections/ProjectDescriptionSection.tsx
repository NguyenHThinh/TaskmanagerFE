import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  description: string;
  onDescriptionChange: (value: string) => void;
};

export const ProjectDescriptionSection = ({ description, onDescriptionChange }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Mô tả</CardTitle>
        <CardDescription>Giải thích ngắn gọn về project</CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          id="project-description"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Mô tả mục tiêu, phạm vi của project..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          maxLength={1000}
        />
      </CardContent>
    </Card>
  );
};
