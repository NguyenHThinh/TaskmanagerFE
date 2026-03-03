import { cn } from "@/utils";

type Props = {
  icon: React.ReactNode;
  title: string;
  rightContent?: React.ReactNode;
  className?: string;
};

export const SectionHeader = ({ icon, title, rightContent, className }: Props) => {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <h2 className="text-lg font-semibold flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {rightContent && rightContent}
    </div>
  );
};

export default SectionHeader;