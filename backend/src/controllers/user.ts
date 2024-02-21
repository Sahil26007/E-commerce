import {Request , Response ,NextFunction} from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";


export const newUser = TryCatch(async (
    req:Request<{},{}, NewUserRequestBody>,
    res:Response ,
    next:NextFunction
    ) => {
    
        const {name, email,photo,gender,_id,dob} = req.body;

        // check if user already exists  in the database  by id

        let user = await User.findById(_id);
        if (user){
            return res.status(200).json({
                success : true,
                message : `welcome ${user.name}` ,
            })
        }

        if(!_id || !name || !email || !photo || !gender || !dob)    
            return next(new ErrorHandler("Enter All fields",400));

        // create a new user and save it to the database

        user = await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob : new Date(dob),
        });

        return res.status(201).json({
            success : true,
            message : `welcome ${user.name}`,
        })

    }  
);

export const getAllUsers = TryCatch( async(req,res,next)=>{

    const user = await User.find({});
    return res.status(200).json({
        success : true,
        user,
    })
  }
)

export const getUser = TryCatch( async(req,res,next) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if(!user) return next(new ErrorHandler("Invalid User ID", 400));

    return res.status(200).json({
        success : true,
        user,
    })
})


// delete user route

export const deleteUser = TryCatch ( async(req,res,next)=>{
    const id = req.params.id;

    const user = await User.findById(id);

    if(!user) return next(new ErrorHandler("User Not Exist",400));

    await user.deleteOne();

    return res.status(200).json({
        success:true,
        message : "User deleted successfully",
    })


})