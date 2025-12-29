import { MainLayout, PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Bot, Clock, PlayCircle, Plus, Workflow } from 'lucide-react';

export default function DashboardPage() {
  return (
    <MainLayout>
      <PageContainer
        title="Dashboard"
        description="概览您的 AI Agents 和工作流"
        titleClassName="dark:text-gray-50"
        descriptionClassName="dark:text-gray-400"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="gap-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              创建 Agent
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:hover:border-gray-600"
            >
              <Workflow className="h-4 w-4" />
              创建工作流
            </Button>
          </div>
        }
      >
        {/* 统计卡片 - 优化版 */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow dark:hover:shadow-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                总 Agents
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center dark:from-blue-600 dark:to-blue-700">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-gray-50">12</div>
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+2</span>{' '}
                <span className="dark:text-gray-500">较上月</span>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow dark:hover:shadow-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                工作流
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center dark:from-purple-600 dark:to-purple-700">
                <Workflow className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-gray-50">8</div>
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+4</span>{' '}
                <span className="dark:text-gray-500">较上月</span>
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow dark:hover:shadow-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                执行次数
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center dark:from-emerald-600 dark:to-emerald-700">
                <PlayCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-gray-50">234</div>
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">+18%</span>{' '}
                <span className="dark:text-gray-500">较上月</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 最近活动 */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold dark:text-gray-50">最近的 Agents</h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                您最近创建或修改的 AI Agents
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
            >
              查看全部
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>

          <Card className="overflow-hidden dark:divide-gray-800">
            <CardContent className="p-0">
              <div className="divide-y dark:divide-gray-800">
                {[
                  {
                    id: 1,
                    name: 'Code Reviewer Agent',
                    status: 'active',
                    time: '2 小时前',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    id: 2,
                    name: 'Documentation Generator',
                    status: 'active',
                    time: '5 小时前',
                    color: 'from-purple-500 to-pink-500',
                  },
                  {
                    id: 3,
                    name: 'Test Case Creator',
                    status: 'idle',
                    time: '1 天前',
                    color: 'from-orange-500 to-red-500',
                  },
                ].map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group dark:hover:bg-gray-800/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${agent.color} shadow-sm`}
                        >
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        {agent.status === 'active' && (
                          <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold dark:text-gray-100">{agent.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-500 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>更新于 {agent.time}</span>
                          {agent.status === 'active' && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                运行中
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
                    >
                      编辑
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </MainLayout>
  );
}
