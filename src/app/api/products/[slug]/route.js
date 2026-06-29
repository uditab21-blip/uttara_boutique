import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const product = getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Product detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
