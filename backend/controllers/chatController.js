import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// FAQ Database
const faqDatabase = {
  // Product Categories by Price Range
  "products under 150": "Here are our products under ₹150:\n- Women Round Neck Cotton Top (₹100)\n- Men Round Neck Pure Cotton T-shirt (₹110)\n- Women Round Neck Cotton Top (₹130)\n- Girls Round Neck Cotton Top (₹140)\n- Men Round Neck Pure Cotton T-shirt (₹140)",
  
  "products under 200": "Here are our products under ₹200:\n- Men Tapered Fit Flat-Front Trousers (₹190)\n- Men Round Neck Pure Cotton T-shirt (₹200)",
  
  "cheap tops": "Here are our affordable tops:\n- Women Round Neck Cotton Top (₹100)\n- Men Round Neck Pure Cotton T-shirt (₹110)\n- Women Round Neck Cotton Top (₹130)",
  
  // Category-specific Questions
  "women tops": "Here are our women's tops:\n- Women Round Neck Cotton Top (₹100)\n- Women Round Neck Cotton Top (₹130)\nAll available in multiple sizes with cotton fabric.",
  
  "men tshirts": "Here are our men's t-shirts:\n- Men Round Neck Pure Cotton T-shirt (₹200)\n- Men Round Neck Pure Cotton T-shirt (₹110)\n- Men Round Neck Pure Cotton T-shirt (₹140)\nAll made with pure cotton for comfort.",
  
  "kids clothing": "Here are our kids' collection:\n- Girls Round Neck Cotton Top (₹220)\n- Girls Round Neck Cotton Top (₹140)\nAvailable in various sizes for different age groups.",
  
  "men trousers": "Here are our men's trousers:\n- Men Tapered Fit Flat-Front Trousers (₹190)\nAvailable in S, L, and XL sizes.",
  
  // Size and Fit Questions
  "size availability men": "For men's clothing:\n- T-shirts: Available in S, M, L, XL, XXL (varies by product)\n- Trousers: Available in S, L, XL",
  
  "size availability women": "For women's tops:\n- Available in S, M, L sizes\n- Please check individual products for specific size availability",
  
  // Price Range Questions
  "cheapest products": "Our most affordable products:\n- Women Round Neck Cotton Top (₹100)\n- Girls Round Neck Cotton Top (₹100)\n- Men Round Neck Pure Cotton T-shirt (₹110)",
  
  "price range tops": "Our tops range from ₹100 to ₹220:\n- Basic Cotton Tops: ₹100-₹130\n- Premium T-shirts: ₹140-₹200",
  
  // Material and Quality
  "cotton products": "All our cotton products:\n- Women Round Neck Cotton Top\n- Men Round Neck Pure Cotton T-shirt\n- Girls Round Neck Cotton Top\nAll made with high-quality cotton fabric.",
  
  // Bestsellers
  "bestsellers": "Our bestselling products:\n- Women Round Neck Cotton Top (₹100)\n- Men Round Neck Pure Cotton T-shirt (₹200)\n- Girls Round Neck Cotton Top (₹220)\n- Men Round Neck Pure Cotton T-shirt (₹110)\n- Women Round Neck Cotton Top (₹130)\n- Girls Round Neck Cotton Top (₹140)",
  // Sunglasses
  "sunglasses women": "We have a stunning collection of women's sunglasses including cat-eye, oversized, rimless, and oval styles. Popular picks: White Frame Slim Cat-Eye (₹1,099), Oversized Transparent Red Round (₹1,199), Sharp Black Cat-Eye (₹1,199), and Frosted Steel Blue Cat-Eye (₹1,249). All offer UV protection and come with cases!",
  "sunglasses unisex": "Yes! Our unisex collection includes Octagon Gradient Blue (₹1,399), Black & Gold Geometric Round (₹1,299), Mint Green Chunky Frame (₹999), Oversized Amber Shield (₹1,149), and Yellow Transparent Square (₹1,050). Perfect for any style!",
  "uv protection": "Absolutely! All our sunglasses come with 100% UV400 protection to shield your eyes from harmful UVA and UVB rays. Style meets safety!",
  "sunglasses case": "Yes! Every pair comes with a protective case and cleaning cloth included in the box.",

  // Footwear/Heels
  "heels": "We have Women Classic Pointed Heels in Lemon Yellow & Red (₹2,199) - a bestseller! These retro-inspired heels are perfect for parties, formal events, and making bold fashion statements.",
  "heel height": "Our classic pointed heels are 3-inch mid-heels, perfect for all-day wear without compromising on style or comfort.",
  "formal heels": "Yes! Our pointed heels work beautifully for formal occasions, office wear, and parties. The bold colors add personality while maintaining elegance.",

  // Trousers/Bottoms
  "trousers men": "We have Men Corduroy Brown Trousers (₹1,200) with a tailored fit - perfect for formal and semi-formal occasions. Also available: Men Beige Trendy Trousers (₹1,600) for a modern, fashion-forward look.",
  "trouser sizes": "Our men's trousers come in M, L, and XL sizes. Check our size guide for exact measurements!",
  "wash trousers": "Yes! Our trousers are machine washable on gentle cycle. We recommend washing in cold water and air drying to maintain fabric quality.",

  // Bags
  "bags women": "We have the Women Brown Canvas Tote Bag (₹429) - our bestseller! It's spacious, washable, and perfect for college, casual outings, or daily use. Minimal design, maximum functionality.",
  "tote durability": "Absolutely! Made from high-quality canvas material, it's built to last. Spacious enough for laptops, books, and daily essentials. Plus, it's machine washable!",
  "leather bags": "Yes! Check out our Leather Crossbody Bag (₹899) for an elegant, premium option perfect for daily use.",

  // General Shopping
  "shipping": "Yes! We offer FREE shipping on all orders above ₹500. Orders below ₹500 have a flat ₹50 shipping fee. Standard delivery takes 3-7 business days. Express shipping (₹99) delivers in 1-2 days!",
  "international shipping": "Currently, we ship within India only. International shipping coming soon!",
  "track order": "Yes! Once your order ships, you'll receive a tracking number via email and SMS.",

  // Returns & Refunds
  "return policy": "You can return products within 30 days of purchase for a full refund. Items must be unused and in original packaging. Contact support@yoursite.com or visit your Orders page to initiate a return.",
  "how to return": "Go to your Orders page → Select the item → Click 'Return Item' → Choose reason → Submit. We'll email you a return shipping label. For defective items, return shipping is FREE!",
  "refund time": "Refunds are processed within 5-7 business days after we receive your returned item. You'll get an email confirmation once processed.",

  // Payment & Discounts
  "payment methods": "We accept Credit/Debit Cards, UPI, Net Banking, Wallets (Paytm, PhonePe), and Cash on Delivery (COD available for orders under ₹5,000).",
  "student discount": "Yes! Get 10% student discount year-round. Verify with your .edu email address at checkout to unlock the discount automatically.",
  "ongoing sales": "Check our homepage for current sales! We regularly offer seasonal discounts, flash sales, and first-time buyer offers. Subscribe to our newsletter for exclusive deals!",

  // Bestsellers
  "bestsellers": "Our top sellers include:\n- Women Brown Canvas Tote Bag (₹429)\n- Women Classic Pointed Heels Lemon Yellow & Red (₹2,199)\n- Oversized Amber Shield Sunglasses (₹1,149)\n- White Cat-Eye Statement Sunglasses (₹1,299)\n- Frosted Steel Blue Cat-Eye Sunglasses (₹1,249)",

  // Contact & Support
  "contact": "Email: support@yoursite.com\nPhone: +91-XXXX-XXXXXX (Mon-Sat, 9 AM - 6 PM)\nLive Chat: Available on our website\nResponse time: Within 24 hours",
  "physical store": "We're online-only right now, which helps us keep prices low! But we're planning retail stores soon. Stay tuned!"
};

