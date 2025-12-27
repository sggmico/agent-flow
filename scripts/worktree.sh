#!/bin/bash

# Agent Flow - Git Worktree 管理脚本
# 用于多 AI 并行开发（claude-code、gemini-cli、codex 等）

set -e

PROJECT_NAME="agent-flow"
WORKTREE_BASE="../"
BRANCH_PREFIX="dev"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# 显示使用帮助
show_help() {
  cat <<EOF
使用方法: ./worktree.sh <command> [ai-name]

命令:
  add <ai-name>     创建新的 worktree
  remove <ai-name>  删除指定的 worktree
  list              列出所有 worktree
  clean             清理所有 worktree
  help              显示此帮助信息

AI 名称示例:
  claude    -> 创建 dev/claude 分支和 agent-flow-claude 目录
  gemini    -> 创建 dev/gemini 分支和 agent-flow-gemini 目录
  codex     -> 创建 dev/codex 分支和 agent-flow-codex 目录

示例:
  ./worktree.sh add claude
  ./worktree.sh add gemini
  ./worktree.sh list
  ./worktree.sh remove claude
  ./worktree.sh clean
EOF
}

# 创建 worktree
create_worktree() {
  local ai_name=$1
  local branch_name="${BRANCH_PREFIX}/${ai_name}"
  local worktree_path="${WORKTREE_BASE}${PROJECT_NAME}-${ai_name}"

  if [ -z "$ai_name" ]; then
    print_error "请指定 AI 名称"
    show_help
    exit 1
  fi

  # 检查 worktree 目录是否已存在
  if [ -d "$worktree_path" ]; then
    print_error "Worktree 目录已存在: $worktree_path"
    exit 1
  fi

  # 检查分支是否已存在
  if git rev-parse --verify "$branch_name" >/dev/null 2>&1; then
    print_warn "分支 $branch_name 已存在，将使用现有分支"
    git worktree add "$worktree_path" "$branch_name"
  else
    print_info "创建新分支: $branch_name"
    git worktree add -b "$branch_name" "$worktree_path" main
  fi

  print_info "Worktree 创建成功!"
  print_info "路径: $worktree_path"
  print_info "分支: $branch_name"
  echo ""
  print_info "进入工作目录:"
  echo "  cd $worktree_path"
}

# 删除 worktree
remove_worktree() {
  local ai_name=$1
  local branch_name="${BRANCH_PREFIX}/${ai_name}"
  local worktree_path="${WORKTREE_BASE}${PROJECT_NAME}-${ai_name}"

  if [ -z "$ai_name" ]; then
    print_error "请指定 AI 名称"
    show_help
    exit 1
  fi

  if [ ! -d "$worktree_path" ]; then
    print_error "Worktree 不存在: $worktree_path"
    exit 1
  fi

  read -p "确认删除 worktree '$ai_name'? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git worktree remove "$worktree_path"
    print_info "Worktree 已删除: $worktree_path"

    read -p "是否同时删除分支 '$branch_name'? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git branch -D "$branch_name" 2>/dev/null || print_warn "分支不存在或已删除"
      print_info "分支已删除: $branch_name"
    fi
  else
    print_info "取消删除"
  fi
}

# 列出所有 worktree
list_worktrees() {
  print_info "当前所有 worktree:"
  echo ""
  git worktree list
}

# 清理所有 worktree（保留主目录）
clean_all_worktrees() {
  local main_path=$(git rev-parse --show-toplevel)

  read -p "确认清理所有 worktree (保留主目录)? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "取消清理"
    exit 0
  fi

  git worktree list --porcelain | grep "worktree " | cut -d' ' -f2 | while read -r worktree_path; do
    if [ "$worktree_path" != "$main_path" ]; then
      print_info "删除: $worktree_path"
      git worktree remove "$worktree_path" --force
    fi
  done

  print_info "所有 worktree 已清理"

  read -p "是否删除所有 dev/* 分支? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git branch | grep "^  ${BRANCH_PREFIX}/" | sed 's/^  //' | while read -r branch; do
      print_info "删除分支: $branch"
      git branch -D "$branch"
    done
  fi
}

# 主逻辑
case "${1:-help}" in
  add)
    create_worktree "$2"
    ;;
  remove|rm)
    remove_worktree "$2"
    ;;
  list|ls)
    list_worktrees
    ;;
  clean)
    clean_all_worktrees
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    print_error "未知命令: $1"
    echo ""
    show_help
    exit 1
    ;;
esac
