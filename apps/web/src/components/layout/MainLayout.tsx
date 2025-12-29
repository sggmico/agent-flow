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
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop (Fixed) */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      {sidebarOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
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
  );
}
