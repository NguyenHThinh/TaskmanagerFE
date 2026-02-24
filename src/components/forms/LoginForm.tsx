"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "@/hooks/useLogin";
import { getProjects } from "@/services/projectService";

export const LoginForm = () => {
  const router = useRouter();
  const { mutateAsync, isPending, isError, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({ email, password });

    const projects = await getProjects();
    if (projects.length === 0) {
      router.push("/projects/new");
      return;
    }

    router.push("/");
  };

  const errorMessage =
    isError && error instanceof Error ? error.message : "Đăng nhập không thành công";

  return (
    <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
      </div>

      {isError ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
};


