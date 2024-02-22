import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name : {
        type :String,
        required : [true,"required"],
    },
    photo : {
        type : String,
        required : [true,"required"],
    },
    price : {
        type: Number ,
        required : [true,"required"],
    },
    stock : {
        type :Number ,
        required : [true,"required"],
    },
    category : {
        type : String, 
        required : [true,"required"],
        trim : true,
    }

}, {
    timestamps :true,
}
) 

export const Products = mongoose.model("Product",Schema);