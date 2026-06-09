"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function InventoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    images: [],
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "admin") {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      loadProducts();
    }
  }, [isAuthenticated, user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      images: [],
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category: product.category || "",
      images: [],
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
    
    e.target.value = '';
  };

  const removeFile = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const getToken = () => {
    return localStorage.getItem('mohor_token');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    
    if (!token) {
      alert('Please login to add products');
      router.push("/login");
      return;
    }

    try {
      if (editingProduct) {
        const updateData = {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          category: form.category,
        };

        console.log("Updating product:", editingProduct.id, updateData);
        
        await api.put(`/products/${editingProduct.id}`, updateData, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", parseFloat(form.price));
        formData.append("quantity", parseInt(form.quantity));
        formData.append("category", form.category);

        form.images.forEach((file) => {
          formData.append("images", file);
        });

        console.log("Creating new product with", form.images.length, "images");
        
        await api.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      console.error("Error details:", err.response?.data);
      alert(`Failed to save product: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this product?");

    if (!confirm) return;

    const token = getToken();
    
    try {
      await api.delete(`/products/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      loadProducts();
    } catch (err) {
      console.log(err);
      if (err.response?.status === 403) {
        alert('You don\'t have permission to delete products.');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="p-6 min-h-screen bg-neutral-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">Inventory Management</h1>

        <button
          onClick={openAddModal}
          className="bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-800 transition"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <img
                    src={p.images?.[0]?.url || "/placeholder.png"}
                    className="w-12 h-12 object-cover rounded-lg border"
                    alt={p.name}
                  />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 font-bold text-neutral-800">
                  {p.price} ৳ 
                </td>
                <td className="p-3">{p.quantity} Pcs</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-2.5 rounded-xl focus:outline-none focus:border-emerald-600"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={3}
                className="w-full border p-2.5 rounded-xl focus:outline-none focus:border-emerald-600"
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    name="price"
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full border p-2.5 pr-8 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                  <span className="absolute right-3 top-3 text-neutral-400 font-bold text-sm">৳</span>
                </div>

                <input
                  name="quantity"
                  required
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="w-full border p-2.5 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <input
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full border p-2.5 rounded-xl focus:outline-none focus:border-emerald-600"
              />
              
              {!editingProduct && (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="hidden"
                    id="product-images"
                  />

                  <label
                    htmlFor="product-images"
                    className="w-full cursor-pointer border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center hover:bg-emerald-50 transition block"
                  >
                    <div className="text-sm font-medium text-emerald-700">
                      Click to upload product images
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      PNG, JPG, WEBP (multiple allowed - select files one batch at a time)
                    </div>
                  </label>

                  {form.images.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-neutral-50">
                      <div className="text-xs font-medium text-neutral-600">
                        Selected files ({form.images.length}):
                      </div>
                      {form.images.map((file, i) => (
                        <div 
                          key={i} 
                          className="flex justify-between items-center text-xs px-2 py-1.5 bg-white text-neutral-700 rounded-lg border border-neutral-200 shadow-sm"
                        >
                          <span className="truncate flex-1 font-mono">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="ml-2 text-red-600 hover:text-red-800 font-bold px-2 py-1 hover:bg-red-50 rounded transition"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-700">
                    Current Images (cannot be changed):
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {editingProduct.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Product ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Note: Product images cannot be updated. To change images, delete and recreate the product.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-neutral-50 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}