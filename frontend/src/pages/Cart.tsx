import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../components/cart-item";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import { cartReducerInitialTypes } from "../types/reducer-types";
import { cartItems } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";




const Cart = () => {

  const {cartItems , subtotal, tax, shippingCharge ,discount ,total , shippingInfo} = useSelector( (state :{cartReducer :cartReducerInitialTypes}) => state.cartReducer)
  
  const dispatch = useDispatch();

  const [couponCode,setCouponCode] = useState<string>("");
  const [isValidCouponCode,setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler =  (cartItem : cartItems) =>{

      if(cartItem.stock > cartItem.quantity)
        dispatch(addToCart({ ...cartItem , quantity : cartItem.quantity+1}));
  }
  const decrementHandler =  (cartItem : cartItems) =>{
    if(1 < cartItem.quantity)
    dispatch(addToCart({ ...cartItem , quantity : cartItem.quantity-1}));
  }
  const removeHandler =  (id :string) =>{
    dispatch(removeCartItem(id));
  }

  useEffect(() => {

    const {token,cancel} = axios.CancelToken.source()

    const timeoutId = setTimeout(() =>{

      axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode} `,{cancelToken:token})
      .then((res)=> {
        dispatch(discountApplied(res.data.discount));
        dispatch(calculatePrice());
        setIsValidCouponCode(true);
      })
      .catch(()=>{
        dispatch(discountApplied(0));
        dispatch(calculatePrice());
        setIsValidCouponCode(false);
      })
    },1000)

    return () =>{
      clearTimeout(timeoutId);
      cancel();
      setIsValidCouponCode(false);
    }
  },[couponCode])

    useEffect(() => {
      dispatch(calculatePrice());
    }, [cartItems]);
    

  return (
    <div className="cart">
      <main>
      {cartItems.length > 0 ?  cartItems.map((i,idx)=> (
          <CartItemCard
            incrementHandler={incrementHandler}
            decrementHandler={decrementHandler}
            removeHandler={removeHandler}
          key={idx} cartItem={i} />
        )) : <h1>No item is Added</h1>}

      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharge}</p>
        <p>Tax : ₹{tax}</p>
        <p>
          Discount : <em> - ₹{discount}</em>
        </p>
        <p><b>Total : ₹{total}</b></p>

        <input 
          type="text"
          placeholder="Enter Coupon Code"
          value={couponCode} 
          onChange={(e)=> setCouponCode(e.target.value)} 
        />

        { couponCode && (isValidCouponCode? (
          <span className="green"> ₹{discount} off on using <code>{couponCode}</code> </span> )
          : (<span className="red"> Invalid Coupon <VscError/> </span>)
        )}

        {
          cartItems.length > 0 && <Link to="/shipping"> Checkout</Link>
        }

      </aside>
    </div>
  )
}

export default Cart
