import Link from "next/link";

import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Task Management
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">Đăng nhập</h1>
          <p className="text-sm text-zinc-600">
            Chào mừng quay lại, vui lòng nhập thông tin để tiếp tục.
          </p>
        </div>

        <LoginForm />

        <div className="flex items-center justify-between text-sm text-zinc-500">
          <Link className="font-semibold text-zinc-900 hover:text-zinc-700" href="/register">
            Chưa có tài khoản? Đăng ký
          </Link>
          <Link className="font-semibold text-zinc-900 hover:text-zinc-700" href="/">
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}


