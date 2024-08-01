import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { cartItems } from "../types/types";

type ProductsProps = {
  productId : string;
  photo: string;
  name: string;
  price: number;
  stock:number;
  handler: (cartItem: cartItems) => string | undefined
}; 



const ProductCard = ({productId,photo,name,price,stock,handler,}: ProductsProps) => {
  return (
    <div className="productCard">
        <img src={`${photo}`} alt={name} />
        <p>{name}</p>
        <span>₹{price}</span>       
    
        <div>
          <button onClick={() => handler({
            productId,photo,name,price,stock,quantity :1
          })}> <FaPlus/> </button>
        </div>
    </div>
  )
}

export default ProductCard
