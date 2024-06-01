import { User, cartItems, shippingInfo } from "./types";

export  interface userReducerInitialTypes {
    user:User | null;
    loading : boolean;
} 

export interface cartReducerInitialTypes {
    loading : boolean;
    cartItems : cartItems[];
    subtotal : number;
    tax : number;
    shippingCharge : number;
    discount : number;
    total :number;
    shippingInfo : shippingInfo;
}