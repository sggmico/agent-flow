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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 dark:bg-gray-950/95 dark:border-gray-800">
      {/* 移动端菜单按钮 */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* 间隔元素 */}
      <div className="hidden md:flex flex-1" />

      {/* 搜索栏 - 靠右且缩小 */}
      <div className="hidden md:flex max-w-xs">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-500" />
          <Input
            type="search"
            placeholder="搜索 agents, workflows..."
            className="pl-9 h-9 bg-muted/50 w-64 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* 移动端搜索按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden ml-auto dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
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
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors text-sm group dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600"
        >
          <Github className="h-4 w-4 dark:text-gray-400 group-hover:dark:text-gray-300 transition-colors" />
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 group-hover:fill-yellow-500 group-hover:text-yellow-500 transition-colors" />
          <span className="font-semibold">{loading ? '...' : stars.toLocaleString()}</span>
        </a>

        {/* 通知 */}
        <Button
          variant="ghost"
          size="icon"
          className="relative dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* 主题切换 */}
        <ThemeToggle />

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full dark:hover:bg-gray-800">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium dark:text-gray-100">User Name</p>
                <p className="text-xs text-muted-foreground dark:text-gray-500">user@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-gray-800" />
            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-800" />
            <DropdownMenuItem className="text-red-600 dark:text-red-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
