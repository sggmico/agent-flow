export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--surface)] text-[color:var(--ink)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_12%_-12%,rgb(var(--accent-1-rgb)/0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_85%_10%,rgb(var(--accent-2-rgb)/0.2),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_circle_at_50%_120%,rgb(var(--accent-3-rgb)/0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(var(--grid-rgb),0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--grid-rgb),0.12)_1px,transparent_1px)] [background-size:48px_48px] opacity-45" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(var(--grid-rgb),0.2)_1px,transparent_1px)] [background-size:140px_140px] opacity-15" />
      <div className="pointer-events-none absolute inset-0 grain opacity-10 dark:opacity-20" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="flex flex-col items-start gap-8">
          <div className="reveal inline-flex items-center gap-3 rounded-full border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.75)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--ink-muted)]">
            <span className="inline-flex h-2 w-2 rounded-full bg-[color:var(--accent-1)]" />
            Beta 已开放 · 2026
          </div>

          <div className="space-y-6">
            <h1
              className="reveal font-[family:var(--font-display)] text-5xl leading-[1.4] sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '120ms' }}
            >
              让 Agent 像团队一样协作，
              <span className="mt-2 block bg-[linear-gradient(90deg,var(--accent-1),var(--accent-2))] bg-clip-text text-transparent">
                而不是工具。
              </span>
            </h1>
            <p
              className="reveal max-w-xl text-lg text-[color:var(--ink-muted)] sm:text-xl"
              style={{ animationDelay: '200ms' }}
            >
              Agent Flow 用可视化工作台把编排、执行、审计整合成一个连续的操作面板，让每个 Agent
              都有清晰职责与可靠产出。
            </p>
          </div>

          <div className="reveal flex flex-wrap gap-3" style={{ animationDelay: '280ms' }}>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(120deg,var(--accent-1),var(--accent-2))] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_rgba(45,124,255,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(45,124,255,0.45)]"
            >
              进入控制台
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--panel-strong-rgb)/0.92)] text-[color:var(--ink)]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--stroke)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--ink-muted)] transition hover:border-[color:var(--stroke-strong)] hover:text-[color:var(--ink)]"
            >
              查看文档
            </a>
          </div>

          <div
            className="reveal grid w-full gap-4 sm:grid-cols-3"
            style={{ animationDelay: '360ms' }}
          >
            {[
              ['可视化编排', '拖拽搭建、即刻回放'],
              ['多 Agent 协作', '角色分工与交接可追踪'],
              ['实时监控', '任务、日志、结果同屏'],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.8)] p-4 shadow-[0_20px_60px_rgba(6,12,20,0.18)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                  Feature
                </p>
                <p className="mt-2 font-semibold text-[color:var(--ink)]">{title}</p>
                <p className="mt-2 text-sm text-[color:var(--ink-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="float-slower absolute -left-6 top-8 hidden h-24 w-24 rounded-3xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.8)] shadow-[0_20px_40px_rgba(6,12,20,0.2)] lg:block" />
          <div className="float-slow absolute -right-8 bottom-10 hidden h-20 w-20 rounded-full border border-[color:var(--stroke)] bg-[rgb(var(--accent-3-rgb)/0.65)] lg:block" />

          <div className="relative w-full max-w-md rounded-[32px] border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.9)] p-6 shadow-[0_30px_80px_rgba(6,12,20,0.25)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--ink-muted)]">
                  Flow Canvas
                </p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--ink)]">协作轨迹</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[rgb(var(--accent-2-rgb)/0.15)] px-3 py-1 text-xs font-semibold text-[color:var(--accent-2)]">
                Live
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ['检索 Agent', '收集市场输入', 'queued'],
                ['策略 Agent', '生成决策草案', 'running'],
                ['执行 Agent', '发布自动化任务', 'ready'],
              ].map(([title, desc, status]) => (
                <div
                  key={title}
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--stroke)] bg-[rgb(var(--panel-rgb)/0.82)] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--ink)]">{title}</p>
                    <p className="text-xs text-[color:var(--ink-muted)]">{desc}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                    {status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--stroke)] bg-[linear-gradient(135deg,rgba(var(--accent-1-rgb),0.18),rgba(var(--accent-2-rgb),0.1))] p-4 text-[color:var(--ink)]">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
                <span>Runtime</span>
                <span>98.7% 成功率</span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold">00:42</p>
                  <p className="text-xs text-[color:var(--ink-muted)]">平均响应时间</p>
                </div>
                <div className="flex gap-2">
                  {[68, 40, 55, 30, 76].map((value, index) => (
                    <span
                      key={`${value}-${index}`}
                      className="inline-flex w-3 rounded-full bg-[linear-gradient(180deg,var(--accent-1),var(--accent-2))]"
                      style={{ height: `${value}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[color:var(--ink-muted)]">
              <span>审计记录 · 自动生成</span>
              <span>23 项</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
