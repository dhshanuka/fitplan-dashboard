import { NextRequest, NextResponse } from 'next/server';
import {
  simulateLatency,
  simulateFailure,
  getTasks,
  createTask,
} from '@/lib/serverStore';
import { TaskFilterParams } from '@/types/api';

export async function GET(req: NextRequest) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const searchParams = req.nextUrl.searchParams;
    const params: TaskFilterParams = {
      search: searchParams.get('search') || undefined,
      status: (searchParams.get('status') as any) || undefined,
      category: (searchParams.get('category') as any) || undefined,
      priority: (searchParams.get('priority') as any) || undefined,
      quickFilter: (searchParams.get('quickFilter') as any) || undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined,
      sortOrder: (searchParams.get('sortOrder') as any) || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined,
    };

    const result = getTasks(params);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const body = await req.json();

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const newTask = createTask({
      title: body.title,
      description: body.description || '',
      category: body.category || 'Other',
      priority: body.priority || 'Medium',
      status: body.status || 'Todo',
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : undefined,
      targetCalories: body.targetCalories ? Number(body.targetCalories) : undefined,
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create task' },
      { status: 500 }
    );
  }
}

