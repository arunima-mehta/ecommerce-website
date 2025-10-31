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
  const { backendUrl, token, navigate } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState([]);
  const [swipedProducts, setSwipedProducts] = useState(new Set());
  const [isSwipingEnabled, setIsSwipingEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [likesLoading, setLikesLoading] = useState(false);

  // Check for authentication
  useEffect(() => {
    if (!token) {
      toast.error('Please login to access Discover feature');
      navigate('/login');
    }
  }, [token, navigate]);

  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/wishlist/add`, {
        productId
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Added to wishlist!');
      } else {
        toast.error(response.data.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

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

  // Fetch liked products on initial load and after refreshing page
  useEffect(() => {
    const fetchInitialLikedProducts = async () => {
      if (!token) return;
      
      try {
        // First get the wishlist
        const wishlistResponse = await axios.get('http://localhost:5173/api/wishlist/list', {
          headers: { token }
        });
        
        if (wishlistResponse.data.success && wishlistResponse.data.wishlist) {
          // Get full product details for each wishlist item
          const productPromises = wishlistResponse.data.wishlist.map(async (item) => {
            try {
              const productResponse = await axios.post('http://localhost:5173/api/product/single', {
                productId: item.productId
              });
              
              if (productResponse.data.success) {
                return productResponse.data.product;
              }
              return null;
            } catch (error) {
              console.error('Error fetching product details:', error);
              return null;
            }
          });

          const products = await Promise.all(productPromises);
          const validProducts = products.filter(product => product !== null);
          setLikedProducts(validProducts);
        }
      } catch (error) {
        console.error('Error fetching liked products:', error);
        toast.error('Error loading your liked products');
      }
    };

    fetchInitialLikedProducts();
  }, [token]);

  // Handle refresh stack
  const handleRefreshStack = async () => {
    try {
      setLoading(true);
      
      // Reset all state completely
      setSwipedProducts(new Set());
      setLikedProducts([]);
      setCurrentIndex(0);
      
      // If logged in, clear wishlist
      if (token) {
        try {
          // Remove all items from wishlist one by one
          const wishlistResponse = await axios.get('http://localhost:5173/api/wishlist/list', {
            headers: { token }
          });
          
          if (wishlistResponse.data.success && wishlistResponse.data.wishlist) {
            const removePromises = wishlistResponse.data.wishlist.map(item => 
              axios.delete(`http://localhost:5173/api/wishlist/remove/${item.productId}`, {
                headers: { token }
              })
            );
            await Promise.all(removePromises);
          }
        } catch (error) {
          console.error('Error clearing wishlist:', error);
        }
      }

      // Fetch fresh product list
      try {
        const response = await axios.get('http://localhost:5173/api/product/list');
        if (response.data.success) {
          const productList = response.data.products;
          setOriginalProducts(productList);
          setProducts(productList);
          toast.success('Stack refreshed! Start swiping again!');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error refreshing products');
      }

      // Switch to swiping mode automatically
      setIsSwipingEnabled(true);
      
    } catch (error) {
      console.error('Error in refresh process:', error);
      toast.error('Error refreshing stack');
    } finally {
      setLoading(false);
    }
  };

  // Handle swipe like/dislike
  const handleSwipe = async (direction) => {
    const currentProduct = products[currentIndex];
    if (!currentProduct) return;
    
    // Check authentication for any swipe
    if (!token) {
      toast.error('Please login to use the Discover feature');
      navigate('/login');
      return;
    }
    
    if (direction === 'right') {
      try {
        // Get userId from token
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.id;

        // Add to wishlist
        const response = await axios.post('http://localhost:4000/api/wishlist/add', {
          userId: userId,
          itemId: currentProduct._id
        }, {
          headers: { token }
        });

        if (response.data.success) {
          // Update local state only if backend update was successful
          setLikedProducts(prev => {
            // Remove if it existed before
            const filtered = prev.filter(p => p._id !== currentProduct._id);
            return [...filtered, currentProduct];
          });
          toast.success('Product added to likes!');
        } else {
          toast.error(response.data.message || 'Failed to add to wishlist');
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        toast.error('Failed to add product to likes');
        return;
      }
    }

    // Update products stack regardless of swipe direction
    setProducts(prev => {
      const newProducts = prev.filter((_, index) => index !== 0);
      if (newProducts.length === 0) {
        toast.info('No more products to show. Stop swiping to see your likes or refresh the stack!');
      }
      return newProducts;
    });
  };

  // Toggle swiping mode
  const toggleSwiping = async () => {
    const newSwipingState = !isSwipingEnabled;
    setIsSwipingEnabled(newSwipingState);
    
    if (newSwipingState) {
      // Restart swiping mode
      setLoading(true);
      setCurrentIndex(0);
      // Filter out already liked products from the stack
      const unswipedProducts = originalProducts.filter(
        product => !likedProducts.some(liked => liked._id === product._id)
      );
      setProducts(unswipedProducts);
      setLoading(false);
    }
    // Keep the liked products state as is when toggling
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
          <div className="flex gap-4">
            <button
              onClick={handleRefreshStack}
              disabled={loading}
              className={`px-6 py-2 rounded-md flex items-center gap-2 ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } transition-colors`}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
              )}
              {loading ? 'Refreshing...' : 'Refresh Stack'}
            </button>
            <button
              onClick={toggleSwiping}
              disabled={loading}
              className={`px-6 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSwipingEnabled ? 'Stop Swiping' : 'Start Swiping'}
            </button>
          </div>
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
                      <p className="text-gray-600 mb-3">₹{product.price}</p>
                      <button 
                        onClick={() => addToWishlist(product._id)}
                        className="w-full py-2 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Add to Wishlist
                      </button>
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