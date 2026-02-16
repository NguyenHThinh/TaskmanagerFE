"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegister } from "@/hooks/useRegister";

export const RegisterForm = () => {
  const router = useRouter();
  const { mutateAsync, isPending, isError, error } = useRegister();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp");
      return;
    }

    await mutateAsync({ username, email, password });
    router.push("/login");
  };

  const apiErrorMessage =
    isError && error instanceof Error ? error.message : "Đăng ký không thành công";

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Tên người dùng</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="nguyen.van.a"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tối thiểu 6 ký tự"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Nhập lại mật khẩu"
        />
      </div>

      {localError ? (
        <Alert variant="destructive">
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      ) : null}

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>{apiErrorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang tạo tài khoản..." : "Đăng ký"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link className="font-semibold text-foreground hover:underline" href="/login">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
};

