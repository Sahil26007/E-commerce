import mongoose from "mongoose";

const schema = new mongoose.Schema({
    code:{
        type: String,
        required:[true,"required"],
        unique:true,
    },
    amount:{
        type : Number ,
        required:true,
    }
});

export const Coupon = mongoose.model("Coupon", schema);

// 优惠���类型