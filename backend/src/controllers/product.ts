import { NextFunction, Request ,Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { Products } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { json } from "stream/consumers";
import { invalidateCache } from "../utils/features.js";


// using cache memory for performance improvement 
export const getLatestProduct = TryCatch( async(
    req, res, next
)=>{

    let product;

    if(myCache.has("latestProduct"))
        product = JSON.parse(myCache.get("latestProduct") as string) ; 

    else{
        product = await Products.find({}).sort({createdAt:-1}).limit(5);
        myCache.set("latestProduct",JSON.stringify(product))
    }


    return res.status(200).json({
        success: true,
        product,
    })
})

//get all unique categories
export const getAllCategories = TryCatch( async(req,res,next)=>{

    let categories;

    if(myCache.has("category"))
     categories = JSON.parse(myCache.get("category") as string);

    else{
        categories = await Products.distinct("category");
        myCache.set("category",JSON.stringify(categories));
    }

    return res.status(200).json({
        success:true,
        categories,
    });
});

export const getAdminProducts = TryCatch( async(req,res,next )=>{

    let products;

    if(myCache.has("admin-products")){
        products = JSON.parse(myCache.get("admin-products") as string);
    }
    else{
        products = await Products.find({});     
        myCache.set("admin-products",JSON.stringify(products));
    }

    return res.status(200).json({
        success :true,
        products,
    })
})

export const getSingleProduct = TryCatch( async(req,res,next)=>{
    let product;
    const id = req.params.id;

    if(myCache.has(`product-${id}`)){
        product = JSON.parse(myCache.get(`product-${id}`) as string);
    }
    else{
        product = await Products.findById(id);
        if(!product) return next( new ErrorHandler("Product not Found",404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
        success : true,
        product,
    })
});


// invalidate cache
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

    await invalidateCache({product: true , admin:true});

    return res.status(201).json({
        success : true,
        message : "Product created successfully"
    })
});

export const uploadProduct = TryCatch( async(req,res,next)=>{
    const id = req.params.id;
    const {name ,category,price,stock} = req.body;
    const photo = req.file;
    const product = await Products.findById(id);

    if(!product) return next(new ErrorHandler("Invalid Product",404));

    if(photo){
        rm(product.photo!,()=>{
            console.log('Photo Removed');
        })
        product.photo = photo.path
    }

    if(name)product.name = name;
    if(category)product.category= category;
    if(price)product.price = price;
    if(stock)product.stock = stock;

    product.save();
    await invalidateCache({product: true,productId:String(product._id),admin:true});

    return res.status(200).json({
        success : true,
        message : "Product updated successfully "
    })
})

export const deleteProduct = TryCatch( async(req, res, next)=>{
    const prodId = req.params.id;
    const product = await Products.findById(prodId);

    if(!product) return next(new ErrorHandler("Invalid Product",404));

    rm(product.photo,()=>{
        console.log("Photo Removed");
    });

    await product.deleteOne();
    await invalidateCache({product: true,productId:String(product._id),admin:true});
     
    // await invalidateCache({product: true});

    return res.status(200).json({
        success:true,
        message : "product remove successfully"
    })
        
})


export const SearchProduct = TryCatch( async(
    req:Request<{},{},{},SearchRequestQuery>,
    res,
    next
    )=>{

        const {search,category,price,sort} = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(process.env.Product_PER_Page) || 8 ;
        const skip = (page-1)*limit;

        const baseQuery:BaseQuery = {};

        if(search){
            baseQuery.name = {
                $regex : search,   // search uppercase and lowercase both words
                $options : "i",    // case insensitive
            }
        }
        if(price){
            baseQuery.price = {
                $lte : Number(price) // less than equal to
            }
        }

        if(category) baseQuery.category = category;

        const filProducts = Products.find(baseQuery)
                            .sort( sort && {price:sort === "asc"? 1:-1} )
                            .limit(limit)
                            .skip(skip);

        const [products,filteredProducts] = await Promise.all([
            filProducts, Products.find(baseQuery)
        ])

        const totalPage = Math.ceil(filteredProducts.length/limit);

        return res.status(200).json({
            success :true,
            products,
            totalPage
        });
})