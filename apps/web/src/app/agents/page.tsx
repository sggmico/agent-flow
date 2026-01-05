'use client';

import { AgentCard } from '@/components/agents/agent-card';
import { CreateAgentDialog } from '@/components/agents/create-agent-dialog';
import { EditAgentDialog } from '@/components/agents/edit-agent-dialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useToast } from '@/hooks/use-toast';
import type { Agent } from '@agent-flow/database/schema';
import { type AgentStatus, deleteAgent, getAgents } from '@agent-flow/shared';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AgentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AgentStatus | 'all' | undefined>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  // 使用防抖搜索，避免频繁请求
  const debouncedSearch = useDebouncedValue(search, 300);

  // 使用 TanStack Query 获取数据
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents', { page, search: debouncedSearch, status, sortBy, sortOrder }],
    queryFn: () =>
      getAgents({
        page,
        limit: 12,
        search: debouncedSearch,
        status: status === 'all' ? undefined : status,
        sortBy,
        sortOrder,
      }),
  });

  // 删除 Agent mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: '删除成功',
        description: 'Agent 已成功删除',
      });
    },
    onError: (error) => {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAgentClick = (agent: Agent) => {
    router.push(`/agents/${agent.id}`);
  };

  const handleCreateAgent = () => {
    setCreateDialogOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditDialogOpen(true);
  };

  const handleDeleteAgent = (agent: Agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (agentToDelete) {
      await deleteMutation.mutateAsync(agentToDelete.id);
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const totalAgents = data?.pagination.total;
  const runningAgents = data?.data.filter((agent) => agent.status === 'working').length ?? 0;
  const sortLabel =
    sortBy === 'createdAt' ? '创建时间' : sortBy === 'updatedAt' ? '更新时间' : '名称';
  const sortOrderLabel = sortOrder === 'desc' ? '降序' : '升序';

  return (
    <MainLayout>
      <PageContainer
        title="AI Agents"
        description="管理和配置你的协作 Agent 团队"
        className="relative"
        headerClassName="bg-transparent border-[color:var(--stroke)]"
        contentClassName="bg-transparent"
        titleClassName="font-[family:var(--font-display)] text-3xl text-[color:var(--ink)]"
        descriptionClassName="text-[color:var(--ink-muted)]"
        actions={
          <Button
            onClick={handleCreateAgent}
            className="rounded-full bg-[color:var(--accent-1)] text-white shadow-[0_12px_24px_rgba(45,124,255,0.25)] hover:bg-[rgb(var(--accent-1-rgb)/0.9)]"
          >
            <Plus className="mr-2 h-4 w-4" />
            创建 Agent
          </Button>
        }
      >
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['总数量', totalAgents ?? '--', '全局'],
              ['运行中', runningAgents, '当前页'],
              ['排序规则', sortLabel, sortOrderLabel],
            ].map(([label, value, helper]) => (
              <div
                key={label}
                className="rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] p-5 shadow-[0_18px_45px_rgba(6,12,20,0.16)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  {label}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-2xl font-semibold text-[color:var(--ink)]">{value}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                    {helper}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] p-4 shadow-[0_20px_60px_rgba(6,12,20,0.2)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink-muted)]" />
                <Input
                  placeholder="搜索名称或角色..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 rounded-full border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.9)] pl-11 text-[color:var(--ink)] placeholder:text-[color:var(--ink-muted)] focus-visible:ring-[color:var(--accent-1)]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as AgentStatus | 'all')}
                >
                  <SelectTrigger className="h-11 w-[140px] rounded-full border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] text-[color:var(--ink)]">
                    <SelectValue placeholder="所有状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="idle">空闲</SelectItem>
                    <SelectItem value="working">工作中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="failed">失败</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="h-11 w-[140px] rounded-full border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] text-[color:var(--ink)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">创建时间</SelectItem>
                    <SelectItem value="updatedAt">更新时间</SelectItem>
                    <SelectItem value="name">名称</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as typeof sortOrder)}
                >
                  <SelectTrigger className="h-11 w-[120px] rounded-full border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] text-[color:var(--ink)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">降序</SelectItem>
                    <SelectItem value="asc">升序</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.9)] p-6 shadow-[0_18px_45px_rgba(6,12,20,0.18)]"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center rounded-[28px] border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] py-20 text-red-500">
              加载失败: {error.message}
            </div>
          )}

          {data && data.data.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] py-20 text-[color:var(--ink-muted)]">
              <p>还没有 Agent</p>
              <Button
                onClick={handleCreateAgent}
                className="rounded-full bg-[color:var(--accent-1)] text-white shadow-[0_12px_24px_rgba(45,124,255,0.25)] hover:bg-[rgb(var(--accent-1-rgb)/0.9)]"
              >
                <Plus className="mr-2 h-4 w-4" />
                创建第一个 Agent
              </Button>
            </div>
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.data.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onClick={handleAgentClick}
                    onEdit={handleEditAgent}
                    onDelete={handleDeleteAgent}
                  />
                ))}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full border-[color:var(--stroke)] text-[color:var(--ink-muted)] hover:border-[color:var(--stroke-strong)] hover:text-[color:var(--ink)]"
                  >
                    上一页
                  </Button>
                  <span className="text-sm text-[color:var(--ink-muted)]">
                    第 {page} / {data.pagination.totalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={page === data.pagination.totalPages}
                    className="rounded-full border-[color:var(--stroke)] text-[color:var(--ink-muted)] hover:border-[color:var(--stroke-strong)] hover:text-[color:var(--ink)]"
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PageContainer>

      {/* 创建 Agent 对话框 */}
      <CreateAgentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* 编辑 Agent 对话框 */}
      <EditAgentDialog
        agent={selectedAgent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除 Agent "{agentToDelete?.name}" 吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
