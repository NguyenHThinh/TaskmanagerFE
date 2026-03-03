"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Search, LogOut, User, Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { getTaskTypeIcon } from "@/constants/task";
import { cn } from "@/utils";

export const Topbar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, debouncedQuery, isFetching } = useSearch(searchQuery);
  const hasResults = Boolean(
    data && (data.projects.length > 0 || data.tasks.length > 0)
  );
  const showDropdown = debouncedQuery.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex h-desktop-header-height items-center justify-between gap-4 border-b border-border bg-background/95 px-6 py-2.5 backdrop-blur">
      <div ref={searchRef} className="relative flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm dự án, task..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="h-9 pl-9"
          />
        </div>

        {showDropdown && searchOpen && (
          <div
            className={cn(
              "absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-md border border-border bg-popover py-1 shadow-lg"
            )}
          >
            {isFetching ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Đang tìm...
              </div>
            ) : !hasResults ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy kết quả
              </div>
            ) : (
              <>
                {data!.projects.length > 0 && (
                  <div className="px-2 py-1.5">
                    <p className="px-2 text-xs font-semibold text-muted-foreground">
                      Dự án
                    </p>
                    {data!.projects.map((project) => (
                      <Link
                        key={project._id}
                        href={`/project/${project._id}`}
                        onClick={() => setSearchOpen(false)}
                        className="block rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        {project.name}
                      </Link>
                    ))}
                  </div>
                )}
                {data!.tasks.length > 0 && (
                  <div className="px-2 py-1.5">
                    <p className="px-2 text-xs font-semibold text-muted-foreground">
                      Task
                    </p>
                    {data!.tasks.map((task) => (
                      <Link
                        key={task._id}
                        href={`/project/${task.projectId}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="shrink-0" aria-hidden>
                          {getTaskTypeIcon(task.type)}
                        </span>
                        {task.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shrink-0"
            aria-label="Menu tài khoản"
          >
            <span className="text-xs font-medium">NA</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="#" className="flex items-center gap-2 cursor-pointer">
              <User className="size-4" />
              Hồ sơ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="#" className="flex items-center gap-2 cursor-pointer">
              <Settings className="size-4" />
              Cài đặt
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
