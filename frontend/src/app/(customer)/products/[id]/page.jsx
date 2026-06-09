
import api from "@/services/api";
import ProductDetails from "@/components/ProductDetails";
import Link from "next/link";


export default async function ProductDetailsPage({ params }) {
  const { id } = await params;

  try {
    const response = await api.get(`/products/${id}`);
    const product = response.data.product || response.product;

    if (!product) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              Product not found
            </h2>
            <p className="text-gray-500 mt-2">
              The product you're looking for doesn't exist.
            </p>
          </div>
        </div>
      );
    }

    let relatedProducts = [];
    try {
      const relatedRes = await api.get(
        `/products/category/${encodeURIComponent(product.category)}`,
      );
      const all = relatedRes.data.products || relatedRes.products || [];
      relatedProducts = all
        .filter((p) => String(p.id) !== String(id))
        .slice(0, 10);
    } catch {
      
    }

    const getThumb = (images) => {
      const first = images?.[0];
      if (!first) return null;
      return typeof first === "string" ? first : first?.url || null;
    };

    return (
      <>
        <ProductDetails product={product} />

        {relatedProducts.length > 0 && (
          <section
            style={{
              maxWidth: "80rem",
              margin: "0 auto",
              padding: "0 1.25rem 4rem",
            }}
          >
            <style>{`
      .related-card {
        flex-shrink: 0;
        width: 160px;
        border-radius: 1rem;
        overflow: hidden;
        background: var(--cream);
        border: 1px solid var(--border);
        box-shadow: 0 4px 20px oklch(0.18 0.02 80 / 0.08);
        transition: transform 0.35s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.35s;
        text-decoration: none;
        display: flex;
        flex-direction: column;
      }
      .related-card:hover {
        transform: scale(1.07) translateY(-4px);
        box-shadow: 0 16px 36px oklch(0.18 0.02 80 / 0.18), 0 0 0 2px var(--mustard);
      }
      .related-img-wrap {
        width: 100%; height: 130px;
        background: oklch(0.97 0.03 95);
        display: flex; align-items: center; justify-content: center; overflow: hidden;
      }
      .related-img-wrap img {
        width: 100%; height: 130px; object-fit: contain; display: block;
        transition: transform 0.35s cubic-bezier(0.2,0.8,0.2,1);
      }
      .related-card:hover .related-img-wrap img { transform: scale(1.08); }
      .related-name {
        font-size: 0.78rem; font-weight: 700; color: var(--ink);
        font-family: var(--font-sans); line-height: 1.3;
        display: -webkit-box; -webkit-line-clamp: 2;
        -webkit-box-orient: vertical; overflow: hidden;
      }
      .related-price {
        font-size: 0.8rem; font-weight: 900; color: var(--ink);
        font-family: var(--font-sans); margin-top: auto; padding-top: 0.3rem;
      }

      /* Custom slim scrollbar */
      .related-scroll {
        overflow: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--mustard) var(--butter);
      }
      .related-scroll::-webkit-scrollbar {
        height: 5px;
      }
      .related-scroll::-webkit-scrollbar-track {
        background: var(--butter);
        border-radius: 99px;
      }
      .related-scroll::-webkit-scrollbar-thumb {
        background: var(--mustard);
        border-radius: 99px;
      }
      .related-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--ink);
      }

      /* Auto-scroll animation */
      @keyframes relatedScroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .related-track {
        display: flex;
        gap: 1rem;
        width: max-content;
        animation: relatedScroll 30s linear infinite;
      }
      .related-scroll:hover .related-track,
      .related-scroll:active .related-track {
        animation-play-state: paused;
      }
    `}</style>

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "oklch(0.55 0.04 80)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                More in
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  color: "var(--ink)",
                  lineHeight: 1.15,
                }}
              >
                {product.category}
              </h2>
            </div>

            
            <div
              className="related-scroll"
              style={{ paddingBottom: "0.75rem", overflow: "hidden" }}
            >
              
              <div className="related-track">
                {[...relatedProducts, ...relatedProducts].map((rel, i) => {
                  const thumb = getThumb(rel.images);
                  return (
                    <Link
                      key={`${rel.id}-${i}`}
                      href={`/products/${rel.id}`}
                      className="related-card"
                    >
                      <div className="related-img-wrap">
                        {thumb ? (
                          <img src={thumb} alt={rel.name} />
                        ) : (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "oklch(0.6 0.03 80)",
                            }}
                          >
                            No image
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          padding: "0.6rem 0.75rem 0.75rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.2rem",
                          flex: 1,
                        }}
                      >
                        <p className="related-name">{rel.name}</p>
                        <p className="related-price">
                          ৳ {parseFloat(rel.price).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Error loading product
          </h2>
          <p className="text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
}
