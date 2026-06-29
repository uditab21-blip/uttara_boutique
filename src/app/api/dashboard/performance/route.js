import { NextResponse } from 'next/server';
import { getPerformanceData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getPerformanceData();
  return NextResponse.json(data);
}