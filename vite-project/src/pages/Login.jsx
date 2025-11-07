import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {

      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Account created successfully!')
        }
        else{
          toast.error(response.data.message)
        }
      }
      else{
        const response =await axios.post(backendUrl + '/api/user/login', {email,password})
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)
          toast.success('Login successful!')
        }
        else{
          toast.error(response.data.message)
        }
        
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.')
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
      
    }

  },[token])

  const membershipBenefits = [
    'Access to exclusive collections',
    'Early access to sales',
    'Personalized recommendations',
    'Priority customer support',
    'Birthday & anniversary rewards',
    'Free shipping on all orders'
  ];

  return (
    <div className='min-h-screen bg-white dark:bg-black flex items-center justify-center p-4'>
      <div className='max-w-6xl w-full flex gap-8'>
        {/* Left Card - Membership Benefits */}
        <div className='flex-1 bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-2xl shadow-gray-300/40 dark:shadow-black/60 transform hover:scale-[1.02] transition-all duration-300'>
          <div>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>LOREM IPSUM DOLOR</h2>
            <p className='text-gray-600 dark:text-gray-300 mb-6 text-sm'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            </p>
            
            <div className='space-y-3'>
              {membershipBenefits.map((benefit, index) => (
                <div 
                  key={benefit}
                  className='flex items-center space-x-3'
                >
                  <div className='w-1.5 h-1.5 bg-gray-900 dark:bg-white rounded-full'></div>
                  <span className='text-sm text-gray-900 dark:text-white'>{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className='mt-6 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900'>
              <p className='text-xs italic text-gray-900 dark:text-white'>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation."
              </p>
              <p className='text-xs mt-2 text-gray-900 dark:text-white'>— Lorem D., VIP Member</p>
            </div>
          </div>
        </div>

        {/* Right Card - Login/Signup Form */}
        <div className='flex-1 bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-2xl shadow-gray-300/40 dark:shadow-black/60 transform hover:scale-[1.02] transition-all duration-300'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
            <div className='inline-flex items-center gap-2 mb-6 justify-center'>
              <p className='prata-regular text-3xl text-gray-900 dark:text-white'>{currentState}</p>
              <hr className='border-none h-[1.5px] w-8 bg-gray-900 dark:bg-white' />
            </div>
            
            {currentState === 'Login' ? '' : 
              <input 
                onChange={(e)=> setName(e.target.value)} 
                value={name} 
                type="text" 
                className='w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all duration-200' 
                placeholder='Name' 
                required
              />
            }
            
            <input 
              onChange={(e)=> setEmail(e.target.value)} 
              value={email} 
              type="email" 
              className='w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all duration-200' 
              placeholder='Email' 
              required 
            />
            
            <input 
              onChange={(e)=> setPassword(e.target.value)} 
              value={password} 
              type="password" 
              className='w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:border-transparent transition-all duration-200' 
              placeholder='Password' 
              required 
            />
            
            <div className='w-full flex justify-between text-sm mt-2'>
              <p className='cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200'>
                Forgot your password?
              </p>
              {
                currentState === 'Login'
                ? <p onClick={()=> setCurrentState('Sign Up')} className='cursor-pointer text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white underline transition-colors duration-200'>
                    Create account
                  </p>
                : <p onClick={()=> setCurrentState('Login')} className='cursor-pointer text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white underline transition-colors duration-200'>
                    Login Here
                  </p>
              }
            </div>
            
            <button className='bg-gray-900 dark:bg-white text-white dark:text-black font-medium px-8 py-3 mt-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transform hover:scale-[1.02] transition-all duration-200 shadow-lg'>
              {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login