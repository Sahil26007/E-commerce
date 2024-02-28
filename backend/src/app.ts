import express from 'express';
import NodeCache from 'node-cache'
import { config } from 'dotenv'

import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

//importing Routes
import userRoute from './routes/user.js' 
import productRoute from './routes/product.js'
import orderRoute from './routes/order.js'
import paymentRoute from './routes/payment.js'
import morgan from 'morgan';

config({
    path: "./.env"
})

const port = process.env.PORT || 8000;
const mongoURL = process.env.MONGODB_ADDRESS || "";

connectDB(mongoURL);

export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send(`APi is running at api/v1/ `);
})

//using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment",paymentRoute);

app.use("/uploads", express.static("uploads") );
app.use(errorMiddleware);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});