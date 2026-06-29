import { NextResponse } from 'next/server';
import { getOrders, getOrderById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    const order = getOrderById(id);
    return NextResponse.json(order);
  }
  
  const orders = getOrders();
  return NextResponse.json(orders);
}