'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Agent } from '@agent-flow/database/schema';
import { Brain, Clock, Edit, MoreVertical, Settings, Trash2 } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  onClick?: (agent: Agent) => void;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
}

/**
 * Agent 状态颜色映射
 */
const statusColors = {
  idle: 'bg-slate-400',
  working: 'bg-cyan-400',
  completed: 'bg-emerald-400',
  failed: 'bg-rose-500',
  paused: 'bg-amber-400',
};

/**
 * Agent 状态文本映射
 */
const statusText = {
  idle: '空闲',
  working: '工作中',
  completed: '已完成',
  failed: '失败',
  paused: '已暂停',
};

export function AgentCard({ agent, onClick, onEdit, onDelete }: AgentCardProps) {
  return (
    <Card className="border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.9)] shadow-[0_18px_45px_rgba(6,12,20,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(6,12,20,0.24)]">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            className="flex-1 cursor-pointer text-left bg-transparent border-none p-0"
            onClick={() => onClick?.(agent)}
          >
            <CardTitle className="text-lg text-[color:var(--ink)]">{agent.name}</CardTitle>
            <CardDescription className="mt-1 text-[color:var(--ink-muted)]">
              {agent.role}
            </CardDescription>
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${statusColors[agent.status ?? 'idle']}`}
              title={statusText[agent.status ?? 'idle']}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-rgb)/0.6)] hover:text-[color:var(--ink)]"
                  aria-label="更多操作"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(agent)}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(agent)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {agent.description && (
            <p className="text-sm text-[color:var(--ink-muted)] line-clamp-2">
              {agent.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-[color:var(--ink-muted)]">
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span>{agent.model}</span>
            </div>

            <div className="flex items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>温度: {agent.temperature}</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {agent.tools && agent.tools.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {agent.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.85)] px-3 py-1 text-xs text-[color:var(--ink)]"
                >
                  {tool}
                </span>
              ))}
              {agent.tools.length > 3 && (
                <span className="px-2 py-1 text-xs text-[color:var(--ink-muted)]">
                  +{agent.tools.length - 3} 更多
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
