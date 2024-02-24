import { NextFunction, Request ,Response } from "express";

export interface NewUserRequestBody{
    name : string ;
    email:string;
    photo:string;
    gender:string;
    _id:string;
    dob :Date;
}

export interface NewProductRequestBody{
    name : string ;
    category:string;
    price:Number;
    stock : Number;
}

export type ControllerType = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>


export type SearchRequestQuery = {
    search?:string;
    sort?: string;
    category?:string;
    price?:string;
    page?:string;
}

export interface BaseQuery{
    name?:{
        $regex : string;
        $options: "i";
    },
    price?:{
        $lte: number;
    },
    category?:string;
}

export type InvalidCacheProps = {
    product ?: boolean;
    order?:boolean;
    admin?:boolean;
}