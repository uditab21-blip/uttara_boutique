import { NextResponse } from 'next/server';
import { getSiteHealth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health = getSiteHealth();
  return NextResponse.json(health);
}