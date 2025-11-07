import userModel from "../models/userModel.js"


//add products to user cart
const addToCart = async (req,res) => {

    try {

        const { itemId, size } = req.body;
        const userId = req.userId; // Get userId from auth middleware
        console.log('Cart add request:', { userId, itemId, size });

        const userData = await userModel.findById(userId)
        if (!userData) {
            console.log('User not found:', userId);
            return res.json({success: false, message: "User not found"});
        }
        
        let cartData = await userData.cartData; 
        console.log('Current cart data:', cartData);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                
                cartData[itemId][size]+=1
            }
            else{
                cartData[itemId][size] = 1
            } 
        } 
        else {
            cartData[itemId] = {}
            cartData[itemId][size]=1
        }

        console.log('Updated cart data:', cartData);
        await userModel.findByIdAndUpdate(userId, {cartData})
        
        // Verify the update
        const verifyUser = await userModel.findById(userId);
        console.log('Cart data after update:', verifyUser.cartData);

        res.json({success: true, message: "Added to Cart!"})

        
        
    } 
    catch (error) {
        console.log('Cart add error:', error);
        res.json({success:false, message: error.message})
    }
}

//update user cart
const updateCart = async (req,res) => {
    try {

        const { itemId, size, quantity } = req.body;
        const userId = req.userId; // Get userId from auth middleware

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData; 

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: "Cart Update!"})
        
    } 
    catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})  
    }

}

//get user cart data
const getUserCart = async (req,res) => {

    try {

        const userId = req.userId; // Get userId from auth middleware
        console.log('📦 Getting cart for user:', userId);

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData; 
        console.log('📦 Cart data from database:', cartData);

        res.json({success: true, cartData});
        
    } 
    catch (error) {
        console.log('❌ Error getting cart:', error);
        res.json({success:false, message: error.message}) 
    }

}





export {addToCart, updateCart, getUserCart}
