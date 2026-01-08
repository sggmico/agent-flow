'use client';

import { EditAgentDialog } from '@/components/agents/edit-agent-dialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Agent } from '@agent-flow/database/schema';
import { bindAgentSkill, deleteAgent, getAgent, getAgentSkills, unbindAgentSkill } from '@agent-flow/shared';
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
  const [skillIdInput, setSkillIdInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('');
  const [configInput, setConfigInput] = useState('');

  const agentId = Number.parseInt(params?.id ?? '', 10);

  // 获取 Agent 数据
  const { data, isLoading, error } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => getAgent(agentId),
    enabled: Number.isFinite(agentId), // 只有当 agentId 有效时才发起请求
  });

  const {
    data: skillsData,
    isLoading: isSkillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ['agent-skills', agentId],
    queryFn: () => getAgentSkills(agentId),
    enabled: Number.isFinite(agentId),
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

  const bindMutation = useMutation({
    mutationFn: (payload: { agentId: number; skillId: string; priority?: number; config?: unknown }) =>
      bindAgentSkill(payload.agentId, {
        skillId: payload.skillId,
        priority: payload.priority,
        config:
          payload.config && typeof payload.config === 'object'
            ? (payload.config as Record<string, unknown>)
            : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-skills', agentId] });
      toast({
        title: '绑定成功',
        description: 'Skill 已绑定到当前 Agent',
      });
      setSkillIdInput('');
      setPriorityInput('');
      setConfigInput('');
    },
    onError: (error) => {
      toast({
        title: '绑定失败',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const unbindMutation = useMutation({
    mutationFn: (payload: { agentId: number; skillId: string }) =>
      unbindAgentSkill(payload.agentId, payload.skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-skills', agentId] });
      toast({
        title: '解绑成功',
        description: 'Skill 已从 Agent 解绑',
      });
    },
    onError: (error) => {
      toast({
        title: '解绑失败',
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

  const handleBindSkill = async () => {
    const skillId = skillIdInput.trim();
    if (!skillId) {
      toast({
        title: 'Skill ID 不能为空',
        variant: 'destructive',
      });
      return;
    }

    let parsedConfig: unknown | undefined;
    if (configInput.trim()) {
      try {
        parsedConfig = JSON.parse(configInput);
      } catch (parseError) {
        toast({
          title: '配置格式错误',
          description: parseError instanceof Error ? parseError.message : '请填写合法 JSON',
          variant: 'destructive',
        });
        return;
      }
    }

    const priority = priorityInput.trim()
      ? Number.parseInt(priorityInput.trim(), 10)
      : undefined;
    if (priorityInput.trim() && (Number.isNaN(priority) || priority < 0)) {
      toast({
        title: '优先级无效',
        description: '优先级需为非负整数',
        variant: 'destructive',
      });
      return;
    }

    await bindMutation.mutateAsync({
      agentId,
      skillId,
      priority,
      config: parsedConfig,
    });
  };

  const handleUnbindSkill = async (skillId: string) => {
    if (window.confirm(`确定要解绑 Skill "${skillId}" 吗？`)) {
      await unbindMutation.mutateAsync({ agentId, skillId });
    }
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
            <TabsTrigger value="skills">Skills</TabsTrigger>
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

          {/* Skills 标签 */}
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>已绑定 Skills</CardTitle>
                <CardDescription>该 Agent 当前可用的技能列表</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4">
                  <div className="text-sm font-medium">绑定新 Skill</div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="skill-id">Skill ID</Label>
                      <Input
                        id="skill-id"
                        value={skillIdInput}
                        onChange={(event) => setSkillIdInput(event.target.value)}
                        placeholder="例如: file.read"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-priority">优先级（可选）</Label>
                      <Input
                        id="skill-priority"
                        value={priorityInput}
                        onChange={(event) => setPriorityInput(event.target.value)}
                        placeholder="例如: 10"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="skill-config">配置（JSON，可选）</Label>
                      <Textarea
                        id="skill-config"
                        value={configInput}
                        onChange={(event) => setConfigInput(event.target.value)}
                        placeholder='例如: {"maxSize": 1048576}'
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleBindSkill} disabled={bindMutation.isPending}>
                      {bindMutation.isPending ? '绑定中...' : '绑定 Skill'}
                    </Button>
                  </div>
                </div>

                {isSkillsLoading && (
                  <div className="text-center py-6 text-muted-foreground">加载中...</div>
                )}

                {skillsError && (
                  <div className="text-center py-6 text-red-500">
                    加载失败: {skillsError.message}
                  </div>
                )}

                {!isSkillsLoading &&
                  !skillsError &&
                  (skillsData?.data.length ? (
                    <div className="space-y-4">
                      {skillsData.data.map((link) => (
                        <div
                          key={`${link.agentId}-${link.skillId}`}
                          className="rounded-lg border border-border bg-card p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-base font-semibold">{link.skill.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {link.skill.skillId}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="rounded-md bg-secondary px-2 py-1">
                                {link.skill.category}
                              </span>
                              <span className="rounded-md bg-secondary px-2 py-1">
                                {link.skill.handlerType}
                              </span>
                              {link.priority !== null && link.priority !== undefined && (
                                <span className="rounded-md bg-secondary px-2 py-1">
                                  优先级 {link.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {link.skill.description}
                          </div>
                          {link.config && (
                            <div className="mt-3 rounded-md bg-muted p-3 text-sm">
                              <div className="text-xs font-medium text-muted-foreground mb-1">
                                配置
                              </div>
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(link.config, null, 2)}
                              </pre>
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() => handleUnbindSkill(link.skillId)}
                              disabled={unbindMutation.isPending}
                            >
                              解绑
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      暂未绑定任何 Skill
                    </div>
                  ))}
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
