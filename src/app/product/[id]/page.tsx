import { notFound } from 'next/navigation';
import axios from 'axios';
import ProductDetail1 from '@/components/ProductDetail/ProductDetail1';
import { CartProvider } from '@/components/Cart/CartProvider';

// This function is required for static export
export async function generateStaticParams() {
  // Only try to fetch data if we're in a development environment
  // For production builds, return empty array to avoid build-time API calls
  if (process.env.NODE_ENV === 'development') {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:500';
      const response = await axios.get(`${apiUrl}/public/s/68985dc8b866be5ac50c15f9/products`);
      const products = response.data || [];
      
      return products.map((product: any) => ({
        id: product._id,
      }));
    } catch (error) {
      console.error('Error generating static params:', error);
    }
  }
  
  // Return empty array for production builds
  return [];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  try {
    // Use environment variable for API URL, fallback to localhost for development
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:500';
    const response = await axios.get(`${apiUrl}/public/s/68985dc8b866be5ac50c15f9/products`);
    const products = response.data || [];
    
    // Find the product with the matching ID
    const product = products.find((p: any) => p._id === id);
    
    if (!product) {
      notFound();
    }
    
    return (
      <CartProvider>
        <ProductDetail1 product={product} />
      </CartProvider>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}