import express  from "express";
import { newOrder } from "../controllers/order.js";

const app = express();

app.post("/new",newOrder);



export default app;