import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const cartItems = [{
  productId: "assdsad",
  photo:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1697230830200" ,
  name: "Mackbook",
  price: "150000",
  quantity: 2,
  stock:10,
  },
];

const subtotal = 3000;
const tax = Math.round(subtotal*.18);
const shippingCharges = 200;
const discount = 200;
const total = subtotal+tax+shippingCharges;

const Cart = () => {
  
  const [couponCode,setCouponCode] = useState<string>("");
  const [isValidCouponCode,setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {

    const timeoutId = setTimeout(() =>{
      if(Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    },1000)

    return () =>{
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    }
  },[couponCode])


  return (
    <div className="cart">
      <main>
      {cartItems.length > 0 ?  cartItems.map((i,idx)=> (
          <CartItem key={idx} cardItem={i} />
        )) : <h1>No item is Added</h1>}

      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
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
