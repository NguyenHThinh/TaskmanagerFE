type OverviewStatCardProps = {
  label: string;
  value: number;
  subtext?: string;
};

const OverviewStatCard = ({ label, value, subtext }: OverviewStatCardProps) => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </p>
    <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    {subtext ? (
      <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>
    ) : null}
  </div>
);

export default OverviewStatCard;
