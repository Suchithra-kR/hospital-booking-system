import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";


const Navbar = () => {

  const navigate = useNavigate();
  const {token,setToken} =useContext(AppContext)
  const[showMenu,setShowMenu]= useState(false)


  //logout functionality
  const logout =() =>{
    setToken(false)
    localStorage.removeItem('token')
  }

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300">
      <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="w-44 cursor-pointer" />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {
          token 
            ?<div className="flex items-center gap-2 cursor-pointer group relative ">
              <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium  text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-[12rem] bg-stone-100 rounded flex flex-col gap-4 p-4 ">
                   <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">My Profile</p>
                   <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">My Appointments</p>
                   <p onClick={logout}className="hover:text-black cursor-pointer">Logout</p>
                </div>
              </div>
              </div>
            :<button onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">Create Account</button>
        }
  
{/* Hamburger icon (only visible on mobile) */}
<img 
  onClick={() => setShowMenu(true)} 
  className="w-6 md:hidden cursor-pointer" 
  src={assets.menu_icon} 
  alt="menu" 
/>

{/* ---------- Mobile Menu ---------- */}
<div
  className={`fixed top-0 left-0 h-full bg-white z-20 transition-all duration-300 md:hidden 
    ${showMenu ? 'w-full' : 'w-0 overflow-hidden'}`}
>
  <div className="flex items-center justify-between px-5 py-6 border-b">
    <img className="w-36" src={assets.logo} alt="logo" />
    <img 
      className="w-7 cursor-pointer" 
      onClick={() => setShowMenu(false)} 
      src={assets.cross_icon} 
      alt="close" 
    />
  </div>

  {/* Navigation links - full width */}
  <ul className="flex flex-col mt-8 text-lg font-medium">
    <NavLink 
      onClick={() => setShowMenu(false)} 
      to="/" 
      className="w-full px-6 py-4 border-b hover:bg-gray-100 text-center"
    >
      HOME
    </NavLink>
    <NavLink 
      onClick={() => setShowMenu(false)} 
      to="/doctors" 
      className="w-full px-6 py-4 border-b hover:bg-gray-100 text-center"
    >
      ALL DOCTORS
    </NavLink>
    <NavLink 
      onClick={() => setShowMenu(false)} 
      to="/about" 
      className="w-full px-6 py-4 border-b hover:bg-gray-100 text-center"
    >
      ABOUT
    </NavLink>
    <NavLink 
      onClick={() => setShowMenu(false)} 
      to="/contact" 
      className="w-full px-6 py-4 border-b hover:bg-gray-100 text-center"
    >
      CONTACT
    </NavLink>
  </ul>
</div>


      </div>
    </div>
  );
};

export default Navbar;
