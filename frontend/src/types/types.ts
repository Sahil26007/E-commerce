export type User = {
    name :string ;
    email :string ;
    photo :string ;
    dob :string ;
    gender : string;
    role :string;
    _id :string;
}

export type Product = {
    name:string;
    photo:string;
    category:string;
    price:number;
    _id:string;
    stock:number;
}
export type Coupon = {
    code: string;
    amount: number;
    _id:string;
}

export type shippingInfo ={
    address :string;
    city:string;
    state:String;
    country:String;
    pincode: string;
}

export type cartItems ={
    productId :string;
    photo :string;
    name :string;
    quantity : number;
    price :number;
    stock:number;
}

export type orderList = Omit<cartItems,"stock"> & {_id : string}

export type Order = {
    orderList : orderList[];
    shippingInfo : shippingInfo;
    subtotal :number;
    amount :number;
    tax:number;
    shippingCharges:number;
    discount:number;
    status:string;
    user : {
        name : string;
        _id : string;
    }
    _id : string;
}

type CountAndChange = {
    revenue :number;
    product : number;
    order : number;
    user: number;
}

type latestTransaction = {
    _id : string;
    discount : number;
    amount : number;
    status : string;
    quantity : number;
}

export type Stats = {
    categoryCount: Record<string,number>[],
    percentageChange: CountAndChange,
    count: CountAndChange,
    chart:{
        order: number[],
        revenue: number[],
    },
    userRatio:{
        male: number;
        female: number;
    },
    latestTransaction: latestTransaction[],
}

export type pie = {
        orderFullfillment: {
            processing: number;
            shipped: number;
            delivered: number;
        },
        productCategories: Record<string, number>[],
        stockAvailability: {
            inStock: number;
            outOfStock: number;
        },
        revenueDistribution: {
            netMargin: number;
            discount: number;
            productionCost: number; 
            burnt: number;
            marketingCost: number;
        },
        ageDistribution: {
            teen: number;
            adult: number;
            old: number;
        },
        adminCustomer: {
            admin: number;
            customer: number;
        },
}

export type line = {
    user: number[],
    product : number[],
    discount: number[],
    revenue: number[]
}

export type bar = {
    user:number[],
    product:number[],
    order:number[]
}