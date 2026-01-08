import { bindSkillToAgent, db, eq, getAgentSkillLink, getAgentSkills } from '@agent-flow/database';
import { agents, skills } from '@agent-flow/database/schema';
import { type BindAgentSkillInput, bindAgentSkillSchema } from '@agent-flow/shared';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/agents/[id]/skills
 * 获取 Agent 已绑定 Skills
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const agentId = Number.parseInt(idStr, 10);

    if (Number.isNaN(agentId) || agentId <= 0) {
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

    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
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

    const data = await getAgentSkills(agentId);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('GET /api/agents/[id]/skills error:', error);

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
 * POST /api/agents/[id]/skills
 * 绑定 Skill 到 Agent
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const agentId = Number.parseInt(idStr, 10);

    if (Number.isNaN(agentId) || agentId <= 0) {
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
    const validated = bindAgentSkillSchema.parse(body) as BindAgentSkillInput;

    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
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

    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.skillId, validated.skillId))
      .limit(1);
    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SKILL_NOT_FOUND',
            message: 'Skill not found',
          },
        },
        { status: 404 },
      );
    }

    const existingLink = await getAgentSkillLink(agentId, validated.skillId);
    if (existingLink) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AGENT_SKILL_EXISTS',
            message: 'Skill already bound to agent',
          },
        },
        { status: 409 },
      );
    }

    const created = await bindSkillToAgent(agentId, validated.skillId, {
      config: validated.config,
      priority: validated.priority,
    });

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: 'Skill 绑定成功',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('POST /api/agents/[id]/skills error:', error);

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
