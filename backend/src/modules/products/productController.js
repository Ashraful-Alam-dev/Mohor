import * as productService from './productService.js';
import * as auditService from '../audit/auditService.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !price || quantity === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing core product specifications data.',
      });
    }

    const product = await productService.createProduct({
      name,
      description,
      price,
      quantity,
      category,
      files: req.files,
    });

    await auditService.logProductCreated(
      product,
      req.user?.id || null
    );

    res.status(201).json({
      success: true,
      message: 'Product successfully saved to server.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Requested product profile missing.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    const products = await productService.searchProducts(q || '');

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await productService.getProductsByCategory(
        req.params.category
      );

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories =
      await productService.getCategories();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const oldProduct =
      await productService.getProductById(
        req.params.id
      );

    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message:
          'Target drop-update model parameters not found.',
      });
    }

    const success =
      await productService.updateProduct(
        req.params.id,
        req.body
      );

    if (!success) {
      return res.status(404).json({
        success: false,
        message:
          'Target drop-update model parameters not found.',
      });
    }

    await auditService.logProductUpdated(
      oldProduct,
      req.body,
      req.user?.id || null
    );

    res.status(200).json({
      success: true,
      message:
        'Product parameters successfully synced.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product =
      await productService.getProductById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          'Target drop inventory item missing.',
      });
    }

    const success =
      await productService.deleteProduct(
        req.params.id
      );

    if (!success) {
      return res.status(404).json({
        success: false,
        message:
          'Target drop inventory item missing.',
      });
    }

    await auditService.logProductDeleted(
      product,
      req.user?.id || null
    );

    res.status(200).json({
      success: true,
      message:
        'Product permanently scrubbed from system.',
    });
  } catch (error) {
    next(error);
  }
};