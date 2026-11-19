import { NextRequest, NextResponse } from 'next/server';
import {
  simulateLatency,
  simulateFailure,
  getTaskById,
  updateTask,
  deleteTask,
} from '@/lib/serverStore';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const task = getTaskById(params.id);
    if (!task) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const body = await req.json();
    const updated = updateTask(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const body = await req.json();
    const updated = updateTask(params.id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const result = deleteTask(params.id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
      data: result.deletedTask,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete task' },
      { status: 500 }
    );
  }
}

