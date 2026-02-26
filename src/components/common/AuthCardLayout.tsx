import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";

type AuthCardLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
};

export const AuthCardLayout = ({ title, subtitle, children, footer, contentClassName }: AuthCardLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40 text-foreground">
      <div className="flex w-full max-w-4xl h-[580px] overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Left side - Image & Branding (Desktop only) */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-8 text-white lg:flex">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/auth-background.avif"
              alt="Authentication background"
              className="h-full w-full object-cover opacity-60 mix-blend-overlay"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 via-zinc-900/40 to-zinc-900/20" />
          </div>

          <div className="relative z-10 flex items-center font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Task Management</span>
          </div>

          <div className="relative z-10 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-base text-zinc-200">
                "Our platform streamlines tasks and improves team communication efficiently."
              </p>
              <footer className="text-sm text-zinc-400">Task Management Team</footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 sm:px-12 sm:py-6">
          <div className={cn("mx-auto flex w-full max-w-sm flex-col gap-6", contentClassName)}>
            <div className="flex flex-col space-y-2 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:hidden">
                Task Management
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            {footer && footer}
          </div>
        </div>
      </div>
    </div>
  );
};
