import { NextResponse } from 'next/server';
import { getCartItems, addCartItem, updateCartItemQuantity, removeCartItem } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = getCartItems(sessionId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, product_id, quantity, item_id } = body;

    if (item_id) {
      updateCartItemQuantity(item_id, quantity);
      const items = getCartItems(session_id);
      const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return NextResponse.json({ success: true, cartCount });
    }

    if (!session_id || !product_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    addCartItem(session_id, product_id, quantity || 1);
    const items = getCartItems(session_id);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ success: true, cartCount });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { session_id, item_id } = body;

    if (!item_id) {
      return NextResponse.json({ error: 'Missing item_id' }, { status: 400 });
    }

    removeCartItem(item_id);
    const items = getCartItems(session_id);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ success: true, cartCount });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
