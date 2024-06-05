import mongoose, { Document } from "mongoose";
import { InvalidCacheProps, OrderListType } from "../types/types.js";
import { Products } from "../models/product.js";
import { myCache } from "../app.js";


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
        myCache.del(["admin-stats","admin-line-charts","admin-bar-charts","admin-pie-chart"]);
    }

}

export const reduceStock = async(orderList :OrderListType[]) =>{
    for (let i = 0; i < orderList.length; i++) {
        const order = orderList[i];
        let product = await Products.findById(order.productID);
        if(!product) throw new Error("Product not found");

        product.stock -= order.quantity;

       await product.save();
        
    }
};

export const calculatePercentage = (thisMonth:number , lastMonth : number) =>{
    if(lastMonth === 0) return thisMonth*100;

    const percent = ((thisMonth )/lastMonth) *100;

    return Number(percent.toFixed(0));
};


export const getInventories = async(
    {categories,productsCount}: 
    {
    categories:string[],
    productsCount:number,
}) =>{
    const categoriesCountPromise = categories.map((category) =>
    Products.countDocuments({category})
    );
    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount : Record<string , number>[] = [];

    categories.forEach((category, index )=>{
        categoryCount.push({
            [category]: Math.round((categoriesCount[index] / productsCount)*100),
    });
});

    return categoryCount;
}

interface MyDocument extends Document{
    createdAt : Date;
    discount? : number;
    amount? : number;
}

type FuncProps = {
    length: number;
    docArr: MyDocument[];
    property?: "discount" | "amount";
    today: Date;
  };

export const func1 = ({length,docArr,property,today}: FuncProps) =>{

            const data :number[] = new Array(length).fill(0);

            docArr.forEach((i) =>{
                const creationDate = i.createdAt;

                const monthDiff = (today.getMonth() - creationDate.getMonth()+12)%12;

                if(monthDiff < length){
                    if(property){
                        data[length - monthDiff - 1] += i[property]!;
                    }else
                    data[length - monthDiff - 1] += 1;
                }
            })

            return data;
}