import mongoose from "mongoose";

const schema = new mongoose.Schema({
    shippingInfo : {
        address :{
            type : String,
            required : [true," address is required"],
        },
        city:{
            type :String,
            required : true,
        },
        state:{
            type :String,
            required : true,
        },
        country:{
            type :String,
            required : true,
        },
        pincode:{
            type : Number,
            required : true,
        }
    },
    user:{
        type: String,
        ref : "User",
        required : true,
    },
    subtotal:{
        type : Number,
        required : true,
    },
    tax:{
        type : Number,
        required : true,
    },
    shippingCharge:{
        type : Number,
        required : true,
        default : 0,
    },
    discount:{
        type : Number,
        required : true,
        default : 0,
    },
    total:{
        type : Number,
        required : true,
    },
    status:{
        type : String,
        enum : ["Processing","Shipped","Delivered"],
        default: "Processing",
    },

    orderList : [{
        name:{
            type : String,
            required : true,
        },
        photo:{
            type: String,
            required : true,
        },
        quantity:{
            type : Number,
            required : true,
        } ,
        price:{
            type: Number,
            required : true,
        },
        productId:{
            type : mongoose.Types.ObjectId,
            ref : "Product",
        }
    }]

},{
    timestamps : true,
})

export const Order = mongoose.model('Order',schema);