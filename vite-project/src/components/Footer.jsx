import React from 'react'
import { assets } from '../assets/assets/frontend_assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <footer className="w-full bg-white dark:bg-gray-950 mt-32">
      <div className="container max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-sm">

          {/* Logo & About */}
          <div>
            <div className="mb-5 flex items-center">
              <img 
                src="/new_frontend_assets/aur_logo_new.png" 
                alt="AURÉLINE Logo" 
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
              />
            </div>
            <p className="w-full md:w-2/3 text-gray-600 dark:text-gray-300 leading-relaxed">
              Modern luxury, redefined.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <p className="text-lg sm:text-xl font-semibold mb-5 text-gray-900 dark:text-white">
              Company
            </p>
            <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-300">
              <li 
                className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition"
                onClick={() => handleNavigation('/')}
              >
                Home
              </li>
              <li 
                className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition"
                onClick={() => handleNavigation('/about')}
              >
                About Us
              </li>
              <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition">
                Delivery
              </li>
              <li className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition">
                Privacy Policy
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-lg sm:text-xl font-semibold mb-5 text-gray-900 dark:text-white">
              Connect with Us
            </p>
            <ul className="flex flex-col gap-2 text-gray-600 dark:text-gray-300">
              <li>+91 9876543210</li>
              <li>support@aureline.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 dark:border-gray-600 w-full">
        <p className="py-6 text-sm text-center text-gray-600 dark:text-gray-300">
          © 2026 aureline.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
