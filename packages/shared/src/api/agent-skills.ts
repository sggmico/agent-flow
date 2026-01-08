import type { AgentSkill, Skill } from '@agent-flow/database/schema';
import type { BindAgentSkillInput } from '../schemas';

/**
 * API 响应格式
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AgentSkillWithSkill extends AgentSkill {
  skill: Pick<
    Skill,
    | 'id'
    | 'skillId'
    | 'name'
    | 'description'
    | 'documentation'
    | 'mode'
    | 'category'
    | 'handlerType'
    | 'isActive'
    | 'isPublic'
  >;
}

/**
 * 处理 API 错误响应
 */
async function handleApiError(response: Response): Promise<never> {
  let errorMessage = `请求失败 (${response.status})`;

  try {
    const errorData = (await response.json()) as {
      error?: { message?: string };
      message?: string;
    };
    if (errorData.error?.message) {
      errorMessage = errorData.error.message;
    } else if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch {
    if (response.statusText) {
      errorMessage = `${errorMessage}: ${response.statusText}`;
    }
  }

  throw new Error(errorMessage);
}

/**
 * 获取 Agent 已绑定 Skills
 */
export async function getAgentSkills(agentId: number): Promise<ApiResponse<AgentSkillWithSkill[]>> {
  const response = await fetch(`/api/agents/${agentId}/skills`);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<ApiResponse<AgentSkillWithSkill[]>>;
}

/**
 * 绑定 Skill 到 Agent
 */
export async function bindAgentSkill(
  agentId: number,
  data: BindAgentSkillInput,
): Promise<ApiResponse<AgentSkill>> {
  const response = await fetch(`/api/agents/${agentId}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<ApiResponse<AgentSkill>>;
}

/**
 * 解绑 Agent Skill
 */
export async function unbindAgentSkill(
  agentId: number,
  skillId: string,
): Promise<ApiResponse<null>> {
  const response = await fetch(`/api/agents/${agentId}/skills/${encodeURIComponent(skillId)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<ApiResponse<null>>;
}
