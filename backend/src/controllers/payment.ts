import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
    const { amount } = req.body;

    if (!amount) return next(new ErrorHandler("Amount Not Found", 400));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: 'inr'
    });

    res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});

export const newCoupon = TryCatch(async (req, res, next) => {
    const { code, amount } = req.body;

    if (!code || !amount) return next(new ErrorHandler("Coupon code and amount are required", 400));

    await Coupon.create({ code, amount });

    return res.status(201).json({
        success: true,
        message: `Coupon ${code} created successfully`
    });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;

    if (!coupon) {
        return res.status(200).json({
            success: true,
            discount: 0,
        });
    }

    const discount = await Coupon.findOne({ code: coupon });

    if (!discount) {
        return next(new ErrorHandler("Invalid coupon code", 400));
    }

    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

    return res.status(200).json({
        success: true,
        message: "Coupon has been deleted",
    });
});

export const allCoupon = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find();

    return res.status(200).json({
        success: true,
        coupons,
    });
});