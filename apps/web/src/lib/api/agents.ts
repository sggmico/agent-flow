import type { Agent } from '@agent-flow/database/schema';
import type { AgentListQuery, CreateAgentInput, UpdateAgentInput } from '@agent-flow/shared/schemas';

/**
 * API 响应格式
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface AgentListResponse {
  success: boolean;
  data: Agent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 处理 API 错误响应
 */
async function handleApiError(response: Response): Promise<never> {
  let errorMessage = `请求失败 (${response.status})`;

  try {
    const errorData = await response.json();
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch {
    // 如果无法解析 JSON，使用默认错误消息
    if (response.statusText) {
      errorMessage = `${errorMessage}: ${response.statusText}`;
    }
  }

  throw new Error(errorMessage);
}

/**
 * 获取 Agent 列表
 */
export async function getAgents(params: Partial<AgentListQuery> = {}): Promise<AgentListResponse> {
  const searchParams = new URLSearchParams();

  // 添加查询参数
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.status) searchParams.set('status', params.status);
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const url = `/api/agents${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * 获取单个 Agent
 */
export async function getAgent(id: number): Promise<ApiResponse<Agent>> {
  const response = await fetch(`/api/agents/${id}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * 创建 Agent
 */
export async function createAgent(data: CreateAgentInput): Promise<ApiResponse<Agent>> {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * 更新 Agent
 */
export async function updateAgent(id: number, data: UpdateAgentInput): Promise<ApiResponse<Agent>> {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * 删除 Agent
 */
export async function deleteAgent(id: number): Promise<ApiResponse<null>> {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}
