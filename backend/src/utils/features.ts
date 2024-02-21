import mongoose from "mongoose";

export const connectDB = () =>{
    mongoose
    .connect("mongodb+srv://Sahil007:Sahil007@sahil.wbfwnap.mongodb.net/",{
        dbName: "Ecommerce",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};