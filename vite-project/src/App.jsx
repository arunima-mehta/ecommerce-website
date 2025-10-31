import React from 'react'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import ForYou from './pages/ForYou'
import Discover from './pages/Discover'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import PageTransition from './components/PageTransition'
import { ToastContainer } from 'react-toastify'
import Verify from './pages/Verify'
import Wishlist from './pages/Wishlist'
import ShopContextProvider from './context/ShopContext' // Changed from import { ShopContext }
import { ThemeProvider } from './components/theme-provider'
import ChatWidget from './components/ChatWidget/ChatWidget'

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className='min-h-screen bg-white dark:bg-gray-950'>
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <ShopContextProvider>
            <ToastContainer/>
            <ChatWidget />
            <Navbar/>
            <SearchBar />
            <div className="route-wrapper">
              <PageTransition>
                <Routes>
                  <Route path='/' element={<Home/>} />
                  <Route path='/for-you' element={<ForYou/>} />
                  <Route path='/discover' element={<Discover/>} />
                  <Route path='/collection' element={<Collection/>} />
                  <Route path='/about' element={<About/>} />
                  <Route path='/contact' element={<Contact/>} />
                  <Route path='/product/:productId' element={<Product/>} />
                  <Route path='/cart' element={<Cart/>} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/place-order' element={<PlaceOrder/>} />
                  <Route path='/orders' element={<Orders/>} />
                  <Route path='/verify' element={<Verify/>} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Routes>
              </PageTransition>
            </div>
          </ShopContextProvider>
        </div>
        <Footer/>
      </div>
    </ThemeProvider>
  )
}

export default App