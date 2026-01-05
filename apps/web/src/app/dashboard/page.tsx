import { MainLayout, PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Bot, Clock, PlayCircle, Plus, Workflow } from 'lucide-react';

export default function DashboardPage() {
  return (
    <MainLayout>
      <PageContainer
        title="指挥台"
        description="掌控 Agent 协作与运行状态"
        className="relative"
        headerClassName="bg-transparent border-[color:var(--stroke)]"
        contentClassName="bg-transparent"
        titleClassName="font-[family:var(--font-display)] text-3xl text-[color:var(--ink)]"
        descriptionClassName="text-[color:var(--ink-muted)]"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="gap-2 rounded-full bg-[color:var(--accent-1)] text-white shadow-[0_12px_24px_rgba(45,124,255,0.25)] hover:bg-[rgb(var(--accent-1-rgb)/0.9)]"
            >
              <Plus className="h-4 w-4" />
              创建 Agent
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 rounded-full border-[color:var(--stroke)] text-[color:var(--ink-muted)] hover:border-[color:var(--stroke-strong)] hover:text-[color:var(--ink)]"
            >
              <Workflow className="h-4 w-4" />
              创建工作流
            </Button>
          </div>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: '总 Agents',
                  value: '12',
                  change: '+2 本月',
                  icon: <Bot className="h-4 w-4 text-[color:var(--ink)]" />,
                },
                {
                  label: '工作流',
                  value: '8',
                  change: '+4 本月',
                  icon: <Workflow className="h-4 w-4 text-[color:var(--ink)]" />,
                },
                {
                  label: '执行次数',
                  value: '234',
                  change: '+18%',
                  icon: <PlayCircle className="h-4 w-4 text-[color:var(--ink)]" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] p-5 shadow-[0_18px_45px_rgba(6,12,20,0.16)]"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                    <span>{item.label}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.7)] text-[color:var(--ink)]">
                      {item.icon}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-3xl font-semibold text-[color:var(--ink)]">{item.value}</p>
                    <span className="rounded-full bg-[rgb(var(--accent-2-rgb)/0.15)] px-2 py-1 text-xs font-semibold text-[color:var(--accent-2)]">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] p-6 shadow-[0_26px_60px_rgba(6,12,20,0.2)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                    Activity
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">
                    最近的 Agents
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
                    已更新、创建或运行中的协作体
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full text-[color:var(--ink-muted)] hover:bg-[rgb(var(--panel-rgb)/0.6)] hover:text-[color:var(--ink)]"
                >
                  查看全部
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6 divide-y divide-[color:var(--stroke)]">
                {[
                  {
                    id: 1,
                    name: 'Code Reviewer Agent',
                    status: 'active',
                    time: '2 小时前',
                    color: 'from-[color:var(--accent-2)] to-[color:var(--accent-1)]',
                  },
                  {
                    id: 2,
                    name: 'Documentation Generator',
                    status: 'active',
                    time: '5 小时前',
                    color: 'from-[color:var(--accent-1)] to-[color:var(--accent-3)]',
                  },
                  {
                    id: 3,
                    name: 'Test Case Creator',
                    status: 'idle',
                    time: '1 天前',
                    color: 'from-[color:var(--ink)] to-[color:var(--ink-muted)]',
                  },
                ].map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.color} shadow-sm`}
                        >
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        {agent.status === 'active' && (
                          <div className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-[color:var(--panel-strong)]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                          {agent.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[color:var(--ink-muted)]">
                          <Clock className="h-3.5 w-3.5" />
                          <span>更新于 {agent.time}</span>
                          {agent.status === 'active' && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-[color:var(--accent-2)]">
                                运行中
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-[color:var(--stroke)] text-[color:var(--ink-muted)] hover:border-[color:var(--stroke-strong)] hover:text-[color:var(--ink)]"
                    >
                      编辑
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-[color:var(--stroke)] bg-[linear-gradient(140deg,rgba(var(--accent-1-rgb),0.2),rgba(var(--accent-2-rgb),0.08))] p-6 text-[color:var(--ink)] shadow-[0_28px_80px_rgba(6,12,20,0.25)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                Pulse
              </p>
              <h3 className="mt-2 text-2xl font-semibold">实时运行态势</h3>
              <p className="mt-3 text-sm text-[color:var(--ink-muted)]">
                当前运行中的工作流与 Agent 协作密度。
              </p>
              <div className="mt-6 grid gap-4">
                {[
                  ['Review Flow', '活跃', '86%'],
                  ['Growth Ops', '待启动', '42%'],
                  ['Release Assist', '运行中', '68%'],
                ].map(([name, status, value]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.7)] p-4"
                  >
                    <div className="flex items-center justify-between text-sm text-[color:var(--ink)]">
                      <span className="font-semibold">{name}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                        {status}
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-[rgb(var(--ink-rgb)/0.12)]">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,var(--accent-1),var(--accent-2))]"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.88)] p-6 shadow-[0_20px_60px_rgba(6,12,20,0.2)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                Queue
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--ink)]">下一步执行</h3>
              <div className="mt-4 space-y-3 text-sm text-[color:var(--ink-muted)]">
                {[
                  ['08:30', '市场洞察日报生成', '资料收集'],
                  ['10:00', '发布计划评审', '策略 Agent'],
                  ['13:15', '回归测试', '执行 Agent'],
                ].map(([time, title, owner]) => (
                  <div
                    key={`${time}-${title}`}
                    className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.8)] px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-[color:var(--ink)]">{title}</p>
                      <p className="text-xs text-[color:var(--ink-muted)]">{owner}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </MainLayout>
  );
}
