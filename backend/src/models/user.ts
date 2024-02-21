import mongoose from "mongoose";
import  validator  from "validator";

interface IUser extends Document {
    _id : string;
    name : string;
    email: string;
    photo : string;
    role : "admin" | "user";
    gender : "male" | "female";
    dob : Date;
    createdAt : Date;
    updatedAt : Date;

    age: number;
}

const schema = new mongoose.Schema(
    {
        name :{
          type :  String,
          required : [true, "Enter a name"],  
        } ,
        email : {
            type:String,
            unique : [true, "Already Used"],
            required : [true, "Enter a vaild email address"],
            validate : validator.default.isEmail,
        }
        ,

        _id: {
           type: String,
           required: [true,"Please enter a valid"]
        },

        photo : {
            type : String,

        },

        role : {
            type : String,
            enum : ["admin","user"],
            default : "user"
        },

        gender : {
            type : String,
            enum :["male", "female", "Other"],
            required : true,      
        },
        dob : {
            type : Date,
            required : [true, "Enter a valid date"]
        }
    },
    {
        timestamps: true,
    });

    schema.virtual("age").get(function(){
        const today = new Date();
        const dob = this.dob;
        let age = today.getFullYear() - dob.getFullYear();
        
        if(today.getMonth() <= dob.getMonth() || ( today.getMonth === dob.getMonth && today.getDate() < dob.getDate())) age--;

        return age;
    })

export const User = mongoose.model<IUser>("User",schema);

