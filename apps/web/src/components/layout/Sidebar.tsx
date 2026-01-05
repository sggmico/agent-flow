'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bot, ChevronLeft, Home, PlayCircle, Search, Settings, Workflow } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[color:var(--stroke)] bg-[linear-gradient(160deg,rgb(var(--panel-rgb)/0.95),rgb(var(--panel-rgb)/0.72))] shadow-[0_28px_80px_rgba(6,12,20,0.18)] backdrop-blur-lg transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {/* Logo 区域 */}
      <div className="flex h-16 items-center border-b border-[color:var(--stroke)] px-4">
        <div className="flex items-center gap-2 overflow-hidden font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))] text-sm text-white shrink-0 shadow-[0_10px_20px_rgba(45,124,255,0.25)]">
            AF
          </div>
          <span
            className={cn(
              'whitespace-nowrap font-[family:var(--font-display)] text-[color:var(--ink)] transition-all duration-300',
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
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.96)] text-[color:var(--ink-muted)] shadow-[0_8px_20px_rgba(6,12,20,0.18)] hover:text-[color:var(--ink)]"
        onClick={() => onCollapsedChange(!collapsed)}
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
      </Button>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-[rgb(var(--panel-rgb)/0.96)] text-[color:var(--ink)] shadow-[0_16px_34px_rgba(6,12,20,0.18)] ring-1 ring-[rgb(var(--accent-1-rgb)/0.4)]'
                  : 'text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-rgb)/0.82)] hover:text-[color:var(--ink)]',
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
            </Link>
          );
        })}
      </nav>

      {/* 底部设置 */}
      <div className="border-t border-[color:var(--stroke)] p-3">
        <a
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all overflow-hidden',
            'text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-rgb)/0.82)] hover:text-[color:var(--ink)]',
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
