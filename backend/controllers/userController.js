import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Route to get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware
        const userData = await userModel.findById(userId).select('-password');
        res.json({success:true, userData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// Route to get user activity data for recommendations
const getUserActivity = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware
        const userData = await userModel.findById(userId).select('cartData wishlistData');
        
        if (userData) {
            // Fetch orders from orderModel
            const userOrders = await orderModel.find({ userId }).select('items');
            
            const activityData = {
                cartItems: userData.cartData || {},
                wishlistItems: userData.wishlistData || {},
                orders: userOrders || []
            };
            res.json({success:true, activityData});
        } else {
            res.json({success:false, message: "User not found"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const {email, password} = req.body;
        
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false, message: "User does not exist"})   
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({success:true, token}) 
        }
        else {
            res.json({success:false, message: 'Invalid Credentials'})
        }
    
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message}) 
    }

}

// Route for user register
const registerUser = async (req, res) => {

    try {
        
        const {name, email, password} = req.body;

        //checking if user already exists or not    
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, message: "User already exists"})
            
        }

        //validating email format and strong pwd
        if (!validator.isEmail(email)) {
            return res.json({success:false, message: "Please a enter a valid e-mail"}) 
        }
        if (password.length < 8) {
            return res.json({success:false, message: "Please a enter a strong password"}) 
        }

        //hashing user pwd 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, 
            email, 
            password: hashedPassword,
            cartData: {},
            wishlistData: {}
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({success:true, token}) 

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true, token})
        } 
        else {
            res.json({success:false, message: ""})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}

export {loginUser, registerUser, adminLogin, getUserProfile, getUserActivity}