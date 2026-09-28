import express from 'express';
import connectDB from '../config/db.js';
import authRouter from '../routes/auth.route.js';
import cookieParser from 'cookie-parser';
import productsRouter from '../routes/products.route.js';
//create express app
const app = express();
//db connection
await connectDB();
//middlewares
//parse json data
app.use(express.json());
//cookie parser middleware
app.use(cookieParser());
//auth routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

export default app;
