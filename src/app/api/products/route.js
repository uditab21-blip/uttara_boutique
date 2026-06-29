import { NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    const products = category ? getProductsByCategory(category) : getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
