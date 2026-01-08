import { db, eq, getAgentSkillLink, unbindSkillFromAgent } from '@agent-flow/database';
import { agents } from '@agent-flow/database/schema';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/agents/[id]/skills/[skillId]
 * 解绑 Agent Skill
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; skillId: string }> },
) {
  try {
    const { id: idStr, skillId } = await params;
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

    if (!skillId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SKILL_ID',
            message: 'Invalid skill ID',
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

    const existingLink = await getAgentSkillLink(agentId, skillId);
    if (!existingLink) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AGENT_SKILL_NOT_FOUND',
            message: 'Agent skill link not found',
          },
        },
        { status: 404 },
      );
    }

    await unbindSkillFromAgent(agentId, skillId);

    return NextResponse.json({
      success: true,
      message: 'Skill 解绑成功',
    });
  } catch (error) {
    console.error('DELETE /api/agents/[id]/skills/[skillId] error:', error);

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
