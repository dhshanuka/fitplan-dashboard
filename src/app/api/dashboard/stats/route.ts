import { NextRequest, NextResponse } from 'next/server';
import { simulateLatency, simulateFailure, getDashboardStats } from '@/lib/serverStore';

export async function GET(req: NextRequest) {
  try {
    await simulateLatency();
    simulateFailure(req.headers.get('x-mock-failure'));

    const stats = getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

