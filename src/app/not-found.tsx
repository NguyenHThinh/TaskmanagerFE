import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Đường dẫn không tồn tại hoặc bạn không có quyền truy cập tài nguyên này.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button asChild>
            <Link href="/">Về trang chính</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
