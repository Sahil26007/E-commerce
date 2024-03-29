import  express  from "express";
import { allCoupon, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();


//route -/api/v1/payment/discount
app.get("/discount",applyDiscount);


app.post("/create",createPaymentIntent);
//route - /api/v1/payment/coupon/new
app.post("/coupon/new",adminOnly,newCoupon);

//route - /api/v1/payment/coupon/:id
app.delete("/coupon/:id",adminOnly,deleteCoupon);

//route - /api/v1/payment/coupons/all
app.get("/coupon/all",adminOnly,allCoupon);

export default app;