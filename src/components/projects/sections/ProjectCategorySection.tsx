import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectCategory } from "@/types/project";

const CATEGORY_OPTIONS: { value: ProjectCategory; label: string; icon: string }[] = [
  { value: "SOFTWARE", label: "Phần mềm", icon: "💻" },
  { value: "MARKETING", label: "Marketing", icon: "📢" },
  { value: "DESIGN", label: "Thiết kế", icon: "🎨" },
  { value: "HR", label: "Nhân sự", icon: "👥" },
  { value: "FINANCE", label: "Tài chính", icon: "💰" },
  { value: "OPERATIONS", label: "Vận hành", icon: "⚙️" },
  { value: "OTHER", label: "Khác", icon: "📋" },
];

type Props = {
  category: ProjectCategory;
  onCategoryChange: (value: ProjectCategory) => void;
};

export const ProjectCategorySection = ({ category, onCategoryChange }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Phân loại</CardTitle>
        <CardDescription>Chọn loại project phù hợp</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onCategoryChange(opt.value)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                category === opt.value
                  ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-foreground"
              }`}
            >
              <span className="text-base">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
