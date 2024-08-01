import { Order, pie, Product, Stats, User, bar, cartItems, line, shippingInfo, Coupon } from "./types";

export type messageResponse = {
    success : boolean,
    message : string
};

export type userResponse ={
    success:boolean,
    user : User;
}

export type allUserResponse ={
    success:boolean,
    user : User[];
}

export type categoryResponse ={
    success:boolean,
    categories : string[], 
}

export type allProductResponse={
    products: any;
    success:boolean,
    product : Product[],
}

export type allCouponResponse={
    success:boolean,
    coupons : Coupon[],
}

export type productDetailsResponse ={
    success :boolean,
    product : Product ,
}


export type StatsResponse ={
    success :boolean,
    stats : Stats ,
}

export type PieResponse ={
    success :boolean,
    charts : pie ,
}

export type LineResponse ={
    success :boolean,
    charts : line,
}

export type BarResponse ={
    success :boolean,
    charts : bar,
}


export type customError = {
    status : number,
    data :{
        message:string,
        success:boolean,
    }
}

export  type searchProductResponse = {
    success:boolean,
    products : Product[],
    totalPage : number,
}

export type searchProductRequest ={
    price:number,
    page:number,
    search:string,
    category:string,
    sort:string,
}

export type createProductsRequest = {
    id :string,
    formData : FormData,
}


export type createCouponRequest = {
    id :string,
    formData: {
        code: string;
        amount: number;
    };
}

export type updateProductRequest = {
    userid :string,
    productid : string,
    formData : FormData,
}
export type deleteProductRequest = {
    userid :string,
    productid : string,
}

export type deleteCouponRequest = {
    userId :string,
    couponId : string,
}

export type newOrderRequest = {
    shippingInfo : shippingInfo,
    orderList : cartItems[],
    user :string,
    tax : number,
    total : number,
    shippingCharge : number,
    subtotal: number,
    discount : number,
}

export type deleteUserRequest ={
    userId : string;
    adminUserId: string;
}

export type updateOrderRequest = {
    orderId : string,
    userId : string,
}

export type allorderResponse = {
    success : boolean,
    orders : Order[],
}

export type OrderDetailResponse = {
     success : boolean,
     order : Order,
}