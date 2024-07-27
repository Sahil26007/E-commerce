import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { allCouponResponse, createCouponRequest, deleteCouponRequest, messageResponse } from "../../types/api-types";

export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/`,
    }),
    tagTypes: ["Coupon"],
    endpoints: (builder) => ({
        allCoupons: builder.query<allCouponResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["Coupon"],
        }),
        deleteCoupon: builder.mutation<messageResponse, deleteCouponRequest>({
            query: ({ userId, couponId }) => ({
                url: `${couponId}?id=${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Coupon"],
        }),
        createCoupon: builder.mutation<messageResponse, createCouponRequest>({
            query: ({ id, formData }) => ({
                url: `new?id=${id}`,
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ["Coupon"],
        }),
    }),
});

export const { useAllCouponsQuery, useDeleteCouponMutation, useCreateCouponMutation } = couponApi;
