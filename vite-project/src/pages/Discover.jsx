import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const ProductCard = ({ product, style, className, onDragEnd }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className={`absolute w-full h-full ${className}`}
      style={style}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="relative w-full h-[70%]">
          {product.image?.[0] ? (
            <img 
              src={product.image[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                setImageError(true);
                e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image+Not+Available';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <h3 className="text-white text-2xl font-semibold">{product.name}</h3>
            <p className="text-white/90 text-xl">₹{product.price}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 text-sm">{product.description?.slice(0, 100)}...</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags?.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Discover = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState([]);
  const [isSwipingEnabled, setIsSwipingEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from:', `${backendUrl}/api/product/list`);
        const response = await axios.get(`${backendUrl}/api/product/list`);
        console.log('Response:', response.data);
        if (response.data.success) {
          console.log('Setting products:', response.data.products);
          setOriginalProducts(response.data.products); // Store original list
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) {
      console.log('Backend URL:', backendUrl);
      fetchProducts();
    } else {
      console.error('Backend URL is not defined');
    }
  }, [backendUrl]);

  // Fetch liked products from MongoDB
  const fetchLikedProducts = async () => {
    if (!token) {
      console.log('No token available');
      setLikedProducts([]);
      return;
    }

    setLikesLoading(true);
    try {
      // Remove any 'Bearer ' prefix if present
      const cleanToken = token.replace('Bearer ', '');
      console.log('Fetching liked products...');
      
      const response = await axios.get(`${backendUrl}/api/swipe/liked-products`, {
        headers: { 
          token: cleanToken
        }
      });

      if (response.data.success) {
        const products = response.data.products || [];
        console.log('Received liked products:', products.length);
        setLikedProducts(products);

        if (products.length === 0) {
          console.log('No liked products found');
        }
      } else {
        console.error('Failed to fetch liked products:', response.data.message);
        toast.error(response.data.message || 'Failed to fetch liked products');
        setLikedProducts([]);
      }
    } catch (error) {
      console.error('Error fetching liked products:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error loading liked products';
      toast.error(errorMessage);
      setLikedProducts([]);
    } finally {
      setLikesLoading(false);
    }
  };

  // Initial fetch of liked products
  useEffect(() => {
    if (!isSwipingEnabled && token) {
      fetchLikedProducts();
    }
  }, [isSwipingEnabled, token, backendUrl]);

  // Handle swipe like/dislike
  const handleSwipe = async (direction) => {
    const currentProduct = products[currentIndex];
    
    if (direction === 'right') {
      if (!token) {
        toast.error('Please login to like products');
        return;
      }

      try {
        console.log('Saving liked product:', currentProduct._id);
        // Save the liked product to MongoDB
        const response = await axios.post(`${backendUrl}/api/swipe/like`, {
          productId: currentProduct._id,
          userId: token, // Add userId from token
          tags: currentProduct.tags || []
        }, {
          headers: { 
            token,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          console.log('Product liked successfully');
          toast.success('Product added to likes!');
          // Add to local liked products immediately
          setLikedProducts(prev => [...prev, currentProduct]);
        } else {
          console.error('Failed to like product:', response.data.message);
          toast.error(response.data.message || 'Failed to like product');
        }
      } catch (error) {
        console.error('Error liking product:', error.response?.data || error);
        toast.error(error.response?.data?.message || 'Failed to like product');
        return; // Don't proceed if like failed
      }
    }

    // Only remove product from stack if the like was successful (for right swipe)
    // or if it was a left swipe
    if (direction === 'left' || direction === 'right') {
      const newProducts = products.filter((_, index) => index !== currentIndex);
      setProducts(newProducts);
      if (newProducts.length === 0) {
        // If no more products, show a message
        toast.info('No more products to show. Stop swiping to see your likes!');
      }
    }
  };

  // Toggle swiping mode
  const toggleSwiping = async () => {
    const newSwipingState = !isSwipingEnabled;
    setIsSwipingEnabled(newSwipingState);
    
    if (newSwipingState) {
      // Restart swiping: reset the stack with all products
      setLoading(true);
      setCurrentIndex(0);
      setProducts(originalProducts);
      setLoading(false);
    } else {
      // Stop swiping: fetch the latest liked products from MongoDB
      await fetchLikedProducts();
    }
  };

  const cardVariants = {
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      zIndex: 5,
      transition: { duration: 0.3 }
    },
    left: {
      x: '-100%',
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
      transition: { duration: 0.3 }
    },
    right: {
      x: '100%',
      opacity: 0,
      scale: 0.8,
      zIndex: 0,
      transition: { duration: 0.3 }
    },
    behind: (i) => ({
      scale: 1 - (i * 0.05),
      y: i * 10,
      opacity: 1 - (i * 0.2),
      zIndex: 4 - i,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Title text1="DISCOVER" text2=" PRODUCTS" />
          <button
            onClick={toggleSwiping}
            className="px-6 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {isSwipingEnabled ? 'Stop Swiping' : 'Start Swiping'}
          </button>
        </div>

        {/* Swipe Cards Section */}
        {isSwipingEnabled && (
          <div className="relative h-[600px] w-full max-w-[400px] mx-auto mb-12">
            {loading ? (
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
                <p className="text-gray-500">No products available</p>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {products.slice(currentIndex, currentIndex + 3).map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      className="transform"
                      style={{
                        scale: 1 - (index * 0.05),
                        y: index * 15,
                        zIndex: 3 - index,
                        opacity: 1 - (index * 0.2),
                      }}
                      onDragEnd={(e, { offset }) => {
                        if (offset.x > 100) handleSwipe('right');
                        else if (offset.x < -100) handleSwipe('left');
                      }}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Swipe Instructions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  className="absolute bottom-[-60px] left-0 right-0 flex justify-center items-center gap-8 text-sm text-gray-500"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >👈</motion.div>
                    <span>Swipe left to skip</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ x: [5, -5, 5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >👉</motion.div>
                    <span>Swipe right to like</span>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        )}

        {/* Liked Products Grid */}
        {!isSwipingEnabled && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Liked Products</h2>
            {likesLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            ) : likedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {likedProducts.map(product => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {product.image?.[0] ? (
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image+Not+Available';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">₹{product.price}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No liked products yet. Start swiping to like some products!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;