/**
 * Recommendation utility functions for personalized product suggestions
 */

export class RecommendationEngine {
    constructor(products, userActivity) {
        this.products = products;
        this.userActivity = userActivity;
    }

    /**
     * Analyzes user activity to extract preferences
     * @returns {Object} User preference data
     */
    analyzeUserPreferences() {
        const { cartItems, wishlistItems, orderHistory = [] } = this.userActivity;
        
        const preferences = {
            categories: new Map(),
            subCategories: new Map(),
            priceRanges: new Map(),
            brands: new Map(),
            tags: new Map(),
            interactedProducts: new Set()
        };

        // Helper function to analyze products
        const analyzeProducts = (productIds, weight = 1) => {
            productIds.forEach(productId => {
                const product = this.products.find(p => p._id === productId);
                if (!product) return;

                preferences.interactedProducts.add(productId);
                
                // Track categories with weights
                const categoryCount = preferences.categories.get(product.category) || 0;
                preferences.categories.set(product.category, categoryCount + weight);
                
                const subCategoryCount = preferences.subCategories.get(product.subCategory) || 0;
                preferences.subCategories.set(product.subCategory, subCategoryCount + weight);
                
                // Track price preferences
                const priceRange = this.getPriceRange(product.price);
                const priceCount = preferences.priceRanges.get(priceRange) || 0;
                preferences.priceRanges.set(priceRange, priceCount + weight);
                
                // Track brand preferences if available
                if (product.brand) {
                    const brandCount = preferences.brands.get(product.brand) || 0;
                    preferences.brands.set(product.brand, brandCount + weight);
                }

                // Track tag preferences
                if (product.tags) {
                    product.tags.forEach(tag => {
                        const tagCount = preferences.tags.get(tag) || 0;
                        preferences.tags.set(tag, tagCount + weight);
                    });
                }
            });
        };

        // Analyze cart items (highest weight - current intent)
        if (cartItems && Object.keys(cartItems).length > 0) {
            analyzeProducts(Object.keys(cartItems), 3);
        }

        // Analyze wishlist items (medium weight - desired items)
        if (wishlistItems && Object.keys(wishlistItems).length > 0) {
            analyzeProducts(Object.keys(wishlistItems), 2);
        }

        // Analyze order history (lower weight - past purchases)
        if (orderHistory && orderHistory.length > 0) {
            // orderHistory contains order items with product info already
            const orderProductIds = orderHistory
                .map(orderItem => orderItem._id) // Each orderItem has the product _id
                .filter(id => id);
            analyzeProducts(orderProductIds, 1);
        }

        return preferences;
    }

    /**
     * Gets price range category for a given price
     * @param {number} price 
     * @returns {string} Price range category
     */
    getPriceRange(price) {
        if (price < 500) return 'budget';
        if (price < 1500) return 'mid-range';
        if (price < 3000) return 'premium';
        return 'luxury';
    }

    /**
     * Calculates similarity score between two products
     * @param {Object} product1 
     * @param {Object} product2 
     * @returns {number} Similarity score (0-1)
     */
    calculateProductSimilarity(product1, product2) {
        let score = 0;
        let factors = 0;

        // Category similarity (highest weight)
        if (product1.category === product2.category) {
            score += 0.4;
        }
        factors++;

        // SubCategory similarity
        if (product1.subCategory === product2.subCategory) {
            score += 0.3;
        }
        factors++;

        // Price similarity
        const priceDiff = Math.abs(product1.price - product2.price);
        const avgPrice = (product1.price + product2.price) / 2;
        const priceScore = Math.max(0, 1 - (priceDiff / avgPrice));
        score += priceScore * 0.2;
        factors++;

        // Brand similarity
        if (product1.brand && product2.brand && product1.brand === product2.brand) {
            score += 0.1;
        }
        factors++;

        return score / factors;
    }

