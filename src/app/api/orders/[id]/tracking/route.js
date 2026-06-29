import { NextResponse } from 'next/server';
import TrackingManager from '@/lib/tracking';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const tracking = await TrackingManager.getTracking(id);
    return NextResponse.json(tracking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { milestone, location, notes } = body;
    
    if (!milestone) {
      return NextResponse.json({ error: 'Milestone is required' }, { status: 400 });
    }

    const result = await TrackingManager.updateMilestone(id, milestone, location, notes);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
