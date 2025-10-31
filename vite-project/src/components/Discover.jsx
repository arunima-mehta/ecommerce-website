import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const Discover = ({ onClose }) => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [interactedProducts, setInteractedProducts] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const constraintsRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      // Filter out products that have been interacted with
      const products = response.data.filter(product => !interactedProducts.has(product._id));
      setAvailableProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const refreshStack = async () => {
    setInteractedProducts(new Set()); // Clear interaction history
    await fetchProducts(); // Refetch all products
    setCurrentIndex(0); // Reset to first product
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    const swipe = info.offset.x;

    if (Math.abs(swipe) > swipeThreshold) {
      if (swipe > 0) {
        handleLike();
      } else {
        handleSkip();
      }
    }
  };

  const handleLike = async () => {
    const currentProduct = availableProducts[currentIndex];
    try {
      await axios.post('http://localhost:5000/api/products/like', { productId: currentProduct._id });
      // Add to interacted products
      setInteractedProducts(prev => new Set([...prev, currentProduct._id]));
      nextProduct('right');
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const handleSkip = () => {
    const currentProduct = availableProducts[currentIndex];
    // Add to interacted products
    setInteractedProducts(prev => new Set([...prev, currentProduct._id]));
    nextProduct('left');
  };

  const nextProduct = (newDirection) => {
    setDirection(newDirection);
    if (currentIndex < availableProducts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Show completion message when no more products
      setCurrentIndex(-1); // Use -1 to indicate no more products
    }
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="relative h-[80vh] flex flex-col items-center">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
      >
        <Icon icon="mdi:close" className="w-6 h-6" />
      </button>

      {/* Refresh Stack button */}
      <button 
        onClick={refreshStack}
        className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
      >
        <Icon icon="mdi:refresh" className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md h-full" ref={constraintsRef}>
        <AnimatePresence initial={false}>
          {currentIndex === -1 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold mb-4">No more products to show!</h3>
              <button
                onClick={refreshStack}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Refresh Stack
              </button>
            </div>
          ) : currentIndex < availableProducts.length && availableProducts[currentIndex] && (
            <motion.div
              key={currentIndex}
              className="absolute w-full h-[70vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              drag="x"
              dragConstraints={constraintsRef}
              onDragEnd={handleDragEnd}
              initial={{ x: direction === 'right' ? -300 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 'right' ? 300 : -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name}
                className="w-full h-2/3 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold dark:text-white">{currentProduct.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">${currentProduct.price}</p>
              </div>

              {/* Swipe actions */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8">
                <button
                  onClick={() => handleSkip()}
                  className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon icon="mdi:close" className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleLike()}
                  className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon icon="mdi:heart" className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Discover;