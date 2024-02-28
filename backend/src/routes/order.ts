import express  from "express";
import { allOrder, gertSingleOrder, myOrder, newOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express();

app.post("/new",newOrder);

app.get("/my",myOrder);
app.get("/all",adminOnly,allOrder); 

app.route("/:id").get(gertSingleOrder);

export default app;