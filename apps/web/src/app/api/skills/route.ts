import { createSkill, getSkillBySkillId, listSkills } from '@agent-flow/database';
import { type CreateSkillInput, createSkillSchema, skillListQuerySchema } from '@agent-flow/shared';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/skills
 * 获取 Skill 列表（支持分页、搜索、筛选）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const getOptionalParam = (key: string) => {
      const value = searchParams.get(key);
      if (value === null) return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const params = skillListQuerySchema.parse({
      page: getOptionalParam('page'),
      limit: getOptionalParam('limit'),
      search: getOptionalParam('search'),
      category: getOptionalParam('category'),
      mode: getOptionalParam('mode'),
      sortBy: getOptionalParam('sortBy'),
      sortOrder: getOptionalParam('sortOrder'),
    });

    const { items, total } = await listSkills(params);
    const totalPages = Math.ceil(total / params.limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GET /api/skills error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/skills
 * 创建 Skill（Prompt/Tool 双层并存）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSkillSchema.parse(body) as CreateSkillInput;

    const existing = await getSkillBySkillId(validated.skillId);
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SKILL_EXISTS',
            message: 'Skill already exists',
          },
        },
        { status: 409 },
      );
    }

    const handlerType =
      validated.mode === 'prompt' ? 'prompt' : (validated.handlerType ?? 'builtin');

    const created = await createSkill({
      skillId: validated.skillId,
      name: validated.name,
      description: validated.description,
      documentation: validated.documentation ?? '',
      mode: validated.mode,
      category: validated.category,
      parameters: validated.parameters ?? {},
      returns: validated.returns ?? {},
      handler: validated.handler ?? (validated.mode === 'prompt' ? 'prompt' : ''),
      handlerType,
      permissions: validated.permissions ?? [],
      estimatedCost: validated.estimatedCost ?? {},
      version: validated.version,
      isActive: validated.isActive,
      isPublic: validated.isPublic,
      createdBy: validated.createdBy ?? null,
      usageCount: validated.usageCount ?? 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Skill 创建成功',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/skills error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 },
    );
  }
}
