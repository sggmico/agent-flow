'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-[color:var(--surface)] text-[color:var(--ink)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_-10%,rgb(var(--accent-1-rgb)/0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_90%_10%,rgb(var(--accent-2-rgb)/0.2),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_120%,rgb(var(--accent-3-rgb)/0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(var(--grid-rgb),0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--grid-rgb),0.12)_1px,transparent_1px)] [background-size:48px_48px] opacity-45" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(var(--grid-rgb),0.2)_1px,transparent_1px)] [background-size:140px_140px] opacity-15" />
      <div className="pointer-events-none absolute inset-0 grain opacity-10 dark:opacity-20" />

      <div className="relative z-10">
        {/* Sidebar - Desktop (Fixed) */}
        <div className="hidden md:block">
          <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
        </div>

        {/* Sidebar - Mobile (Overlay) */}
        {sidebarOpen && (
          <>
            {/* 遮罩层 */}
            <div
              className="fixed inset-0 z-30 bg-[rgb(var(--surface-rgb)/0.7)] backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSidebarOpen(false);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Close sidebar"
            />
            {/* 侧边栏 */}
            <div className="fixed inset-y-0 left-0 z-40 md:hidden">
              <Sidebar collapsed={false} onCollapsedChange={() => {}} />
            </div>
          </>
        )}

        {/* 主内容区 - 根据 sidebar collapsed 状态动态调整 padding */}
        <div
          className={cn('transition-all duration-300', sidebarCollapsed ? 'md:pl-16' : 'md:pl-64')}
        >
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </div>
  );
}
