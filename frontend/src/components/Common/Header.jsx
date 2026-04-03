import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='border-b border-gray-100'>
        
        {/* TopBar */}
        <Topbar/>
        {/* navbar */}
        <Navbar/>
        {/* Cart drawer */}
    </header>
  )
}

export default Header