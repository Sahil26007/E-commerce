import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartReducerInitialTypes } from "../types/reducer-types";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {

  const { cartItems  ,total} =  useSelector((state: { cartReducer : cartReducerInitialTypes}) => state.cartReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  
  const submitHandler = async(e : FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo));
    try {
      const {data} = await axios.post(`${server}/api/v1/payment/create`,{
        amount : total,
      },{
        headers:{
          "Content-Type" : "application/json",
        },
      })
      navigate("/pay",{
        state : data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  }

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    setShippingInfo(prev => ({...prev,[e.target.name]:e.target.value}));
  };

  useEffect(() => {
      if(cartItems.length <= 0) return navigate('/cart');
  }, [cartItems])
  

  return (
    <div className="shipping">
      <button className="backBtn" onClick={() => navigate("/cart") }>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>

        <input
            required 
            type="text" 
            placeholder="Address" 
            name="address" 
            value={shippingInfo.address}    
            onChange={changeHandler}
        />

        <input
            required 
            type="text" 
            placeholder="City" 
            name="city" 
            value={shippingInfo.city}    
            onChange={changeHandler}
        />

        <input
            required 
            type="text" 
            placeholder="State" 
            name="state" 
            value={shippingInfo.state}    
            onChange={changeHandler}
        />

        <select name="country" required value={shippingInfo.country} onChange={changeHandler}>

            <option value="">Choose Country</option>
            <option value="india">India</option>
            <option value="uk">UK</option>
        </select>

        <input
            required 
            type="number" 
            placeholder="PinCode" 
            name="pincode" 
            value={shippingInfo.pincode}    
            onChange={changeHandler}
        />

        <button type="submit" className="submitBtn">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
