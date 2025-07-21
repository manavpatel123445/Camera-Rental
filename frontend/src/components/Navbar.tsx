import React from 'react'
import { Button } from './ui/Button'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <nav className="flex items-center justify-between px-8 py-4 bg-[#181622]">
        <span className="text-2xl font-bold tracking-tight">LensRentals</span>
        <div className="flex gap-8 items-center">
          <Link to="home" className="hover:text-purple-400 transition">Home</Link>
          <Link to="cameras" className="hover:text-purple-400 transition">Cameras</Link>
          <Link to="lenses" className="hover:text-purple-400 transition">Lenses</Link>
          <Link to="accessories" className="hover:text-purple-400 transition">Accessories</Link>
          <Link to="support" className="hover:text-purple-400 transition">Support</Link>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#232136] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
          />
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg">Rent Now</Button>
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="font-bold text-lg">P</span>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Navbar