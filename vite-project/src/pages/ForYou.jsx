import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import RecommendationEngine from '../utils/recommendationEngine'
import axios from 'axios'

const ForYou = () => {
    const { 
        products, 
        cartItems, 
        wishlistItems, 
        token,
        navigate,
        currency,
        backendUrl
    } = useContext(ShopContext);

    const [personalizedProducts, setPersonalizedProducts] = useState([]);
    const [revisitFavorites, setRevisitFavorites] = useState([]);
    const [userActivityProducts, setUserActivityProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userActivityData, setUserActivityData] = useState({
        cartItems: {},
        wishlistItems: {},
        orders: []
    });

    // Fetch user activity data from database
    const fetchUserActivityData = async () => {
        if (!token) {
            setUserActivityData({
                cartItems: cartItems || {},
                wishlistItems: wishlistItems || {},
                orders: []
            });
            return null;
        }

        try {
            const response = await axios.post(backendUrl + '/api/user/activity', {}, {
                headers: { token }
            });

            if (response.data.success) {
                setUserActivityData(response.data.activityData);
            }
            return null;
        } catch (error) {
            console.log('Error fetching user activity:', error);
            // Fallback to current context data
            setUserActivityData({
                cartItems: cartItems || {},
                wishlistItems: wishlistItems || {},
                orders: []
            });
            return null;
        }
    };

    // Get user's activity data
    const getUserActivityData = () => {
        const cartProductIds = Object.keys(userActivityData.cartItems);
        const wishlistProductIds = Object.keys(userActivityData.wishlistItems);
        
        // Extract product IDs from orders
        const orderProductIds = userActivityData.orders.flatMap(order => 
            order.items ? order.items.map(item => item._id) : []
        );
        
        // Get categories and subcategories from user's cart, wishlist, and orders
        const userCategories = new Set();
        const userSubcategories = new Set();
        const excludeProductIds = new Set([...cartProductIds, ...wishlistProductIds]);

        [...cartProductIds, ...wishlistProductIds, ...orderProductIds].forEach(productId => {
            const product = products.find(p => p._id === productId);
            if (product) {
                userCategories.add(product.category);
                userSubcategories.add(product.subCategory);
            }
        });

        return {
            userCategories: Array.from(userCategories),
            userSubcategories: Array.from(userSubcategories),
            excludeProductIds: Array.from(excludeProductIds),
            orderProductIds
        };
    };

    // Generate personalized recommendations using recommendation engine
    const generateRecommendations = () => {
        if (!token) {
            // If user is not logged in, show popular/best seller products
            const shuffled = [...products].sort(() => Math.random() - 0.5);
            setPersonalizedProducts(shuffled.slice(0, 8));
            setRevisitFavorites([]);
            setUserActivityProducts([]);
            setLoading(false);
            return null;
        }

        // Prepare user activity data for recommendation engine
        const userActivity = {
            cartItems: userActivityData.cartItems,
            wishlistItems: userActivityData.wishlistItems,
            orderHistory: userActivityData.orders
        };

        // Create recommendation engine instance
        const recommendationEngine = new RecommendationEngine(products, userActivity);
        
        // Generate recommendations
        const recommendations = recommendationEngine.generateRecommendations({
            maxResults: 12,
            excludeInteracted: true,
            minScore: 0.1
        });

        // Get products from user's wishlist for "Revisit Favorites"
        const favoriteProducts = Object.keys(userActivityData.wishlistItems)
            .map(id => products.find(p => p._id === id))
            .filter(product => product);

        // Get all user activity products (cart + wishlist + orders)
        const getAllUserActivityProducts = () => {
            const allActivityProductIds = new Set([
                ...Object.keys(userActivityData.cartItems),
                ...Object.keys(userActivityData.wishlistItems),
                ...userActivityData.orders.flatMap(order => 
                    order.items ? order.items.map(item => item._id) : []
                )
            ]);
            
            return Array.from(allActivityProductIds)
                .map(id => products.find(p => p._id === id))
                .filter(product => product);
        };

        setPersonalizedProducts(recommendations);
        setRevisitFavorites(favoriteProducts.slice(0, 6));
        setUserActivityProducts(getAllUserActivityProducts());
        setLoading(false);
    };

    useEffect(() => {
        if (products.length > 0) {
            fetchUserActivityData().then(() => {
                generateRecommendations();
            });
        }
    }, [products, token]);

    useEffect(() => {
        if (products.length > 0 && userActivityData) {
            generateRecommendations();
        }
    }, [userActivityData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                    <div className="mb-6">
                        <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Personal Recommendations
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Sign in to get personalized product recommendations based on your shopping activity
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Sign In for Personalized Experience
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-10 pb-16">
            {/* Header Section */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    For You
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Discover products curated just for you based on your style and preferences
                </p>
            </div>

            {/* Personalized Recommendations */}
            {personalizedProducts.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <Title text1={'RECOMMENDED'} text2={' FOR YOU'} />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Based on your activity
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6">
                        {personalizedProducts.map((item, index) => (
                            <ProductItem 
                                key={index} 
                                name={item.name} 
                                id={item._id} 
                                price={item.price} 
                                image={item.image} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Revisit Your Favorites */}
            {revisitFavorites.length > 0 && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <Title text1={'REVISIT YOUR'} text2={'FAVORITES'} />
                        <button 
                            onClick={() => navigate('/wishlist')}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            View All →
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6">
                        {revisitFavorites.map((item, index) => (
                            <ProductItem 
                                key={index} 
                                name={item.name} 
                                id={item._id} 
                                price={item.price} 
                                image={item.image} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Your Activity Section */}
            {token && (
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <Title text1={'YOUR'} text2={' ACTIVITY'} />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Wishlist • Cart • Orders
                        </div>
                    </div>
                    
                    {userActivityProducts.length > 0 ? (
                        <div className="space-y-8">
                            {/* Activity Products Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6">
                                {userActivityProducts.map((item, index) => {
                                    // Determine the activity type for each product
                                    const isInWishlist = Object.keys(userActivityData.wishlistItems).includes(item._id);
                                    const isInCart = Object.keys(userActivityData.cartItems).includes(item._id);
                                    const isInOrders = userActivityData.orders.some(order => 
                                        order.items && order.items.some(orderItem => orderItem._id === item._id)
                                    );
                                    
                                    return (
                                        <div key={index} className="relative">
                                            <ProductItem 
                                                name={item.name} 
                                                id={item._id} 
                                                price={item.price} 
                                                image={item.image} 
                                            />
                                            {/* Activity Badge */}
                                            <div className="absolute top-1 left-1 flex flex-wrap gap-1">
                                                {isInWishlist && (
                                                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                        ♥
                                                    </span>
                                                )}
                                                {isInCart && (
                                                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                        🛒
                                                    </span>
                                                )}
                                                {isInOrders && (
                                                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                        📦
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {/* Activity Legend */}
                            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">♥</span>
                                    <span>In Wishlist</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">🛒</span>
                                    <span>In Cart</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">📦</span>
                                    <span>Ordered</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State for Activity Section */
                        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="max-w-sm mx-auto">
                                <div className="mb-6">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Activity Yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Explore products to unlock this section. Add items to your wishlist, cart, or place orders to see them here.
                                </p>
                                <button 
                                    onClick={() => navigate('/collection')}
                                    className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    Explore Products
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State for logged in users with no activity at all */}
            {personalizedProducts.length === 0 && revisitFavorites.length === 0 && userActivityProducts.length === 0 && token && (
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6">
                            <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Start Exploring
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Add items to your cart or wishlist to get personalized recommendations and unlock all sections
                        </p>
                        <button 
                            onClick={() => navigate('/collection')}
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Browse Collections
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForYou;