import mongoose from "mongoose";
import { InvalidCacheProps } from "../types/types.js";
import { Products } from "../models/product.js";
import { myCache } from "../app.js";

export const connectDB = () =>{
    mongoose
    .connect("mongodb+srv://Sahil007:Sahil007@sahil.wbfwnap.mongodb.net/",{
        dbName: "Ecommerce",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = async ({product,order,admin}:InvalidCacheProps)=>{

    if(product){
        const productKey: string[] = ["category", "latestProduct", "admin-products"];

        const product = await Products.find({}).select("_id");

        product.forEach( i => {
            productKey.push(`product-${i._id}`);
        });

        myCache.del(productKey);
    }

    if(order){

    }
    if(admin){

    }

}