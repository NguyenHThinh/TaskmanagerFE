import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  name: string;
  keyValue: string;
  onNameChange: (value: string) => void;
  onKeyChange: (value: string) => void;
};

export const ProjectBasicInfoSection = ({ name, keyValue, onNameChange, onKeyChange }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Thông tin cơ bản</CardTitle>
        <CardDescription>Tên và mã định danh cho project</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-name">Tên project *</Label>
          <Input id="project-name" placeholder="Ví dụ: Website Redesign" value={name} onChange={(e) => onNameChange(e.target.value)} maxLength={120} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-key">Mã project (KEY) *</Label>
          <Input id="project-key" placeholder="Ví dụ: WR" value={keyValue} onChange={(e) => onKeyChange(e.target.value)} maxLength={10} required />
          <p className="text-xs text-muted-foreground">2-10 ký tự viết hoa (A-Z, 0-9). Dùng làm prefix cho mã task (VD: WR-1, WR-2).</p>
        </div>
      </CardContent>
    </Card>
  );
};
