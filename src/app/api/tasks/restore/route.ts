import { NextRequest, NextResponse } from 'next/server';
import { simulateLatency, simulateFailure, restoreTask } from '@/lib/serverStore';

export async function POST(req: NextRequest) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required for restore' },
        { status: 400 }
      );
    }

    const restored = restoreTask(body.id);
    if (!restored) {
      return NextResponse.json(
        { success: false, error: 'Task not found in deleted buffer' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task restored successfully',
      data: restored,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to restore task' },
      { status: 500 }
    );
  }
}

