# Git Worktree 管理脚本

用于 Agent Flow 项目的多 AI 并行开发。

## 初始化

首次使用需复制模板：

```bash
cp scripts/worktree.sh.example scripts/worktree.sh
chmod +x scripts/worktree.sh
```

> `worktree.sh` 已被 gitignore，可自由定制

## 快速开始

### 使用 npm scripts（推荐）

```bash
# 创建 worktree（支持批量）
pnpm wt:add claude
pnpm wt:add claude gemini codex gpt4

# 删除 worktree（支持批量）
pnpm wt:rm claude
pnpm wt:rm claude gemini codex

# 列出所有 worktree
pnpm wt:ls

# 查看共享文件状态
pnpm wt:st
```

### 直接使用脚本

```bash
./scripts/worktree.sh add claude
./scripts/worktree.sh list
```

## 工作流程

### 1. 为每个 AI 创建独立工作区

```bash
./scripts/worktree.sh add claude
# → 创建 agent-flow-claude/ 目录
# → 创建 dev/claude 分支
# → 从 main 分支检出

cd ../agent-flow-claude
# 现在可以在这里使用 claude-code 工作
```

### 2. 多个 AI 并行工作

```bash
# Terminal 1: Claude Code
cd agent-flow-claude
claude-code

# Terminal 2: Gemini CLI
cd agent-flow-gemini
gemini-cli

# Terminal 3: Codex
cd agent-flow-codex
codex
```

### 3. 合并工作成果

```bash
# 在主目录
cd agent-flow

# 查看 claude 的改动
git diff main..dev/claude

# 合并 claude 的工作
git merge dev/claude

# 推送到远程
git push origin main
```

## 完整命令

| npm script        | 脚本命令                           | 说明                |
| ----------------- | ------------------------------ | ----------------- |
| `pnpm wt:add ...` | `./scripts/worktree.sh add`    | 创建 worktree（支持批量） |
| `pnpm wt:rm ...`  | `./scripts/worktree.sh remove` | 删除 worktree（支持批量） |
| `pnpm wt:ls`      | `./scripts/worktree.sh list`   | 列出所有 worktree     |
| `pnpm wt:st`      | `./scripts/worktree.sh status` | 显示共享文件状态          |
| `pnpm wt:clean`   | `./scripts/worktree.sh clean`  | 清理所有 worktree     |
| `pnpm wt help`    | `./scripts/worktree.sh help`   | 显示帮助              |

## 目录结构

```
ws/cc/agent-flow-ws/
├── agent-flow/          # 主工作目录 (main 分支)
├── agent-flow-claude/   # Claude Code 工作区 (dev/claude 分支)
├── agent-flow-gemini/   # Gemini CLI 工作区 (dev/gemini 分支)
└── agent-flow-codex/    # Codex 工作区 (dev/codex 分支)
```

## 配置共享机制

创建 worktree 时，以下文件/目录会**自动创建软链接**，所有 worktree 共享同一份配置：

- `.env` - 环境变量配置
- `.claude/settings.local.json` - Claude Code 设置
- `docs/*_local/` - 本地文档目录

**优点**：修改任意 worktree 中的共享文件，其他 worktree 自动同步

**查看状态**：
```bash
pnpm wt:st  # 查看所有共享文件的链接状态
```

## 注意事项

1. **依赖安装**：每个 worktree 共享 `.git` 目录，但 `node_modules` 需要分别安装
   ```bash
   cd ../agent-flow-claude
   pnpm install
   ```

2. **共享配置**：`.env` 等配置文件通过软链接共享，修改一处全部同步

3. **分支管理**：所有 dev/* 分支都是从 main 创建的，定期同步 main 分支：
   ```bash
   git fetch origin main
   git rebase origin/main
   ```

4. **清理 worktree**：删除 worktree 前确保已提交或备份重要改动

## 最佳实践

- 🎯 **功能分离**：让不同 AI 负责不同的功能模块
- 🔄 **定期合并**：及时将完成的功能合并回 main
- 🧹 **定期清理**：删除不再使用的 worktree 节省磁盘空间
- 📝 **清晰命名**：使用有意义的 AI 名称（如 `claude-db`、`gemini-ui`）
