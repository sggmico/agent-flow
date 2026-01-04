# 仓库指南

## 项目结构与模块组织
- `apps/web/` 承载 Next.js 15 Web 应用（App Router）。
- `packages/shared/` 放置跨平台业务逻辑；保持与框架无关。
- `packages/database/` 包含 Drizzle schema、迁移与数据库客户端代码。
- `docs/` 保存规范与架构说明（见 `docs/spec.md`）。
- `scripts/` 包含 worktree 工具与开发脚本（见 `scripts/README.md`）。

## 构建、测试与开发命令
- `pnpm dev` 启动 Web 应用开发模式。
- `pnpm build` 构建工作区内所有包。
- `pnpm start` 启动生产环境 Web 服务。
- `pnpm check` 运行 Biome lint/format 检查；`pnpm check:fix` 自动修复。
- `pnpm type-check` 运行全仓库 TypeScript 检查。
- `pnpm test`、`pnpm test:coverage`、`pnpm test:e2e` 运行 Vitest 单测与 Playwright E2E。
- `pnpm db:generate`、`pnpm db:migrate`、`pnpm db:studio` 管理 Drizzle 迁移。

## 代码风格与命名规范
- 格式由 Biome 约束（`biome.json`）。
- 缩进：2 空格；行宽：100；必须使用分号。
- 引号：JS/TS 使用单引号，JSX 使用双引号。
- 命名：变量/函数用 camelCase，组件/类用 PascalCase，常量用 UPPER_SNAKE_CASE，文件名用 kebab-case，Hook 用 `useX`。
- 业务逻辑不要放在 `apps/web/`；应放在 `packages/shared/`。

## 测试指南
- 单元测试使用 Vitest；E2E 使用 Playwright。
- 测试放在 `__tests__/`，或使用 `.test.ts`/`.test.tsx` 后缀。
- 共享/业务逻辑目标覆盖率 80%+。

## 提交与 Pull Request 指南
- 使用 Conventional Commits：`feat(scope): ...`、`fix(scope): ...`、`docs: ...`。
- PR 需包含清晰摘要、测试结果，UI 变更需附截图。
- 如果 API 行为变更，更新 `docs/spec.md`。

## 配置与环境
- 全局秘钥放在 `/.env`；应用专用变量放在 `apps/web/.env.local`。
- 对客户端暴露的变量必须以 `NEXT_PUBLIC_` 开头。

**最后更新**: 2026-01-04
