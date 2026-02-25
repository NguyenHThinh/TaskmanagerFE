import Link from "next/link";

import { AuthCardLayout } from "@/components/common/AuthCardLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const RegisterPageContent = () => {
  return (
    <AuthCardLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản để bắt đầu quản lý dự án và cộng tác cùng đội nhóm."
      footer={
        <div className="text-center text-sm text-zinc-500">
          <Link className="font-semibold text-zinc-900 hover:text-zinc-700" href="/">
            Quay lại trang chủ
          </Link>
        </div>
      }
    >
      <RegisterForm />
    </AuthCardLayout>
  );
};
