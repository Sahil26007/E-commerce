import { TryCatch } from "../middlewares/error.js";
import {Request , Response ,NextFunction} from "express";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import ErrorHandler from "../utils/utility-class.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { myCache } from "../app.js";



export const myOrder = TryCatch( async(req,res,next)=>{
 
    const {id:user} = req.query;
    const key = `my-orders-${user}`;
    let orders = [];

    if(myCache.has(key))orders = JSON.parse(myCache.get(key) as string);
    else{
        orders = await Order.find({user});
        myCache.set(key, JSON.stringify(orders));
    }

    return res.status(200).json({
        success:true,
        orders
    })
})

export const allOrder = TryCatch( async(req,res,next)=>{
    const key = "all-orders";

    let orders = [];

    if(myCache.has(key))orders= JSON.parse(myCache.get(key) as string);
    else{
        orders = await Order.find().populate("user","name");
        myCache.set(key,JSON.stringify(orders));
    }

    return res.status(200).json({
        success: true,
        orders,
    })
})


export const gertSingleOrder = TryCatch( async(req,res,next) =>{

    const {id} = req.params;
    const key = `order-${id}`;
    
    let order;

    if(myCache.has(key)){
        order = JSON.parse(myCache.get(key) as string);
    }
    else {
        order = await Order.findById(id).populate("user","name");

        if(!order) return next(new ErrorHandler("Order not found",404));

        myCache.set(key,JSON.stringify(order));
    }


    return res.status(200).json({
        success:true,
        order,
    })
})




export const newOrder = TryCatch( async(
    req:Request<{},{},NewOrderRequestBody>, 
    res: Response, 
    next: NextFunction,
    )=>{

    const {
        shippingInfo,
        orderList,
        user,
        tax,
        amount,
        shippingCharge,
        subtotal,
        discount,
    } = req.body;


    if(
        !shippingInfo ||   
        !orderList ||
        !user ||
        !tax||
        !subtotal ||
        !amount
      ) return next(new ErrorHandler("Please Enter All Fields",400));

    const order = await Order.create({
        shippingInfo,
        orderList,
        user,
        tax,
        amount,
        shippingCharge,
        subtotal,
        discount,
    })

    await reduceStock(orderList);

    await invalidateCache({
        product :true,
        admin: true,
        order:true,
        userId:user,
        productId: order.orderList.map((i)=> String(i.productId)),
    })

    return res.status(201).json({
        success:true,
        message:"Order Created Successfully"
    });
})

export const processOrder = TryCatch( async(req,res,next) =>{
    const {id} = req.params;
    
    const order =  await Order.findById(id);

    if(!order) return next(new ErrorHandler("Order Not Found",404));

    switch(order.status){
        case "Processing":
        order.status = "Shipped";
        break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }

    await order.save();

    await invalidateCache({
        product:false , 
        order:true , 
        admin: true ,
        userId:order.user ,
        orderId: String(order._id)
    });

    return  res.status(200).json({
        success:true,
        message:"Order Processed Succesfully",
    })
})

export const deleteOrder = TryCatch( async(req,res,next)=>{
    const {id} = req.params;
    const order = await Order.findById(id);

    if(!order) return next(new ErrorHandler("Order not found",404));

    await order.deleteOne();

    await invalidateCache({product:false , order:true , admin:true , userId:order.user , orderId:String(order._id)});

    return res.status(200).json({
        success:true,
        message:"Order deleted Successfully",
    })
})