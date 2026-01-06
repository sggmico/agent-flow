'use client';

import { EditAgentDialog } from '@/components/agents/edit-agent-dialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Agent } from '@agent-flow/database/schema';
import { deleteAgent, getAgent } from '@agent-flow/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Brain, Clock, Edit, Hash, Thermometer, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const agentId = Number.parseInt(params?.id ?? '', 10);

  // 获取 Agent 数据
  const { data, isLoading, error } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => getAgent(agentId),
    enabled: Number.isFinite(agentId), // 只有当 agentId 有效时才发起请求
  });

  // 删除 mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      // 失效列表页缓存
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // 移除当前 agent 的详情缓存
      queryClient.removeQueries({ queryKey: ['agent', agentId] });

      toast({
        title: '删除成功',
        description: 'Agent 已成功删除',
      });
      router.push('/agents');
    },
    onError: (error) => {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm(`确定要删除 Agent "${data?.data.name}" 吗？`)) {
      await deleteMutation.mutateAsync(agentId);
    }
  };

  const handleBack = () => {
    router.push('/agents');
  };

  // 处理无效的 agentId
  if (!Number.isFinite(agentId)) {
    return (
      <MainLayout>
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-red-500">无效的 Agent ID</p>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回列表
            </Button>
          </div>
        </PageContainer>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </PageContainer>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout>
        <PageContainer>
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-red-500">加载失败: {error?.message || '未知错误'}</p>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回列表
            </Button>
          </div>
        </PageContainer>
      </MainLayout>
    );
  }

  const agent = data.data;

  return (
    <MainLayout>
      <PageContainer
        title={agent.name}
        description={agent.role}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回列表
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          </div>
        }
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="config">配置</TabsTrigger>
            <TabsTrigger value="executions">执行历史</TabsTrigger>
          </TabsList>

          {/* 概览标签 */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">描述</div>
                  <div className="mt-1">{agent.description || '无描述'}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">状态</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          agent.status === 'idle'
                            ? 'bg-gray-500'
                            : agent.status === 'working'
                              ? 'bg-blue-500'
                              : agent.status === 'completed'
                                ? 'bg-green-500'
                                : agent.status === 'failed'
                                  ? 'bg-red-500'
                                  : 'bg-yellow-500'
                        }`}
                      />
                      <span>
                        {agent.status === 'idle'
                          ? '空闲'
                          : agent.status === 'working'
                            ? '工作中'
                            : agent.status === 'completed'
                              ? '已完成'
                              : agent.status === 'failed'
                                ? '失败'
                                : '已暂停'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">创建时间</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(agent.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 配置标签 */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>模型配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      LLM 模型
                    </div>
                    <div>{agent.model}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      温度
                    </div>
                    <div>{agent.temperature}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      最大 Tokens
                    </div>
                    <div>{agent.maxTokens}</div>
                  </div>
                </div>

                {agent.systemPrompt && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">系统提示词</div>
                    <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                      {agent.systemPrompt}
                    </div>
                  </div>
                )}

                {agent.tools && agent.tools.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">工具</div>
                    <div className="mt-1 flex gap-2 flex-wrap">
                      {agent.tools.map((tool) => (
                        <span key={tool} className="px-2 py-1 text-sm bg-secondary rounded-md">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 执行历史标签 */}
          <TabsContent value="executions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>执行历史</CardTitle>
                <CardDescription>查看该 Agent 的执行记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">暂无执行记录</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>

      {/* 编辑对话框 */}
      <EditAgentDialog agent={agent} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </MainLayout>
  );
}
