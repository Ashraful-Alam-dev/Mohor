import api from "./api";

export const getProducts =
  async () => {
    const res =
      await api.get("/products");

    return res.data.products;
  };

export const getProduct =
  async (id) => {
    const res =
      await api.get(
        `/products/${id}`
      );

    return res.data.product;
  };

export const searchProducts =
  async (keyword) => {
    const res =
      await api.get(
        `/products/search?q=${keyword}`
      );

    return res.data.products;
  };

export const getCategories =
  async () => {
    const res =
      await api.get(
        "/products/categories"
      );

    return res.data.categories;
  };

export const getProductsByCategory =
  async (category) => {
    const res =
      await api.get(
        `/products/category/${category}`
      );

    return res.data.products;
  };

export const createProduct =
  async (formData) => {
    const res =
      await api.post(
        "/products",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
  };

export const updateProduct =
  async (id, data) => {
    const res =
      await api.put(
        `/products/${id}`,
        data
      );

    return res.data;
  };

export const deleteProduct =
  async (id) => {
    const res =
      await api.delete(
        `/products/${id}`
      );

    return res.data;
  };