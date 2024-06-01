import { useState } from "react"
import ProductCard from "../components/productCard";
import { useCategoriesProductsQuery, useSearchProductsQuery } from "../redux/api/productApi";
import { customError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { cartItems } from "../types/types";


const Search = () => {

  const {data:categoryResponse , isLoading:loadingCategory ,isError ,error,} = useCategoriesProductsQuery("")
  const dispatch = useDispatch();
  const[search,setSearch] = useState("");
  const[sort,setSort] = useState("");
  const[maxPrice,setMaxPrice] = useState(999999);
  const[category,setCategory] = useState("");
  const[page,setPage] = useState(1);

  const {data:searchData , isLoading:searchLoading} = useSearchProductsQuery({search,sort,category,page,price:maxPrice});

  if(isError){
    const err = error as customError;
    toast.error(err.data.message);
  }

  const addToCartHandler = (cartItem :cartItems) => {
    if(cartItem.stock < 1) return toast.error(`${cartItem.name} is out of stock`);

    dispatch(addToCart(cartItem));
    toast.success(`Added ${cartItem.name} to Cart!`);
  };

  let totalPage = 1;
  if(searchData) totalPage = searchData.totalPage;
  const isPrevPage = page > 1;
  const isNextPage = page < totalPage;

  return (
    <div className="productsearch">
      
    <aside>
      <h2>Filters</h2>
      <div>
        <h4>Sort</h4>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">None</option>
          <option value="asc">Price (Low to High)</option>
          <option value="dsc">Price (High to Low)</option>
        </select>
      </div>
      <div>
        <h4>Max Price : {maxPrice || ""}</h4>
          <input 
            type="range"
            min={1}
            max={99999}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
      </div>
      <div>
        <h4>Category</h4>
        <select value={category} onChange={e=> setCategory(e.target.value)} >
          <option value="" >All Categories</option>
          {
            !loadingCategory && categoryResponse?.categories.map( (i)=>
            <option key={i} value={i} >{i.toUpperCase()}</option>
            
            )
          }          
        </select>
      </div>
    </aside>

    <main>
      <h1>Products</h1>
      <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}/>

      <div className="searchProductList">
       {
        searchLoading? (<Skeleton/>) :(searchData?.products.map((i)=>(
          <ProductCard
            key={i._id}
            productId={i._id}
            name={i.name}
            price={i.price} 
            handler={addToCartHandler} 
            photo={i.photo}
            stock={i.price}
         />
        )))
       } 
      </div>
       {
        searchData && searchData.totalPage>1 && (
          <article>
        <button 
            disabled={!isPrevPage} 
            onClick={() => setPage((prev) => (prev - 1))}
          >
            Prev
        </button>

        <span>{page} of {searchData.totalPage}</span>
        
        <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => (prev + 1))}
          >
          Next
        </button>
      </article>
        )
       }
    </main>
    </div>
  )
}

export default Search
