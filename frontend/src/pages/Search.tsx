import { useState } from "react"
import ProductCard from "../components/productCard";


const Search = () => {
  const[search,setSearch] = useState("");
  const[sort,setSort] = useState("");
  const[maxPrice,setMaxPrice] = useState(9999999);
  const[category,setCategory] = useState("");
  const[page,setPage] = useState(1);

  const addToCart = () => {

  }

  const isPrevPage = page > 1;
  const isNextPage = page <4;

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
            max={9999999}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
      </div>
      <div>
        <h4>Category</h4>
        <select value={category} onChange={e=> setCategory(e.target.value)} >
          <option value="" >All Categories</option>
          <option value="Electronics" >Electronics</option>
          <option value="Clothing" >Clothing & Accessories</option>
          <option value="Home" >Home & Kitchen</option>
        </select>
      </div>
    </aside>

    <main>
      <h1>Products</h1>
      <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}/>

      <div className="searchProductList">
        <ProductCard
          productId="fdssd" 
          name="Macbook"
          price={90000} 
          handler={addToCart} 
          photo="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1697230830200" 
          stock={10}
         />
      </div>
      <article>
        <button 
            disabled={!isPrevPage} 
            onClick={() => setPage((prev) => (prev - 1))}
          >
            Prev
        </button>

        <span>{page} of 4</span>
        
        <button
            disabled={!isNextPage}
            onClick={() => setPage((prev) => (prev + 1))}
          >
          Next
        </button>
      </article>
    </main>
    </div>
  )
}

export default Search
