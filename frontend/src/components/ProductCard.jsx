import Link from "next/link";

export default function ProductCard({ product }) {
  const getFirstImageUrl = () => {
    if (!product.images || product.images.length === 0) {
      return "/placeholder.png"; 
    }
    
    const firstImage = product.images[0];
    return typeof firstImage === 'string' ? firstImage : firstImage.url;
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="border rounded-xl overflow-hidden hover:shadow-lg transition block"
    >
      <img
        src={getFirstImageUrl()}
        alt={product.name}
        className="h-60 w-full object-cover"
      />

      <div className="p-4">
        <p className="text-sm text-gray-500">
          {product.category}
        </p>

        <h3 className="font-semibold line-clamp-2">
          {product.name}
        </h3>

        <p className="font-bold mt-2 text-emerald-600">
          ৳ {product.price}
        </p>

        <p className="text-sm text-gray-500">
          Stock: {product.quantity} {product.quantity === 1 ? 'piece' : 'pieces'}
        </p>
      </div>
    </Link>
  );
}