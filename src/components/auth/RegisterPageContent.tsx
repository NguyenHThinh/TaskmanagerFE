import Link from "next/link";

import { AuthCardLayout } from "@/components/common/AuthCardLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const RegisterPageContent = () => {
  return (
    <AuthCardLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản để bắt đầu quản lý dự án và cộng tác cùng đội nhóm."
      footer={
        <div className="text-sm text-muted-foreground -mt-3">
          Đã có tài khoản?{" "}
          <Link className="font-semibold text-foreground hover:underline" href="/login">
            Đăng nhập
          </Link>
        </div>
      }
    >
      <RegisterForm />
    </AuthCardLayout>
  );
};
