import mongoose from "mongoose";
import { InvalidCacheProps, OrderListType } from "../types/types.js";
import { Products } from "../models/product.js";
import { myCache } from "../app.js";
import ErrorHandler from "./utility-class.js";
import { Order } from "../models/order.js";

export const connectDB = (url:string) =>{
    mongoose
    .connect(url,{
        dbName: "Ecommerce",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({product,order,admin,userId,orderId,productId}:InvalidCacheProps)=>{

    if(product){
        const productKey: string[] = ["category", "latestProduct", "admin-products"];

        if(typeof productId === "string")productKey.push(`product-${productId}`);
        if(typeof productId === "object") productKey.forEach((i)=> productKey.push(`product-${i}`))
        myCache.del(productKey);
    }

    if(order){
        const orderKey:string[] = ["allOrder",`my-orders-${userId}` , `order-${orderId}`];

         
        myCache.del(orderKey);
    }
    if(admin){

    }

}

export const reduceStock = async(orderList :OrderListType[]) =>{
    for (let i = 0; i < orderList.length; i++) {
        const order = orderList[i];
        let product = await Products.findById(order.productID);
        if(!product) throw new ErrorHandler("Product not found",404);

        product.stock -= order.quantity;

       await product.save();
        
    }
}