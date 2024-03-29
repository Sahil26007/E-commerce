import {Link} from 'react-router-dom'
import { FaSearch, FaShoppingBag ,FaSignInAlt ,FaUser,FaSignOutAlt } from 'react-icons/fa'
// import { PiToggleLeftFill } from "react-icons/pi";
import { useState } from 'react'
import { User } from '../types/types'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';


interface PropTypes{
  user: User|null;
}
const Header = ({user}:PropTypes) => {

  const [isOpen,setIsOpen] = useState<boolean>(false);
  const logoutHandler =async()=>{
    try {
      await signOut(auth);
      toast.success("Signed Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Signed Out failed");
    }
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
