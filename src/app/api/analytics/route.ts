import { NextResponse } from 'next/server';
import { getSystemAnalytics } from '@/lib/analytics-service';

export async function GET() {
  try {
    const data = await getSystemAnalytics();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
