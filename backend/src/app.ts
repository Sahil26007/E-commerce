import express from 'express';

import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

//importing Routes
import userRoute from './routes/user.js' 
import productRoute from './routes/product.js'

const port = 8000;

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`APi is running at api/v1/ `);
})

//using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use("/uploads", express.static("uploads") );
app.use(errorMiddleware);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});