import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

export const ShopContext =  createContext();

const ShopContextProvider = (props) => { 

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState(() => {
        // Initialize cart from localStorage for non-logged users
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : {};
    }); 
    const [products, setProducts] = useState([]); 
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState({});

    const addToCart = async (itemId, size, subCategory) => {
        if (!token) {
            toast.error('Log In to add to cart');
            navigate('/login');
            return;
        }

        // Check if size is required for this subcategory
        const sizeRequiredCategories = ['Topwear', 'Bottomwear'];
        const isSizeRequired = sizeRequiredCategories.includes(subCategory);

        if (isSizeRequired && !size) {
            toast.error('Please Select Product Size');
            return;
        }

        // If size is not required, set a default size
        const finalSize = size || 'One Size';

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][finalSize]) {
                cartData[itemId][finalSize]+=1 
            } 
            else{
                cartData[itemId][finalSize] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][finalSize] = 1;
        }
        setCartItems(cartData);
        
        // Save to localStorage for non-logged users or as backup
        localStorage.setItem('cartItems', JSON.stringify(cartData));

        if (token) {
            try {
                console.log('Adding to cart:', { itemId, size: finalSize, token: token ? 'present' : 'missing' });
                const response = await axios.post(backendUrl + '/api/cart/add', {itemId, size: finalSize}, {headers:{token}});
                console.log('Cart add response:', response.data);
                
            } 
            catch (error) {
                console.log('Cart add error:', error);
                toast.error(error.message)
            }
        } else {
            console.log('No token available, cart data only saved locally');
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item]>0) {
                        totalCount += cartItems[items][item]; 
                    }
                    
                } catch (error) {
                    
                }
            }
         }
         return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
            let cartData = structuredClone(cartItems);
            cartData[itemId][size] = quantity;
            setCartItems(cartData);
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartData));

            if (token) {
                try {
                    await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}}) 
                } 
                catch (error) {
                    console.log(error);
                    toast.error(error.message)
                }
            }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id ===items);
            for(const item in cartItems[items]){
            try{
               if (cartItems[items][item] > 0){
                totalAmount += itemInfo.price * cartItems[items][item];
               }
            } catch (error){
        }
    }
    }
    return totalAmount;
    }
     
    const getProductsData = async () =>{
            try {

                const response = await axios.get(backendUrl + '/api/product/list')
                if(response.data.success){
                    setProducts(response.data.products)
                }
                else{
                    toast.error(response.data.message)
                }
                
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
    }

    const getUserCart = async (token) => {
        try {
            console.log('📦 Getting user cart from database...');
            const response = await axios.post(backendUrl + '/api/cart/get',{}, {headers:{token}})
            if (response.data.success) {
                console.log('📦 Cart data from database:', response.data.cartData);
                setCartItems(response.data.cartData)
                // Also save to localStorage as backup
                localStorage.setItem('cartItems', JSON.stringify(response.data.cartData));
                console.log('📦 Cart updated from database');
            }
        } 
        catch (error) {
            console.log('❌ Error getting cart from database:', error);
            toast.error(error.message)
            // If database fails, try to load from localStorage
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                console.log('📦 Loading cart from localStorage fallback:', JSON.parse(savedCart));
                setCartItems(JSON.parse(savedCart));
            }
        }
    }

    // Get user profile to get email for user-specific wishlist storage
    const getUserProfile = async (token) => {
        if (!token) {
            console.log('No token available for getUserProfile');
            return;
        }

        try {
            console.log('Fetching user profile...');
            const response = await axios.post(
                `${backendUrl}/api/user/profile`, 
                {}, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                }
            );
            
            if (response.data.success && response.data.userData) {
                console.log('User profile fetched successfully');
                setUserEmail(response.data.userData.email);
                // Load user wishlist from database
                getUserWishlist(token);
            } else {
                console.error('User profile fetch failed:', response.data);
                if (!response.data.success) {
                    throw new Error(response.data.message || 'Failed to fetch user profile');
                }
            }
        } 
        catch (error) {
            console.error('Error fetching user profile:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.log('Token invalid, logging out user');
                logout();
            } else {
                // Only try to get wishlist if it's not an auth error
                getUserWishlist(token);
            }
        }
    }

    // Get user wishlist from database
    const getUserWishlist = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/get', {}, {headers:{token}})
            if (response.data.success) {
                setWishlistItems(response.data.wishlistData || {});
            }
        } 
        catch (error) {
            console.log(error);
            setWishlistItems({});
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (token) {
            getUserCart(token);
            getUserProfile(token);
        } else {
            // Clear wishlist and user data when user logs out
            setWishlistItems({});
            setUserEmail('');
        }
    }, [token])

    // Merge localStorage cart with database cart when user logs in
    const mergeLocalCartWithDatabase = async () => {
        const localCart = localStorage.getItem('cartItems');
        if (localCart && token) {
            const localCartData = JSON.parse(localCart);
            // If there's local cart data, sync it with the database
            for (const itemId in localCartData) {
                for (const size in localCartData[itemId]) {
                    const quantity = localCartData[itemId][size];
                    if (quantity > 0) {
                        try {
                            await axios.post(backendUrl + '/api/cart/add', 
                                {itemId, size, quantity}, 
                                {headers:{token}}
                            );
                        } catch (error) {
                            console.log('Error syncing cart item:', error);
                        }
                    }
                }
            }
            // After syncing, get the updated cart from database
            getUserCart(token);
        }
    }

    // Add logout function to clear state when user logs out
    const logout = () => {
        setToken('');
        setCartItems({});
        setWishlistItems({}); // Clear wishlist from state (but data remains in database)
        setUserEmail(''); // Clear user email
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems'); // Clear cart on logout
        // Wishlist data remains in database and will reload when user logs back in
        navigate('/login');
    };

    const addToWishlist = async (itemId) => {
        if (!token) {
            toast.error('Log In to wishlist a product');
            navigate('/login');
            return;
        }
        
        try {
            // Debug logs
            console.log('Token status:', !!token);
            console.log('Adding to wishlist:', { itemId, tokenPresent: !!token });

            const response = await axios.post(
                `${backendUrl}/api/wishlist/add`, 
                { itemId },
                { 
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                }
            );

            console.log('Wishlist add response:', response.data);
            
            if (response.data.success) {
                // Update local state
                setWishlistItems((prev) => ({
                    ...prev,
                    [itemId]: true
                }));
                toast.success('Added to wishlist!');
                
                // Refresh wishlist data
                getUserWishlist(token);
            } else {
                console.error('Wishlist add failed:', response.data.message);
                toast.error(response.data.message || 'Failed to add to wishlist');
            }
        } catch (error) {
            console.error('Wishlist add error:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                toast.error('Please log in again');
                logout(); // Force logout if token is invalid
            } else {
                toast.error(error.response?.data?.message || 'Failed to add to wishlist');
            }
        }
    };

    const removeFromWishlist = async (itemId) => {
        if (!token) {
            toast.error('Log In to manage your wishlist');
            navigate('/login');
            return;
        }
        
        try {
            const response = await axios.post(backendUrl + '/api/wishlist/remove', {itemId}, {headers:{token}});
            if (response.data.success) {
                // Update local state
                setWishlistItems((prev) => {
                    const newItems = { ...prev };
                    delete newItems[itemId];
                    return newItems;
                });
                toast.success('Removed from wishlist!');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to remove from wishlist');
        }
    };

    const isInWishlist = (itemId) => {
        // Only show wishlist status if user is logged in
        if (!token) return false;
        return wishlistItems[itemId] ? true : false;
    };

    const getWishlistCount = () => {
        // Only count wishlist items if user is logged in
        if (!token) return 0;
        return Object.keys(wishlistItems).length;
    }

    // Function to properly clear cart (both state and localStorage)
    const clearCart = () => {
        console.log('🧹 Clearing cart - Before:', cartItems);
        console.log('🧹 Clearing localStorage cartItems');
        setCartItems({});
        localStorage.removeItem('cartItems');
        console.log('🧹 Cart cleared successfully');
    }

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl,
        setToken, token, wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount,
        logout, userEmail, getUserWishlist, clearCart
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}

        </ShopContext.Provider>
    )
}

export default ShopContextProvider