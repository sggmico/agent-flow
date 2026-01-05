import { db } from '@agent-flow/database';
import { agents } from '@agent-flow/database/schema';
import { type CreateAgentInput, agentListQuerySchema, createAgentSchema } from '@agent-flow/shared';
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/agents
 * 获取 Agent 列表（支持分页、搜索、排序）
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

    // 验证查询参数
    const params = agentListQuerySchema.parse({
      page: getOptionalParam('page'),
      limit: getOptionalParam('limit'),
      status: getOptionalParam('status'),
      search: getOptionalParam('search'),
      sortBy: getOptionalParam('sortBy'),
      sortOrder: getOptionalParam('sortOrder'),
    });

    const { page, limit, status, search, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions = [];

    if (status) {
      conditions.push(eq(agents.status, status));
    }

    if (search) {
      conditions.push(or(ilike(agents.name, `%${search}%`), ilike(agents.role, `%${search}%`)));
    }

    // 构建排序
    const orderByColumn = agents[sortBy];
    const orderByFn = sortOrder === 'asc' ? asc(orderByColumn) : desc(orderByColumn);

    // 查询数据
    const [agentList, countResult] = await Promise.all([
      db
        .select()
        .from(agents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderByFn)
        .limit(limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(agents)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
    ]);

    const total = Number(countResult[0]?.value || 0);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: agentList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GET /api/agents error:', error);

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
 * POST /api/agents
 * 创建新 Agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validated = createAgentSchema.parse(body) as CreateAgentInput;

    // 创建 Agent
    const [newAgent] = await db.insert(agents).values(validated).returning();

    return NextResponse.json(
      {
        success: true,
        data: newAgent,
        message: 'Agent 创建成功',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/agents error:', error);

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
