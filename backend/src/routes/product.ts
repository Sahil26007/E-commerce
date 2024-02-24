import  express  from "express";
import { adminOnly } from "../middlewares/auth.js";
import { uploadOne } from "../middlewares/multer.js";
import { SearchProduct, deleteProduct, getAdminProducts, getAllCategories, getLatestProduct, getSingleProduct, newProduct, uploadProduct } from "../controllers/product.js";
const app = express.Router();

//route = /api/v1/product/
app.post("/new",adminOnly,uploadOne,newProduct);


//search routes
app.get("/search",SearchProduct);

app.get("/latestProduct",getLatestProduct);

app.get("/category", getAllCategories);
app.get("/admin-products",adminOnly, getAdminProducts);

app.route("/:id").get(getSingleProduct).put(adminOnly,uploadOne,uploadProduct).delete(adminOnly,deleteProduct);





export default app ;

