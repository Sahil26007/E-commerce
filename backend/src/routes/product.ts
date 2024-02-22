import  express  from "express";
import { adminOnly } from "../middlewares/auth.js";
import { uploadOne } from "../middlewares/multer.js";
import { getAdminProducts, getAllCategories, getLatestProduct, getSingleProduct, newProduct, uploadProduct } from "../controllers/product.js";
const app = express.Router();

//route = /api/v1/product/
app.post("/new",adminOnly,uploadOne,newProduct);

app.get("/latestProduct",getLatestProduct);

app.get("/category", getAllCategories);
app.get("/admin-products", getAdminProducts);

app.route("/:id").get(getSingleProduct).put(uploadProduct);





export default app ;

