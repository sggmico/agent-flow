'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, ChevronLeft, Home, PlayCircle, Search, Settings, Workflow } from 'lucide-react';

interface SidebarProps {
  className?: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Workflow,
  },
  {
    title: 'Executions',
    href: '/executions',
    icon: PlayCircle,
  },
  {
    title: 'Code Search',
    href: '/code-search',
    icon: Search,
  },
];

export function Sidebar({ className, collapsed, onCollapsedChange }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r bg-muted/30 transition-all duration-300',
        'dark:bg-gray-950 dark:border-gray-800',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {/* Logo 区域 */}
      <div className="flex h-16 items-center border-b px-4 dark:border-gray-800">
        <div className="flex items-center gap-2 font-bold overflow-hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm dark:bg-blue-600 shrink-0">
            AF
          </div>
          <span
            className={cn(
              'text-foreground dark:text-gray-100 whitespace-nowrap transition-all duration-300',
              collapsed ? 'opacity-0 w-0' : 'opacity-100',
            )}
          >
            Agent Flow
          </span>
        </div>
      </div>

      {/* 折叠按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={() => onCollapsedChange(!collapsed)}
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
      </Button>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/dashboard'; // 简化示例，实际应该用 usePathname
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all overflow-hidden',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-gray-800 dark:text-blue-400'
                  : 'text-muted-foreground dark:text-gray-400 hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800/50 dark:hover:text-gray-200',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  'whitespace-nowrap transition-all duration-300',
                  collapsed ? 'opacity-0 w-0' : 'opacity-100',
                )}
              >
                {item.title}
              </span>
            </a>
          );
        })}
      </nav>

      {/* 底部设置 */}
      <div className="border-t p-3 dark:border-gray-800">
        <a
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all overflow-hidden',
            'text-muted-foreground dark:text-gray-400 hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-800/50 dark:hover:text-gray-200',
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span
            className={cn(
              'whitespace-nowrap transition-all duration-300',
              collapsed ? 'opacity-0 w-0' : 'opacity-100',
            )}
          >
            Settings
          </span>
        </a>
      </div>
    </aside>
  );
}
