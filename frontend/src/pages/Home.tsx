
import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { cartItems } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import CustomCarousel from "./CustomCarousel";


export type prodType = {
  name:string;
  photo:string;
  category:string;
  price:number;
  _id:string;
  stock:number;
}


const Home = () => {

  const dispatch = useDispatch();
  const {data,isLoading,isError} = useLatestProductsQuery("");

  const addToCartHandler = (cartItem :cartItems) => {
    if(cartItem.stock < 1) return toast.error(`${cartItem.name} is out of stock`);

    dispatch(addToCart(cartItem));
    toast.success(`Added ${cartItem.name} to Cart!`);
  };

  if(isError) toast.error("Cannot fetch the Products");

  return (
    <div className="home">

      <section> <CustomCarousel /> </section>
     
      <h1>Latest Products
        < Link to="/search" className="findmore">Find More</Link>
      </h1>
      <main>
      {
        
      isLoading? <Skeleton/>:
        data?.product.map( (i:prodType) => (
          <ProductCard 
          key={i._id}
          productId= {i._id} 
          name= {i.name}
          price={i.price} 
          handler={addToCartHandler} 
          photo={i.photo}
          stock={i.stock} 
          />
        ))
      }
      
      </main>

    </div>
  )
}

export default Home
