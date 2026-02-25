type AccessCheckingProps = {
  message?: string;
};

export const AccessChecking = ({ message = "Đang kiểm tra truy cập..." }: AccessCheckingProps) => {
  return <div className="px-6 py-10 text-sm text-muted-foreground">{message}</div>;
};
