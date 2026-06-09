import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/authRoutes.js';
import productRoutes from './modules/products/productRoutes.js';
import cartRoutes from './modules/cart/cartRoutes.js';
import orderRoutes from './modules/order/orderRoutes.js';
const app = express();
app.use(cors());
app.use(express.json());app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit : '50mb', extended: true }));
app.get('/', (req, res) => {
  res.send('Mohor API is running smoothly...');
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

export default app;