// Helper function to get personalized recommendations
const getPersonalizedRecommendations = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user || !user.wishlistData) return null;

    // Get categories from wishlist items
    const wishlistItems = Object.keys(user.wishlistData);
    const products = await productModel.find({
      _id: { $in: wishlistItems }
    });

    // Extract categories
    const categories = [...new Set(products.map(p => p.category))];

    // Find similar products
    const recommendations = await productModel.find({
      category: { $in: categories },
      _id: { $nin: wishlistItems }
    }).limit(3);

    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return null;
  }
};

// Process chat queries
export const processQuery = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.userId; // Get userId from auth middleware

    // Verify user exists in database
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found. Please try logging in again." 
      });
    }

    const lowerQuery = query.toLowerCase();

    // Function to find the best matching FAQ
    const findBestMatch = (query) => {
      let bestMatch = null;
      let maxMatchWords = 0;

      const queryWords = new Set(query.split(/\s+/));

      for (const [key, value] of Object.entries(faqDatabase)) {
        const keyWords = new Set(key.toLowerCase().split(/\s+/));
        let matchCount = 0;
        for (const word of queryWords) {
          if (keyWords.has(word)) matchCount++;
        }
        
        // Also check if the query contains the entire key phrase
        if (query.includes(key.toLowerCase())) {
          matchCount += 2; // Give extra weight to full phrase matches
        }

        if (matchCount > maxMatchWords) {
          maxMatchWords = matchCount;
          bestMatch = value;
        }
      }

      return maxMatchWords > 0 ? bestMatch : null;
    };

    // Try to find a matching FAQ
    const faqMatch = findBestMatch(lowerQuery);
    if (faqMatch) {
      return res.json({ success: true, message: faqMatch });
    }

    // Check for product search or price queries
    const priceMatch = lowerQuery.match(/under (?:₹|rs\.?\s*)?(\d+)/i);
    if (priceMatch) {
      const maxPrice = parseInt(priceMatch[1]);
      console.log('Searching for products under price:', maxPrice);

      // Extract product type if present
      const words = lowerQuery.split(' ');
      const productTypes = ['shoes', 'shirt', 'pants', 'dress', 'jacket', 'products'];
      const productType = words.find(word => productTypes.includes(word.toLowerCase()));

      let query = { price: { $lte: maxPrice } };
      if (productType && productType.toLowerCase() !== 'products') {
        query.category = { $regex: productType, $options: 'i' };
      }

      console.log('MongoDB query:', query);
      const products = await productModel.find(query).limit(5);

      if (products.length > 0) {
        const typeText = productType && productType.toLowerCase() !== 'products' ? productType : 'items';
        const response = `I found these ${typeText} under ₹${maxPrice} for you:\n` +
          products.map(p => `- ${p.name} (₹${p.price})`).join('\n');
        return res.json({ success: true, message: response });
      } else {
        return res.json({ 
          success: true, 
          message: `Sorry, I couldn't find any ${productType || 'products'} under ₹${maxPrice}. Would you like to try a different price range?`
        });
      }
    }

    // Check for recommendations request
    if (lowerQuery.includes('recommend') && userId) {
      const recommendations = await getPersonalizedRecommendations(userId);
      if (recommendations && recommendations.length > 0) {
        const response = 'Based on your preferences, you might like:\n' +
          recommendations.map(p => `- ${p.name} (₹${p.price})`).join('\n');
        return res.json({ success: true, message: response });
      }
    }

    // Default response
    return res.json({
      success: true,
      message: "I can help you with product recommendations, finding specific items, or answer questions about returns, shipping, and more. What would you like to know?"
    });

  } catch (error) {
    console.error('Error processing chat query:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.'
    });
  }
};