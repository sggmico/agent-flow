import { getSkillBySkillId } from '@agent-flow/database';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/skills/[id]
 * 获取 Skill 详情
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'Invalid skill ID',
          },
        },
        { status: 400 },
      );
    }

    const skill = await getSkillBySkillId(id);
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

    return NextResponse.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('GET /api/skills/[id] error:', error);

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
