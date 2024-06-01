import {Link} from 'react-router-dom'
import { FaTrash } from 'react-icons/fa';
import { server } from '../redux/store';
import { cartItems } from '../types/types';

type CartItemProps = {
    cartItem: cartItems;
    incrementHandler:(cartItem:cartItems) => void;
    decrementHandler:(cartItem:cartItems) => void;
    removeHandler:(id:string) => void;
};

const CartItem = ({cartItem,incrementHandler,decrementHandler,removeHandler }:CartItemProps) => {
 
    const {productId,photo,name,price,quantity} = cartItem;

  return (
    <div className="cart-item">

      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to ={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button onClick={()=> decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button  onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}> 
        <FaTrash/> 
      </button>
    </div>
  )
}

export default CartItem;
