import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  className?: string;
  contentClassName?: string;
};

export const ProjectTimelineSection = ({ startDate, endDate, onStartDateChange, onEndDateChange, className, contentClassName }: Props) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">Thời gian</CardTitle>
        <CardDescription>Ngày bắt đầu và kết thúc (tuỳ chọn)</CardDescription>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-4", contentClassName)}>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="start-date">Ngày bắt đầu</Label>
          <Input id="start-date" type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="end-date">Ngày kết thúc</Label>
          <Input id="end-date" type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
};
