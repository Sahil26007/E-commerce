
import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"

const Home = () => {

  const addToCart = () => {};
  return (
    <div className="home">

      <section> </section>
      <h1>Latest Products
        < Link to="/search" className="findmore">Find More</Link>
      </h1>

      <ProductCard productId="fdssd" 
      name="Macbook"
       price={90000} 
       handler={addToCart} 
       photo="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1697230830200" 
       stock={10} />

    </div>
  )
}

export default Home
