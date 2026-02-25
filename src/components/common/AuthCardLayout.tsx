import type { ReactNode } from "react";

type AuthCardLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export const AuthCardLayout = ({ title, subtitle, children, footer }: AuthCardLayoutProps) => {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Task Management</p>
          <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
          <p className="text-sm text-zinc-600">{subtitle}</p>
        </div>

        {children}

        {footer}
      </div>
    </div>
  );
};
