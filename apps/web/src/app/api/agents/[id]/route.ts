import { db } from '@agent-flow/database';
import { agents } from '@agent-flow/database/schema';
import { type UpdateAgentInput, updateAgentSchema } from '@agent-flow/shared';
import { eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/agents/[id]
 * 获取单个 Agent 详情
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number.parseInt(idStr, 10);

    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid agent ID',
          },
        },
        { status: 400 },
      );
    }

    const [agent] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);

    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AGENT_NOT_FOUND',
            message: 'Agent not found',
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error('GET /api/agents/[id] error:', error);

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
 * PUT /api/agents/[id]
 * 更新 Agent
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = Number.parseInt(idStr, 10);

    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid agent ID',
          },
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    // 验证请求体
    const validated = updateAgentSchema.parse(body) as UpdateAgentInput;

    // 检查 Agent 是否存在
    const [existingAgent] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);

    if (!existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AGENT_NOT_FOUND',
            message: 'Agent not found',
          },
        },
        { status: 404 },
      );
    }

    // 更新 Agent
    const [updatedAgent] = await db
      .update(agents)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(agents.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedAgent,
      message: 'Agent 更新成功',
    });
  } catch (error) {
    console.error('PUT /api/agents/[id] error:', error);

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
 * DELETE /api/agents/[id]
 * 删除 Agent
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idStr } = await params;
    const id = Number.parseInt(idStr, 10);

    if (Number.isNaN(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid agent ID',
          },
        },
        { status: 400 },
      );
    }

    // 检查 Agent 是否存在
    const [existingAgent] = await db.select().from(agents).where(eq(agents.id, id)).limit(1);

    if (!existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AGENT_NOT_FOUND',
            message: 'Agent not found',
          },
        },
        { status: 404 },
      );
    }

    // 删除 Agent
    await db.delete(agents).where(eq(agents.id, id));

    return NextResponse.json({
      success: true,
      message: 'Agent 删除成功',
    });
  } catch (error) {
    console.error('DELETE /api/agents/[id] error:', error);

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
