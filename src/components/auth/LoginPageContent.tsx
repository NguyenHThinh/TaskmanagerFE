import Link from "next/link";

import { AuthCardLayout } from "@/components/common/AuthCardLayout";
import { LoginForm } from "@/components/forms/LoginForm";

export const LoginPageContent = () => {
  return (
    <AuthCardLayout
      title="Đăng nhập"
      subtitle="Chào mừng quay lại, vui lòng nhập thông tin để tiếp tục."
      footer={
        <div className="flex items-center justify-between text-sm text-muted-foreground -mt-3">
          <Link className="font-semibold text-foreground hover:underline" href="/register">
            Chưa có tài khoản? Đăng ký
          </Link>
        </div>
      }
    >
      <LoginForm />
    </AuthCardLayout>
  );
};
