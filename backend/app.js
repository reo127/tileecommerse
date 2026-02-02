const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middlewares/error');

const app = express();

// configver
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'config/config.env' });
}

// CORS Configuration
const cors = require('cors');

// CORS Configuration - Allow all origins for now (can be restricted later)
// Uncomment and update the whitelist if you want to restrict specific domains
/*
const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tiles-ecommerce.vercel.app',
    'https://ecom-fe-xi.vercel.app',
    'https://ecom-fe-17kf.vercel.app',
    'https://tilesecommerse.vercel.app',
    'https://tilesecommerse-*.vercel.app' // Allow all preview deployments
];
*/

app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 // 24 hours
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const coupon = require('./routes/couponRoute');
const category = require('./routes/categoryRoute');
const blog = require('./routes/blogRoute');

app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use('/api/v1', coupon);
app.use('/api/v1', category);
app.use('/api/v1', blog);

// error middleware
app.use(errorMiddleware);

module.exports = app;