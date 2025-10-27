import express from 'express';
import auth from '../middleware/auth.js';
import userModel from '../models/userModel.js';

const router = express.Router();

// Add a product to user's likes
router.post('/like', auth, async (req, res) => {
    try {
        const { productId, tags } = req.body;
        
        // Check if the product is already liked
        const user = await userModel.findById(req.userId);
        const alreadyLiked = user.likes.some(like => like.productId.toString() === productId);
        
        if (alreadyLiked) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product already liked' 
            });
        }

        // Add to likes array
        await userModel.findByIdAndUpdate(req.userId, {
            $push: {
                likes: {
                    productId,
                    tags,
                    likedAt: new Date()
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Product added to likes'
        });
    } catch (error) {
        console.error('Error in /swipe/like:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding product to likes'
        });
    }
});

// Get user's liked products
router.get('/liked-products', auth, async (req, res) => {
    try {
        console.log('Fetching liked products for user:', req.userId);
        
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Populate the products and handle potential null references
        await user.populate('likes.productId');

        const likedProducts = user.likes
            .filter(like => like.productId) // Filter out any null references
            .map(like => ({
                _id: like.productId._id,
                name: like.productId.name,
                description: like.productId.description,
                price: like.productId.price,
                image: like.productId.image,
                tags: like.productId.tags,
                category: like.productId.category,
                subCategory: like.productId.subCategory,
                likedAt: like.likedAt
            }));

        console.log('Found liked products:', likedProducts.length);
        
        res.status(200).json({
            success: true,
            products: likedProducts
        });
    } catch (error) {
        console.error('Error in /swipe/liked-products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching liked products',
            error: error.message
        });
    }
});

export default router;
