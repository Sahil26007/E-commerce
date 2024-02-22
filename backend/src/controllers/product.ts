import { NextFunction, Request ,Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Products } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(async (
    req:Request<{},{},NewProductRequestBody>,
    res:Response,
    next:NextFunction
    )=>{

    const {name,category , price , stock} = req.body;
    const photo = req.file;

    if(!photo)return next(new ErrorHandler("Please add a photo",400));

    if(!name || !category || !price || !stock){
        rm(photo.path,()=>{
            console.log("Deleted");
        })
        return next(new ErrorHandler("Please add all fields",400));
    }

    await Products.create({
        name,
        price,
        stock,
        category : category.toLowerCase(),
        photo : photo.path,
    })

    return res.status(201).json({
        success : true,
        message : "Product created successfully"
    })
});

export const getLatestProduct = TryCatch( async(
    req, res, next
)=>{

    const product = await Products.find({}).sort({createdAt:-1}).limit(5);
    return res.status(200).json({
        success: true,
        product,
    })
})

//get all unique categories
export const getAllCategories = TryCatch( async(req,res,next)=>{
    const categories = await Products.distinct("category");

    return res.status(200).json({
        success:true,
        categories,
    });
});

export const getAdminProducts = TryCatch( async(req,res,next )=>{
    const products = await Products.find({});   

    return res.status(200).json({
        success :true,
        products,
    })
})

export const getSingleProduct = TryCatch( async(req,res,next)=>{
    const id = req.params.id;
    const product = await Products.findById(id);

    if(!product) return next( new ErrorHandler("Product not Found",404));

    return res.status(200).json({
        success : true,
        product,
    })
});

export const uploadProduct = TryCatch( async(req,res,next)=>{
    const id = req.params.id;
    const {name ,category,price,stock} = req.body;
    const photo = req.file;
    const product = await Products.findById(id);
})