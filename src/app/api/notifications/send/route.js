import { NextResponse } from 'next/server';
import NotificationManager from '@/lib/notifications';

export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId, type, recipient, message } = body;

    if (!orderId || !type || !recipient || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, type, recipient, message' },
        { status: 400 }
      );
    }

    await NotificationManager.sendManualNotification(orderId, type, recipient, message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
