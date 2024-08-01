import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { OrderDetailResponse, allorderResponse, messageResponse, newOrderRequest, updateOrderRequest } from "../../types/api-types";


export const orderApi = createApi({
    reducerPath : "orderApi",
    baseQuery :fetchBaseQuery({
        baseUrl :  `${import.meta.env.VITE_SERVER}/api/v1/order/`,
    }),
    tagTypes : ["orders"],
    endpoints : (builder) => ({
        newOrder : builder.mutation<messageResponse,newOrderRequest>({
            query : (order) => ({
                url : "new",
                method : "POST",
                body : order
            }),
            invalidatesTags:["orders"],
        }),
        updateOrder : builder.mutation<messageResponse,updateOrderRequest>({
            query : ({userId , orderId}) => ({
                url : `${userId}?id=${orderId}`,
                method : "PUT"
            }),
            invalidatesTags :["orders"],
        }),
        deleteOrder : builder.mutation<messageResponse,updateOrderRequest>({
            query : ({userId , orderId}) => ({
                url : `${userId}?id=${orderId}`,
                method : "DELETE"
            }),
            invalidatesTags :["orders"],
        }),

        myOrder : builder.query<allorderResponse,string>({
            query : (id)=> `my?id=${id}`,
            providesTags : ['orders'],
        }),
        allOrder : builder.query<allorderResponse,string>({
            query : (id)=> `all?id=${id}`,
            providesTags : ['orders'],
        }),
        OrderDetail : builder.query<OrderDetailResponse,string>({
            query : (id)=> id,
            providesTags : ['orders'],
        }),
    }),
});

export const { useNewOrderMutation ,useDeleteOrderMutation , useUpdateOrderMutation, useAllOrderQuery , useMyOrderQuery , useOrderDetailQuery} = orderApi;