import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { messageResponse, userResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";
// import { server } from "../store";


export const userApi = createApi({
    reducerPath : "userApi",
    baseQuery:  fetchBaseQuery({
        baseUrl :  `http://localhost:8000/api/v1/user/`
    }),
    endpoints: (builder) => ({
        login : builder.mutation<messageResponse ,User>({
            query:(user)=>({
                url:"new",
                method:"POST",
                body: user,
            }),
        }),
    }), 
})

export const getUser = async(id :string)=>{
    try {
        const {data}:{data:userResponse }= await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
        return data;
    } catch (error) {
            throw error;
    }
}

export const { useLoginMutation } = userApi;