    /**
     * Generates personalized product recommendations
     * @param {Object} options Configuration options
     * @returns {Array} Recommended products with scores
     */
    generateRecommendations(options = {}) {
        const {
            maxResults = 12,
            excludeInteracted = true,
            minScore = 0.1
        } = options;

        const preferences = this.analyzeUserPreferences();
        
        // If no user activity, return trending/popular products
        if (preferences.categories.size === 0) {
            return this.getFallbackRecommendations(maxResults);
        }

        const recommendations = this.products
            .filter(product => {
                // Exclude products user has already interacted with
                if (excludeInteracted && preferences.interactedProducts.has(product._id)) {
                    return false;
                }
                return true;
            })
            .map(product => ({
                ...product,
                score: this.calculateProductScore(product, preferences)
            }))
            .filter(product => product.score >= minScore)
            .sort((a, b) => b.score - a.score)
            .slice(0, maxResults);

        return recommendations;
    }

    /**
     * Calculates recommendation score for a product based on user preferences
     * @param {Object} product 
     * @param {Object} preferences 
     * @returns {number} Recommendation score
     */
    calculateProductScore(product, preferences) {
        let score = 0;

        // Category preference score
        const categoryScore = preferences.categories.get(product.category) || 0;
        score += categoryScore * 0.4;

        // SubCategory preference score
        const subCategoryScore = preferences.subCategories.get(product.subCategory) || 0;
        score += subCategoryScore * 0.3;

        // Price range preference score
        const priceRange = this.getPriceRange(product.price);
        const priceScore = preferences.priceRanges.get(priceRange) || 0;
        score += priceScore * 0.2;

        // Brand preference score
        if (product.brand) {
            const brandScore = preferences.brands.get(product.brand) || 0;
            score += brandScore * 0.1;
        }

        // Normalize score (optional - can help with comparison)
        const maxPossibleScore = Math.max(
            Math.max(...preferences.categories.values(), 0) * 0.4,
            Math.max(...preferences.subCategories.values(), 0) * 0.3,
            Math.max(...preferences.priceRanges.values(), 0) * 0.2
        );

        return maxPossibleScore > 0 ? score / maxPossibleScore : score;
    }

    /**
     * Returns fallback recommendations for users with no activity
     * @param {number} maxResults 
     * @returns {Array} Fallback products
     */
    getFallbackRecommendations(maxResults) {
        // Return a mix of products from different categories
        const shuffled = [...this.products].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, maxResults).map(product => ({
            ...product,
            score: Math.random() * 0.5 + 0.3 // Random score between 0.3-0.8
        }));
    }

    /**
     * Gets products similar to a specific product
     * @param {string} productId 
     * @param {number} maxResults 
     * @returns {Array} Similar products
     */
    getSimilarProducts(productId, maxResults = 6) {
        const targetProduct = this.products.find(p => p._id === productId);
        if (!targetProduct) return [];

        return this.products
            .filter(product => product._id !== productId)
            .map(product => ({
                ...product,
                similarity: this.calculateProductSimilarity(targetProduct, product)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxResults);
    }

    /**
     * Gets trending products based on general popularity metrics
     * @param {number} maxResults 
     * @returns {Array} Trending products
     */
    getTrendingProducts(maxResults = 8) {
        // This could be enhanced with actual analytics data
        // For now, we'll simulate trending based on product attributes
        return this.products
            .map(product => ({
                ...product,
                trendScore: this.calculateTrendScore(product)
            }))
            .sort((a, b) => b.trendScore - a.trendScore)
            .slice(0, maxResults);
    }

    /**
     * Calculates a trend score for a product (placeholder implementation)
     * @param {Object} product 
     * @returns {number} Trend score
     */
    calculateTrendScore(product) {
        // This is a simplified trend calculation
        // In a real implementation, this would use analytics data
        let score = Math.random();
        
        // Boost score for certain categories that might be trending
        if (product.category === 'Women' || product.category === 'Men') {
            score += 0.2;
        }
        
        // Boost score for mid-range products
        if (product.price >= 500 && product.price <= 2000) {
            score += 0.1;
        }
        
        return score;
    }
}

export default RecommendationEngine;