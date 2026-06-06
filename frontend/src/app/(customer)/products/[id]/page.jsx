// src/app/(customer)/products/[id]/page.jsx
import api from "@/services/api";
import ProductDetails from "@/components/ProductDetails";

// This is a Server Component - no "use client" needed
export default async function ProductDetailsPage({ params }) {
  // Unwrap params Promise (required in Next.js 15+)
  const { id } = await params;
  
  try {
    const response = await api.get(`/products/${id}`);
    const product = response.data.product || response.product;

    if (!product) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
            <p className="text-gray-500 mt-2">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      );
    }

    return <ProductDetails product={product} />;
    
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Error loading product</h2>
          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
}