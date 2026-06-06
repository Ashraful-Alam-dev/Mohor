// src/components/ProductDetails.jsx
"use client";

import { useState } from "react";

export default function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || product.images?.[0] || null
  );

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    return image?.url || null;
  };

  // Get all image URLs
  const imageUrls = product.images?.map(img => getImageUrl(img)) || [];

  return (
    <section className="max-w-7xl mx-auto px-5 py-10">
      <div className="grid lg:grid-cols-2 gap-10">

        {/* Gallery */}
        <div>
          <div className="border rounded-2xl overflow-hidden bg-gray-100">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {imageUrls.length > 0 && (
            <div className="flex gap-3 mt-4 overflow-auto">
              {imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`
                    border rounded-lg overflow-hidden flex-shrink-0
                    ${selectedImage === image
                      ? "border-black ring-2 ring-black"
                      : "border-gray-200"}
                  `}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-500">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="text-3xl font-bold mt-5">
            ৳ {product.price}
          </p>

          <p className="mt-3 text-gray-500">
            Available: {product.quantity} {product.quantity === 1 ? 'piece' : 'pieces'}
          </p>

          <p className="mt-8 leading-7 text-gray-600">
            {product.description || "No description available."}
          </p>

          <button
            disabled={product.quantity === 0}
            className={`
              mt-10 px-8 py-3 rounded-xl font-semibold transition
              ${product.quantity > 0 
                ? "bg-black text-white hover:opacity-90 cursor-pointer" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}
            `}
          >
            {product.quantity > 0 ? "Add To Cart" : "Out of Stock"}
          </button>

          <button
            disabled={product.quantity === 0}
            className={`
              mt-10 px-8 py-3 rounded-xl font-semibold transition
              ${product.quantity > 0 
                ? "bg-black text-white hover:opacity-90 cursor-pointer" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"}
            `}
          >
            Order
          </button>
        </div>

      </div>
    </section>
  );
}