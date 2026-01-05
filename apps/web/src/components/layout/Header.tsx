'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useGitHubStars } from '@/hooks/use-github-stars';
import {
  Bell,
  Github,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  User,
  Workflow,
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { stars, loading } = useGitHubStars();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[color:var(--stroke)] bg-[linear-gradient(135deg,rgb(var(--panel-rgb)/0.96),rgb(var(--panel-rgb)/0.78))] px-6 shadow-[0_12px_40px_rgba(6,12,20,0.18)] backdrop-blur">
      {/* 移动端菜单按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-strong-rgb)/0.6)] hover:text-[color:var(--ink)]"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* 间隔元素 */}
      <div className="hidden md:flex flex-1" />

      {/* 搜索栏 - 靠右且缩小 */}
      <div className="hidden md:flex max-w-xs">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink-muted)]" />
          <Input
            type="search"
            placeholder="搜索 agents, workflows..."
            className="h-9 w-64 rounded-full border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.9)] pl-9 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--ink-muted)] focus-visible:ring-[color:var(--accent-1)]"
          />
        </div>
      </div>

      {/* 移动端搜索按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden ml-auto text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-strong-rgb)/0.6)] hover:text-[color:var(--ink)]"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* 右侧操作区 */}
      <div className="flex items-center gap-3">
        {/* GitHub Star */}
        <a
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_REPO || 'yourusername/agent-flow'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 rounded-full border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.92)] px-3 py-1.5 text-sm text-[color:var(--ink-muted)] transition-colors hover:border-[color:var(--stroke-strong)] hover:text-[color:var(--ink)]"
        >
          <Github className="h-4 w-4" />
          <Star className="h-4 w-4 fill-[color:var(--accent-3)] text-[color:var(--accent-3)]" />
          <span className="font-semibold">{loading ? '...' : stars.toLocaleString()}</span>
        </a>

        {/* 通知 */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-strong-rgb)/0.6)] hover:text-[color:var(--ink)]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[color:var(--accent-1)]" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* 主题切换 */}
        <ThemeToggle />

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-strong-rgb)/0.6)] hover:text-[color:var(--ink)]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))] text-sm font-medium text-white">
                U
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.96)] shadow-[0_20px_50px_rgba(6,12,20,0.24)]"
          >
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-[color:var(--ink)]">User Name</p>
                <p className="text-xs text-[color:var(--ink-muted)]">user@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[color:var(--stroke)]" />
            <DropdownMenuItem className="text-[color:var(--ink-muted)] focus:bg-[rgb(var(--panel-rgb)/0.8)] focus:text-[color:var(--ink)]">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[color:var(--ink-muted)] focus:bg-[rgb(var(--panel-rgb)/0.8)] focus:text-[color:var(--ink)]">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[color:var(--stroke)]" />
            <DropdownMenuItem className="text-red-500 focus:bg-[rgb(var(--panel-rgb)/0.8)]">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
