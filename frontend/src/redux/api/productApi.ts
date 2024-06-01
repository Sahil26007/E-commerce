import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { allProductResponse, categoryResponse, createProductsRequest, messageResponse, productDetailsResponse, updateProductRequest,searchProductRequest, searchProductResponse, deleteProductRequest } from "../../types/api-types";

export const productApi = createApi({
    reducerPath : "productApi",
    baseQuery:  fetchBaseQuery({
        baseUrl :  `http://localhost:8000/api/v1/product/`
    }),
    tagTypes:["products"],
    endpoints: (builder) => ({ 
        latestProducts : builder.query<allProductResponse,string>({ query: () => "latestProduct" ,providesTags:["products"] }),
        allProducts : builder.query<allProductResponse,string>({ query: (id) => `admin-products?id=${id}` ,providesTags:["products"] }),
        categoriesProducts : builder.query<categoryResponse,string>({ query: () => "category" ,
            providesTags: ["products"]}),
        searchProducts : builder.query<searchProductResponse,searchProductRequest>({ query: ({price,page,category,sort,search}) => {
            let base = `search?page=${page}&search=${search}`;
            if(price)base+=`&price=${price}`;
            if(sort)base+=`&sort=${sort}`;
            if(category)base+=`&category=${category}`;

            return base;
        },providesTags:["products"],
     }),
        productDetails : builder.query<productDetailsResponse,string>({query: (id)=> id,providesTags:[]}),

        createProduct : builder.mutation<messageResponse,createProductsRequest>({
            query :({id,formData}) => ({
                url : `new?id=${id}`,
                method: 'POST',
                body: formData,
            }),
            
            invalidatesTags: ['products'],
        }),
        
        updateProduct : builder.mutation<messageResponse,updateProductRequest>({
            query :({formData ,userid,productid}) => ({
                url : `${productid}?id=${userid}`,
                method:'PUT',
                body : formData,
            }),
                invalidatesTags:['products'],
        }), 
        deleteProduct : builder.mutation<messageResponse,deleteProductRequest>({
            query :({userid,productid}) => ({
                url : `${productid}?id=${userid}`,
                method:'DELETE',
            }),
                invalidatesTags:['products'],
        }), 

    })
})

export const { useLatestProductsQuery , 
                useAllProductsQuery ,
                useCategoriesProductsQuery , 
                useSearchProductsQuery , 
                useCreateProductMutation,
                useProductDetailsQuery,
                useDeleteProductMutation,
                useUpdateProductMutation
            } = productApi;