import { NextResponse } from 'next/server';
import { getOrderById, getOrderItems, getTrackingByOrderId, getCustomerById } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = getOrderItems(id);
    const tracking = getTrackingByOrderId(id);
    const customer = order.customer_id ? getCustomerById(order.customer_id) : null;

    return NextResponse.json({ order, items, tracking, customer });
  } catch (error) {
    console.error('Order detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
