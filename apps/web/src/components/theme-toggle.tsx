'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] hover:bg-[rgb(var(--panel-rgb)/0.7)]"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.96)]"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="text-[color:var(--ink-muted)] focus:bg-[rgb(var(--panel-rgb)/0.8)] focus:text-[color:var(--ink)]"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="text-[color:var(--ink-muted)] focus:bg-[rgb(var(--panel-rgb)/0.8)] focus:text-[color:var(--ink)]"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="text-[color:var(--ink-muted)] focus:bg-[rgb(var(--panel-rgb)/0.8)] focus:text-[color:var(--ink)]"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
