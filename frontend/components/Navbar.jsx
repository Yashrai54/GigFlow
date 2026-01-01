import React from 'react'
import Logo from '../src/assets/logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div className=' w-[1200px] h-[80px] bg-white m-auto flex justify-around items-center shadow-xl'>
        <img src={Logo} className=' w-[80px] h-[80px]'/>
        <ul className='flex gap-[40px]'>
          <li className=' hover:text-sky-500 cursor-pointer'> <Link to="/">Home</Link></li>
          <li className=' hover:text-sky-500 cursor-pointer'><Link to="/signin">Log In</Link></li>
          <li className=' hover:text-sky-500 cursor-pointer'><Link to="/signup">Sign Up</Link></li>
        </ul>
        <button className=' cursor-pointer border-2 border-sky-500 bg-sky-500
          text-white font-semibold rounded-md px-10 py-2' onClick={()=>navigate("/project")} >Post a Project</button>
    </div>
  )
}

export default Navbar