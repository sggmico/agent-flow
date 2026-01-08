import type { Skill } from '@agent-flow/database/schema';
import type { CreateSkillInput, SkillListQuery } from '../schemas';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

export async function listSkills(
  query: Partial<SkillListQuery> = {},
): Promise<ApiResponse<Skill[]>> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const response = await fetch(`/api/skills?${params.toString()}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<ApiResponse<Skill[]>>;
}

export async function getSkill(skillId: string): Promise<ApiResponse<Skill>> {
  const response = await fetch(`/api/skills/${encodeURIComponent(skillId)}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<ApiResponse<Skill>>;
}

export async function createSkill(data: CreateSkillInput): Promise<ApiResponse<Skill>> {
  const response = await fetch('/api/skills', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<ApiResponse<Skill>>;
}
