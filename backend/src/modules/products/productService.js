import pool from '../../config/db.js';
import cloudinary from '../../config/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import streamifier from 'streamifier';

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mohor_products',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const createProduct = async ({
  name,
  description,
  price,
  quantity,
  category,
  files,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const productId = uuidv4();

    await connection.execute(
      `
      INSERT INTO products
      (id, name, description, price, quantity, category)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [productId, name, description, price, quantity, category]
    );

    if (files?.length) {
      for (const file of files) {
        const uploadResult = await uploadBufferToCloudinary(file.buffer);
        console.log("Cloudinary URL:", uploadResult.secure_url);
        await connection.execute(
          `
          INSERT INTO product_images
          (id, product_id, url)
          VALUES (?, ?, ?)
          `,
          [
            uuidv4(),
            productId,
            uploadResult.secure_url,
          ]
        );
      }
    }

    await connection.commit();

    return {
      id: productId,
      name,
      description,
      price,
      quantity,
      category,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getAllProducts = async () => {
  const query = `
    SELECT p.*,
           COALESCE(
             JSON_ARRAYAGG(
               IF(
                 pi.id IS NOT NULL,
                 JSON_OBJECT(
                   'id', pi.id,
                   'url', pi.url
                 ),
                 NULL
               )
             ),
             JSON_ARRAY()
           ) AS images
    FROM products p
    LEFT JOIN product_images pi
      ON p.id = pi.product_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  const [rows] = await pool.execute(query);

  return rows.map((row) => ({
    ...row,
    images: Array.isArray(row.images)
      ? row.images.filter(Boolean)
      : JSON.parse(row.images || '[]').filter(Boolean),
  }));
};

export const getProductById = async (id) => {
  const [products] = await pool.execute(
    `SELECT * FROM products WHERE id = ?`,
    [id]
  );

  if (!products.length) return null;

  const [images] = await pool.execute(
    `SELECT id, url FROM product_images WHERE product_id = ?`,
    [id]
  );

  return {
    ...products[0],
    images,
  };
};

export const searchProducts = async (searchTerm) => {
  const query = `
    SELECT p.*,
           COALESCE(
             JSON_ARRAYAGG(
               IF(
                 pi.id IS NOT NULL,
                 JSON_OBJECT(
                   'id', pi.id,
                   'url', pi.url
                 ),
                 NULL
               )
             ),
             JSON_ARRAY()
           ) AS images
    FROM products p
    LEFT JOIN product_images pi
      ON p.id = pi.product_id
    WHERE
      p.name LIKE ?
      OR p.description LIKE ?
      OR p.category LIKE ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  const keyword = `%${searchTerm}%`;

  const [rows] = await pool.execute(query, [
    keyword,
    keyword,
    keyword,
  ]);

  return rows.map((row) => ({
    ...row,
    images: Array.isArray(row.images)
      ? row.images.filter(Boolean)
      : JSON.parse(row.images || '[]').filter(Boolean),
  }));
};

export const getProductsByCategory = async (category) => {
  const query = `
    SELECT p.*,
           COALESCE(
             JSON_ARRAYAGG(
               IF(
                 pi.id IS NOT NULL,
                 JSON_OBJECT(
                   'id', pi.id,
                   'url', pi.url
                 ),
                 NULL
               )
             ),
             JSON_ARRAY()
           ) AS images
    FROM products p
    LEFT JOIN product_images pi
      ON p.id = pi.product_id
    WHERE p.category = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  const [rows] = await pool.execute(query, [category]);

  return rows.map((row) => ({
    ...row,
    images: Array.isArray(row.images)
      ? row.images.filter(Boolean)
      : JSON.parse(row.images || '[]').filter(Boolean),
  }));
};

export const getCategories = async () => {
  const [rows] = await pool.execute(`
    SELECT DISTINCT category
    FROM products
    WHERE category IS NOT NULL
    ORDER BY category
  `);

  return rows.map((row) => row.category);
};

export const updateProduct = async (
  id,
  { name, description, price, quantity, category }
) => {
  const [result] = await pool.execute(
    `
    UPDATE products
    SET
      name = ?,
      description = ?,
      price = ?,
      quantity = ?,
      category = ?
    WHERE id = ?
    `,
    [name, description, price, quantity, category, id]
  );

  return result.affectedRows > 0;
};

export const deleteProduct = async (id) => {
  const [images] = await pool.execute(
    `SELECT url FROM product_images WHERE product_id = ?`,
    [id]
  );

  for (const image of images) {
    try {
      const url = image.url;

      const publicId = url
        .split('/upload/')[1]
        .split('.')[0];

      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error(
        'Cloudinary delete failed:',
        err.message
      );
    }
  }

  const [result] = await pool.execute(
    `DELETE FROM products WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};