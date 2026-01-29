const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        couponCode,
    } = req.body;

    const orderExist = await Order.findOne({ paymentInfo });

    if (orderExist) {
        return next(new ErrorHandler("Order Already Placed", 400));
    }

    let couponData = null;
    let discountAmount = 0;

    // If coupon code is provided, apply it
    if (couponCode) {
        const Coupon = require('../models/couponModel');
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (!coupon) {
            return next(new ErrorHandler("Invalid coupon code", 404));
        }

        // Check if coupon is valid
        const validityCheck = coupon.isValid();
        if (!validityCheck.valid) {
            return next(new ErrorHandler(validityCheck.message, 400));
        }

        // Check if user can use this coupon
        const userCheck = coupon.canUserUse(req.user._id);
        if (!userCheck.canUse) {
            return next(new ErrorHandler(userCheck.message, 400));
        }

        // Check minimum purchase amount
        if (totalPrice < coupon.minPurchaseAmount) {
            return next(
                new ErrorHandler(
                    `Minimum purchase amount of ₹${coupon.minPurchaseAmount} required`,
                    400
                )
            );
        }

        // Calculate discount
        discountAmount = coupon.calculateDiscount(totalPrice);

        // Track usage
        coupon.usedBy.push({
            user: req.user._id,
            usedAt: new Date(),
            orderAmount: totalPrice
        });

        // Increment usage count
        coupon.usageCount += 1;
        await coupon.save();

        couponData = {
            couponUsed: coupon._id,
            couponCode: coupon.code,
            discountAmount: discountAmount
        };
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice,
        ...couponData,
        paidAt: Date.now(),
        user: req.user._id,
    });

    await sendEmail({
        email: req.user.email,
        templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
        data: {
            name: req.user.name,
            shippingInfo,
            orderItems,
            totalPrice,
            discountAmount,
            finalAmount: totalPrice - discountAmount,
            oid: order._id,
        }
    });

    res.status(201).json({
        success: true,
        order,
    });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id }).populate("user", "name email");

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
});


// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find().populate("user", "name email");

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Already Delivered", 400));
    }

    if (req.body.status === "Shipped") {
        order.shippedAt = Date.now();
        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity)
        });
    }

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
    });
});