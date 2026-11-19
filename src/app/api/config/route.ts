import { NextRequest, NextResponse } from 'next/server';
import { getMockFailureRate, setMockFailureRate, resetStore } from '@/lib/serverStore';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      mockFailureRate: getMockFailureRate(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.mockFailureRate === 'number') {
      setMockFailureRate(body.mockFailureRate);
    }
    if (body.reset === true) {
      resetStore();
    }
    return NextResponse.json({
      success: true,
      data: {
        mockFailureRate: getMockFailureRate(),
      },
      message: 'Config updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update config' },
      { status: 400 }
    );
  }
}

