import {Link} from 'react-router-dom'
import { FaSearch, FaShoppingBag ,FaSignInAlt ,FaUser,FaSignOutAlt } from 'react-icons/fa'
import { useState } from 'react'

const user = { _id : "dssd" , role :"admin"}

const Header = () => {

  const [isOpen,setIsOpen] = useState<boolean>(false);
  const logoutHandler =()=>{
    setIsOpen(false);
  }

  return (
    <nav className='header'>

    <Link onClick={()=>setIsOpen(false)} to={"/"}>Home</Link>
    <Link onClick={()=>setIsOpen(false)} to={"/Search"}><FaSearch/></Link>
    <Link onClick={()=>setIsOpen(false)} to={"/Cart"}><FaShoppingBag/></Link>
  
    {user?._id?(
      <>
      <button onClick={()=> setIsOpen((prev)=>(!prev))}><FaUser/></button>
      <dialog open={isOpen}>
        <div>
          {user.role === "admin" && (
            <Link onClick={()=>setIsOpen(false)} to="/admin/dashboard">Admin</Link>
          )}
          <Link onClick={()=>setIsOpen(false)} to="/Order"> Orders</Link>
          <button onClick={logoutHandler}><FaSignOutAlt/></button>
        </div>
      </dialog>
      </>
    ): (
      <Link onClick={()=>setIsOpen(false)} to={"/Login"}><FaSignInAlt/></Link>
    )} 
    </nav>
  )

}

export default Header
