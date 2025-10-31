import userModel from "../models/userModel.js"

// Add product to user wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware
        const { itemId } = req.body;
        console.log('Wishlist add request:', { userId, itemId });

        const userData = await userModel.findById(userId);
        if (!userData) {
            console.log('User not found:', userId);
            return res.json({success: false, message: "User not found"});
        }
        
        let wishlistData = userData.wishlistData || {}; 
        console.log('Current wishlist data:', wishlistData);

        // Add item to wishlist (set to true to indicate it's in wishlist)
        wishlistData[itemId] = true;

        console.log('Updated wishlist data:', wishlistData);
        await userModel.findByIdAndUpdate(userId, { wishlistData })
        
        // Verify the update
        const verifyUser = await userModel.findById(userId);
        console.log('Wishlist data after update:', verifyUser.wishlistData);

        res.json({ success: true, message: "Added to Wishlist!" })
        
    } catch (error) {
        console.log('Wishlist add error:', error);
        res.json({ success: false, message: error.message })
    }
}

// Remove product from user wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware
        const { itemId } = req.body;

        const userData = await userModel.findById(userId);
        let wishlistData = userData.wishlistData || {}; 

        // Remove item from wishlist
        delete wishlistData[itemId];

        await userModel.findByIdAndUpdate(userId, { wishlistData })

        res.json({ success: true, message: "Removed from Wishlist!" })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })  
    }
}

// Get user wishlist data
const getUserWishlist = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware

        const userData = await userModel.findById(userId);
        let wishlistData = userData.wishlistData || {}; 

        res.json({ success: true, wishlistData });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message }) 
    }
}

export { addToWishlist, removeFromWishlist, getUserWishlist }
