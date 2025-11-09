import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// FAQ Database
const faqDatabase = {
  // Care Instructions & Maintenance Questions
  "how to care for leather bags": "Wipe with damp cloth weekly. Use leather conditioner every 3 months for our Tan Leather Shoulder Bag (₹998), Leather Crossbody Set (₹2,649), Elegant Handbag (₹1,299). Avoid prolonged water exposure. If wet, stuff with newspaper and air dry. Store in dust bag with shape-maintaining stuffing (tissue paper). Keep away from direct sunlight!",
  
  "can leather bags get wet": "Avoid rain! Water stains leather permanently. If caught in rain, blot immediately with soft cloth, stuff with newspaper, air dry away from heat. Apply leather conditioner after drying. For protection, use leather waterproofing spray before first use. Our leather bags (₹998-₹2,649) aren't waterproof!",
  
  "how to remove stains from bags": "Canvas bags: Pre-treat with stain remover, machine wash. Leather bags: Gentle leather cleaner on soft cloth, blot (don't rub!). Test in inconspicuous area first! For tough stains, professional cleaning recommended. Act fast - old stains harder to remove!",
  
  "how do i care for pearl jewelry": "Pearls need special care! Avoid water, perfume, hairspray, and harsh chemicals - apply these BEFORE wearing pearls. Wipe gently with soft cloth after each wear to remove oils and dirt. Store in provided pouch separately from other jewelry to prevent scratches. Pearls are organic gems that need moisture - wear them regularly to maintain luster! Never use ultrasonic cleaners or steam.",
  
  "how to clean crystal jewelry": "Wipe with soft, damp cloth - never soak! For our Gold Chain Blue Crystal Hearts (₹1,599) and Amber Crystal Pendant (₹1,299), gently clean crystal stones with damp microfiber cloth. Avoid harsh chemicals, perfumes directly on crystals. Dry immediately after cleaning. Store in provided pouch to prevent scratches.",
  
  "how long will jewelry last": "With proper care, years to decades! Our handcrafted pieces use genuine freshwater pearls and quality materials. Regular cleaning, proper storage, and avoiding chemicals ensure longevity. Pearls naturally age beautifully with wear - they need body oils to maintain luster!",

  // Perfume Care
  "how to store perfumes": "Keep in cool, dry place away from direct sunlight - sunlight breaks down fragrance! Store in original boxes if possible. Avoid bathroom storage - humidity and temperature changes degrade scent. Ideal storage: bedroom drawer or closet. Our designer glass bottles protect fragrance when stored properly!",
  
  "do perfumes expire": "Yes, typically 3-5 years unopened, 1-2 years after opening. Signs of expiration: color change, smell turns sour/vinegary, reduced strength. Our Eau de Parfum concentration lasts longer than lighter concentrations. Proper storage extends life!",

  // Footwear Care
  "how do i care for leather shoes": "Wipe with damp cloth after each wear to remove dirt. Use leather conditioner every 3 months to prevent cracking. Avoid prolonged water exposure - if wet, stuff with newspaper and air dry away from heat. Use shoe trees to maintain shape. Our Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) all need regular conditioning!",
  
  "can i wear heels in rain": "Avoid if possible! Water damages materials and makes heels slippery/dangerous. If caught in rain, dry immediately - stuff with newspaper, air dry away from direct heat. Apply waterproof spray before wearing for protection. Our heels (₹2,199-₹2,799) are not waterproof!",
  
  "how to clean suede boots": "Men's Black Suede Combat Boots (₹2,499) need special care! Use suede brush to remove dirt (brush in one direction). For stains, use suede eraser or white vinegar on damp cloth. Never use water directly - causes water marks. Apply suede protector spray before first wear. Store with shoe trees!",
  
  "how to clean sneakers": "Remove laces, brush off loose dirt. Hand wash with mild soap and warm water using soft brush. For canvas sneakers, machine wash gentle cycle works too (remove insoles first). Air dry only - never tumble dry! Stuff with paper to maintain shape. Our Chunky Sneakers (₹1,899-₹2,799) stay fresh with regular cleaning!",
  
  "how to prevent shoe odor": "Air out shoes after wearing - remove insoles, let dry 24 hours. Use cedar shoe trees - absorb moisture and odor naturally. Sprinkle baking soda inside overnight, shake out morning. Rotate shoes - don't wear same pair daily. Replace insoles every 6 months for freshness!",
  
  "how long do heels last": "1-3 years with proper care depending on wear frequency! Our heels have quality materials and cushioned insoles. Resole when needed - extends life significantly. Regular cleaning, proper storage (shoe bags), rotating pairs ensures longevity. 3-3.5 inch mid-heels last longer than stilettos due to better weight distribution!",
  
  "can i resole boots": "Yes! Our Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) can be resoled by cobblers when worn down. Good quality boots last years with resoling. Leather uppers outlast soles - resoling is eco-friendly and cost-effective!",

  // Sunglasses Care
  "how to clean sunglasses": "Use provided microfiber cloth - gently wipe lenses in circular motion. For deeper clean, rinse with lukewarm water + drop of dish soap, dry with microfiber cloth. Avoid paper towels, tissues, clothing - scratch lenses! Never use harsh chemicals, ammonia, bleach. Clean weekly for clear vision!",
  
  "how to prevent scratches on sunglasses": "Always use protective case when not wearing - every pair comes with case! Never place lenses-down on surfaces. Don't leave in hot car - heat damages coatings. Clean regularly - dirt particles cause scratches when wiped. Handle by frames, not lenses!",
  
  "how to store sunglasses": "Always in protective case - prevents scratches, damage. Store in cool, dry place away from extreme heat/cold. Don't leave in car - dashboard heat warps frames. Keep away from sharp objects. Our cases fit perfectly - use them every time!",
  
  "do sunglasses need maintenance": "Clean weekly, tighten screws monthly, replace nose pads yearly (if applicable). Check for loose screws, frame alignment. UV protection doesn't expire but proper care maintains clarity. With care, our sunglasses last years of daily wear!",

  // Topwear Care
  "how to wash cotton tops": "Machine wash cold water, gentle cycle. Turn inside out to protect colors. Use mild detergent - avoid bleach. Air dry flat or hang - no tumble dry high heat (shrinks!). Our Rust Ribbed Cotton Top (₹1,450), Yellow Striped Shirt (₹2,977), White Cotton Shirt Set (₹2,899) all machine washable!",
  
  "how to care for wool coats": "Dry clean or hand wash cold with wool-specific detergent. Never wring or twist - gently squeeze water out. Lay flat to dry on towel - hanging stretches. Use garment bag for storage with cedar blocks (moth prevention). Our Red Wool Coat (₹4,200), Black Overcoat (₹6,450), Burgundy Blazer (₹5,466) need gentle care!",
  
  "can i machine wash blazers": "Structured blazers = dry clean only to maintain shape. Casual cotton blazers may be machine washable (check care label). Use garment bag, gentle cycle, cold water if washing. Air dry on hanger - no tumble dry. Professional cleaning preserves tailoring longer!",
  
  "how to wash silk shirts": "Hand wash cold with gentle detergent or dry clean for our Beige Silk Shirt (₹4,600). If hand washing: soak 5 minutes, gently agitate, rinse cold water, never wring. Roll in towel to remove water, air dry flat away from sunlight. Iron on silk setting (low heat) while slightly damp. Silk is delicate!",
  
  "how to care for sweaters": "Hand wash cold or dry clean - never machine wash/dry (pills, shrinks!). For our Rust Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Green Turtleneck (₹3,489): gently hand wash, lay flat to dry on towel. Fold, never hang - hangers stretch shoulders. Use sweater comb to remove pills. Store with cedar blocks!",
  
  "how to remove wrinkles": "Steam or iron according to fabric. Cotton: high heat. Silk/synthetic: low heat with cloth barrier. Wool: medium heat, steam. Wrinkle release spray works for quick touch-ups. Hang in steamy bathroom for natural de-wrinkling. Our linen pieces (₹3,000) embrace natural wrinkles - it's part of the charm!",
  
  "how to prevent shrinking": "Wash cold water, air dry flat or hang - never hot water/high heat dryer! Hot water + heat = major shrinkage. For cotton/linen, expect 3-5% shrinkage first wash. Pre-washing before alterations recommended. Dry cleaning prevents shrinkage for delicate items!",
  
  "how long do tops last": "2-10 years depending on care and fabric! Cotton basics: 2-5 years. Quality blazers/coats: 5-10+ years with proper care. Rotate outfits - don't wear same item weekly. Repair small damages immediately - extends life. Investment pieces like our coats (₹4,200-₹6,879) last decades!",

  // Bags Care
  "how to clean canvas bags": "Machine wash gentle cycle, cold water for our Canvas Totes (₹319-₹799)! Use mild detergent, no bleach. Air dry flat - don't tumble dry! Pre-treat stains with gentle soap before washing. This is why canvas is PERFECT for daily use - totally washable!",
  
  "how to care for leather bags": "Wipe with damp cloth weekly. Use leather conditioner every 3 months for our Tan Leather Shoulder Bag (₹998), Leather Crossbody Set (₹2,649), Elegant Handbag (₹1,299). Avoid prolonged water exposure. If wet, stuff with newspaper and air dry. Store in dust bag with shape-maintaining stuffing (tissue paper). Keep away from direct sunlight!",
  
  "can leather bags get wet": "Avoid rain! Water stains leather permanently. If caught in rain, blot immediately with soft cloth, stuff with newspaper, air dry away from heat. Apply leather conditioner after drying. For protection, use leather waterproofing spray before first use. Our leather bags (₹998-₹2,649) aren't waterproof!",
  
  "how to remove stains from bags": "Canvas bags: Pre-treat with stain remover, machine wash. Leather bags: Gentle leather cleaner on soft cloth, blot (don't rub!). Test in inconspicuous area first! For tough stains, professional cleaning recommended. Act fast - old stains harder to remove!",
  
  "how to clean pearl handbag": "Spot clean only! Our Pearl Beaded Handbag (₹1,890) has faux pearls - gently wipe with barely damp cloth, dry immediately. Never submerge in water! Store in provided dust bag away from sharp objects. Handle carefully - beaded bags are delicate statement pieces!",
  
  "how to clean straw hats": "Spot clean with damp cloth for our Straw Hats (₹799-₹1,049). Mix water + drop dish soap, gently dab stains, dry with clean cloth. Never submerge in water - weakens straw! Brush off dust regularly with soft brush. Air out after wearing - prevents sweat buildup!",

  // Bestsellers and Trending Items
  "what are your bestselling products": "Our TOP sellers across all categories! **Jewelry**: Pearl Layered Back Necklace (₹1,350), Freshwater Pearl Beach Choker (₹780). **Perfumes**: Luxury Blue Glass Perfume (₹890), Flame Essence (₹1,450). **Footwear**: Women Classic Pointed Heels Yellow & Red (₹2,199), Knee-High Leather Boots (₹2,799). **Sunglasses**: Oversized Amber Shield (₹1,149), Frosted Steel Blue Cat-Eye (₹1,249). **Topwear**: Rust Collared Ribbed Top (₹1,450), Red Wool Coat (₹4,200). **Bags**: Brown Canvas Tote (₹429)!",
  
  "whats trending right now": "**Cat-eye sunglasses are EXPLODING!** Also hot: **Pearl jewelry** (beach chokers, layered necklaces), **Pastel heels** (green & pink tones), **Oversized blazers** (beige, burgundy), **Rust-toned knitwear** (sweaters, cardigans, tops), **Chunky sneakers** (sporty street style), **Canvas tote bags** (sustainable everyday), **Wide brim hats** (sun protection chic), **Unisex perfumes** (gender-neutral scents)!",
  
  "most popular items by category": "**Jewelry**: Pearl Layered Back Necklace (₹1,350) - backless dress essential! **Perfumes**: Luxury Blue Glass (₹890) - designer bottle! **Footwear**: Classic Pointed Heels Yellow & Red (₹2,199) - retro playful! **Sunglasses**: Oversized Amber Shield (₹1,149) - festival ready! **Topwear**: Rust Collared Ribbed Top (₹1,450) - versatile chic! **Bags**: Brown Canvas Tote (₹429) - daily workhorse! **Hats**: Straw Sun Hat (₹1,049) - beach perfect!",
  
  "customer favorites": "Based on reviews + repeat purchases: **Brown Canvas Tote (₹429)** - \"best bag ever!\", **Oversized Amber Shield Sunglasses (₹1,149)** - \"perfect for everything!\", **Classic Pointed Heels Yellow & Red (₹2,199)** - \"comfortable & gorgeous!\", **Pearl Layered Back Necklace (₹1,350)** - \"stunning for weddings!\", **Red Wool Coat (₹4,200)** - \"investment piece!\". People LOVE these!",

  // Jewelry Bestsellers
  "bestselling jewelry": "**#1: Women Pearl Layered Back Necklace (₹1,350)** - stunning for backless dresses, weddings, formal events! **#2: Freshwater Pearl Beach Choker (₹780)** - boho beach vibes, affordable beauty! **#3: Gold Chain Blue Crystal Hearts (₹1,599)** - romantic Y-necklace! **#4: Chunky Shell Bead Choker (₹2,399)** - bold statement! **#5: Statement Pearl (₹2,899)** - artistic show-stopper!",
  
  "most popular necklace": "**Pearl Layered Back Necklace (₹1,350)** hands down! Customers love the dramatic multi-strand design for backless gowns. Perfect for weddings, proms, formal galas. Genuine freshwater pearls, handcrafted quality. Reviews say \"absolutely stunning\", \"got so many compliments\", \"worth every rupee\"!",
  
  "trending jewelry styles": "**Pearl jewelry is HUGE** right now - natural, timeless, elegant! **Layered necklaces** (mixing metals, lengths) super popular. **Beach/boho chokers** with beads and crystals trending for summer. **Statement pieces** over delicate - bold shells, chunky pearls. **Crystal pendants** in warm tones (amber, blue) romantic!",
  
  "what jewelry do people buy most": "**Pearl pieces dominate!** Beach Choker (₹780) for casual, Layered Back (₹1,350) for formal. **Crystal pendants** (₹1,299-₹1,599) for gifting - romantic + elegant. **Shell Bead Choker (₹2,399)** for statement-makers. Pearl jewelry outsells crystal 2:1 - classic never goes out of style!",

  // Footwear, Perfume & Sunglasses Bestsellers
  "best boots for winter": "**Women's Knee-High Leather Boots (₹2,799)** bestseller - structured, block heel, chic! Also hot: **Men's Combat Boots (₹2,499)** - rugged cool. **Chelsea Boots (₹2,598)** year-round versatile. Winter = boot season, these three styles can't stay in stock!",
  
  "most popular perfume": "**Luxury Blue Glass Perfume (₹890)** is our #1! Customers obsessed with the bold blue bottle + gold cap - looks expensive, Instagram-worthy. Great value for premium presentation. Perfect for collectors and fragrance lovers. Reviews: \"gorgeous bottle\", \"smells amazing\", \"best gift\"!",
  
  "trending perfume scents": "**Unisex fragrances BOOMING** - gender-neutral scents for everyone! **Aquatic/fresh scents** (Wave Eau ₹1,799) for daily wear. **Warm woody/spice** (Flame Essence ₹1,450) for evenings. **Tropical florals** (Sunfig Bloom ₹1,250) for summer. **Clean minimal** scents over heavy floral - modern preference!",
  
  "best perfume for gifting": "**Premium Glass Perfume Set (₹1,299)** - luxury trio, beautiful packaging, versatile! Also popular: **Luxury Blue Glass (₹890)** - designer look at accessible price. **Flame Essence (₹1,450)** - unisex sophistication. Perfume is TOP gifting category - personal, luxurious, memorable!",
  
  "bestselling sunglasses": "**#1: Unisex Oversized Amber Shield (₹1,149)** - EVERYONE loves these! Sporty, futuristic, festival-ready! **#2: Women Frosted Steel Blue Cat-Eye (₹1,249)** - icy statement! **#3: Unisex White Cat-Eye Statement (₹1,299)** - bold retro drama! **#4: Women Sharp Black Cat-Eye (₹1,199)** - dramatic edge! **#5: Women Oversized Red Round (₹1,199)** - retro glam!",

  // Hats, Bags & Winter Coats Bestsellers
  "bestselling hats": "**#1: Women Straw Sun Hat Beach Wide Brim (₹1,049)** - sun protection essential! **#2: Men Classic Fedora Beige (₹1,190)** - smart-casual staple! **#3: Unisex Printed Bucket Hat (₹699)** - Y2K trend! **#4: Women Straw Hat Summer Boho (₹799)** - woven natural charm! **#5: Women Wide Brim Felt Hat (₹1,349)** - elegant formal!",
  
  "best everyday bag": "**Brown Canvas Tote (₹429)** universally loved for daily use! Also popular: **Classic Canvas Tote (₹799)** bigger capacity, **Tan Leather Shoulder Bag (₹998)** polished professional. Everyday bag needs: spacious, durable, versatile, washable!",
  
  "best winter coats": "**Red Oversized Wool Coat (₹4,200)** #1 seller - bold statement, premium warmth! **Black Wool Overcoat (₹6,450)** classic investment. **Olive Trench Coat (₹6,879)** sophisticated. Customers invest in **quality winter coats** - wear for years, worth the price!",
  
  "trending topwear styles": "**Rust/orange tones EVERYWHERE** - fall color of the year! **Oversized silhouettes** - blazers, coats, sweatshirts. **Ribbed/textured knits** over smooth. **Co-ord sets** - matching top + bottom convenience! **Layered looks** - cardigans, blazers, turtlenecks. **Bold statement coats** (red, olive) investment pieces!",

  // Wedding & Formal Events
  "what should i wear to a wedding": "Women: Pearl Layered Back Necklace (₹1,350) for backless gowns, Classic Pointed Heels (₹2,199-₹2,799), Pearl Beaded Handbag (₹1,890), Wide Brim Felt Hat (₹1,349). Men: Tailored Black Suit with Burgundy Shirt (₹4,350), Glossy Black Chelsea Boots (₹2,598), Classic Fedora (₹1,190). Elegant perfumes: Flame Essence (₹1,450), Sunfig Bloom (₹1,250).",
  
  "best jewelry for formal events": "Pearl Layered Back Necklace (₹1,350) - stunning for backless/low-back gowns, Amber Crystal Pendant (₹1,299) - warm elegant evening wear, Gold Chain Blue Crystal Hearts (₹1,599) - romantic sophistication, Statement Pearl (₹2,899) - bold artistic statement. All handcrafted premium pieces!",
  
  "what heels for formal occasions": "All our heels work beautifully! Black Patent Red Sole (₹2,599) - sultry power, Dual-Tone Cream & Red (₹2,799) - refined elegance, Pastel Stiletto Green & Pink (₹2,299) - soft sophistication, Classic Pointed Yellow & Red (₹2,199) - playful formal. 3-3.5 inch mid-heels for all-day comfort!",
  
  "formal wear for men": "Tailored Black Suit with Burgundy Shirt (₹4,350) - weddings/business, Plaid Blazer with Brown Turtleneck (₹5,300) - smart formal, Burgundy Wool Blazer (₹5,466) - autumn sophistication, Black Wool Overcoat (₹6,450) - winter elegance, Beige Silk Shirt (₹4,600) - summer luxury. Pair with Chelsea Boots (₹2,598), Classic Fedora (₹1,190).",
  
  "evening wear accessories": "Bags: Elegant Leather Handbag with Gold Clasp (₹1,299), Pearl Beaded Handbag (₹1,890), Leather Crossbody Set (₹2,649). Jewelry: Crystal pendants, pearl necklaces. Perfumes: Flame Essence (₹1,450), Lum Eau (₹1,199). Sunglasses: Matte Black Wrap (₹1,399) for outdoor evening events.",
  
  "what to wear to black-tie events": "Women: Beige Blazer Turtleneck Set (₹6,547), Black Oversized Jacket Dress (₹3,977), Elegant heels (₹2,599-₹2,799), Pearl jewelry, Leather handbag (₹1,299). Men: Tailored Black Suit (₹4,350), Printed Suit Blazer (₹8,760), Black Wool Overcoat (₹6,450), Chelsea Boots (₹2,598).",

  // Office & Professional Wear
  "what should i wear to the office": "Women: Rust Ribbed Cotton Top (₹1,450), White V-neck Blouse (₹6,340), Beige Blazer Sets (₹3,240-₹6,547), White Cotton Shirt Set (₹2,899), Formal Pleated Pants (₹1,400-₹1,500), Black Pleated Pants (₹1,500), Pointed Heels (₹2,199-₹2,299), Black Mules (₹1,899), Tan Leather Shoulder Bag (₹998). Men: Yellow Striped Shirt (₹2,977), Corduroy Brown Trousers (₹1,200), Beige Trendy Trousers (₹1,600), Tan Sneakers (₹2,299), Chelsea Boots (₹2,598).",
  
  "business casual outfits": "Women: Beige Blazer White Tank (₹3,240), White Cotton Shirt Set (₹2,899), Black Striped Trousers Set (₹1,800), Rust Ribbed Top (₹1,450), Mules (₹1,899), Tan Shoulder Bag (₹998). Men: Plaid Blazer (₹5,300), Beige Silk Shirt (₹4,600), Beige Trendy Trousers (₹1,600), Tan Brown Sneakers (₹2,299), Classic Fedora (₹1,190).",
  
  "professional bags for work": "Tan Leather Shoulder Bag (₹998) - structured everyday office, PU Leather Tote Set (₹999) - spacious laptop-friendly, Classic Canvas Tote (₹799) - professional casual, Leather Crossbody Set (₹2,649) - premium commute, Brown Canvas Tote (₹429) - college/casual workplace. All fit laptops!",
  
  "office-appropriate perfumes": "Sheer Light (₹1,350) - light citrus white tea, not overpowering, Minimalist Cube (₹580) - clean modern subtle, Square Amber Glow (₹620) - warm professional. Avoid heavy scents - stick to fresh, airy, professional fragrances!",
  
  "comfortable shoes for all-day office wear": "Women: Black Mules (₹1,899) - slip-on ease, Knee-High Boots (₹2,799) - block heels, Pastel Heels (₹2,299) - 3-inch mid-heels. Men: Tan Brown Sneakers (₹2,299) - office-casual sleek, Chelsea Boots (₹2,598) - polished comfortable. All designed for real wear!",

  // Parties & Celebrations
  "what should i wear to a party": "Women: Classic Pointed Heels Yellow & Red (₹2,199), Black Patent Red Sole Heels (₹2,599), Black Oversized Jacket Dress (₹3,977), Red Oversized Wool Coat (₹4,200), Statement jewelry (₹1,599-₹2,899), Quilted Green Party Tote (₹749), Elegant Leather Handbag (₹1,299). Men: Printed Suit Blazer (₹8,760), Beige Silk Shirt (₹4,600), Burgundy Wool Blazer (₹5,466), Maroon Sneakers (₹3,456).",
  
  "birthday party outfit ideas": "Fun & festive! Women: Floral Tie-Neck Blouse with Skirt (₹1,580), Off-Shoulder Rust Wrap Dress (₹3,000), Pastel Heels (₹2,299), Bold sunglasses (₹1,149-₹1,399), Quilted Green Tote (₹749). Men: Yellow Striped Shirt (₹2,977), Mustard Zip Jacket (₹5,630), Chunky Sneakers (₹1,899-₹2,799). Add playful accessories!",
  
  "night out accessories": "Bags: Pearl Beaded Handbag (₹1,890) - show-stopper, Elegant Leather Handbag (₹1,299) - sultry, White Mini Bag (₹319) - essentials only. Jewelry: Statement Pearl (₹2,899), Gold Chain Crystal Hearts (₹1,599), Shell Bead Choker (₹2,399). Perfumes: Flame Essence (₹1,450) - bold evening, Lum Eau (₹1,199) - warm musk.",
  
  "festival concert outfit ideas": "Sunglasses: Oversized Amber Shield (₹1,149), Octagon Gradient Blue (₹1,399), Yellow Transparent Square (₹1,050), Mint Green Chunky (₹999). Topwear: Beige Co-ord Sweatshirt (₹2,999), Black Oversized Jacket Dress (₹3,977), Tennis Dress (₹3,345). Footwear: Chunky Sneakers (₹1,899-₹2,799). Hats: Printed Bucket Hat (₹699), Abstract Camo Cap (₹599). Bags: Canvas Totes (₹429-₹799).",
  
  "new years eve outfit": "Glamorous! Women: Black Patent Red Sole Heels (₹2,599), Red Oversized Wool Coat (₹4,200), Black Oversized Jacket Dress (₹3,977), Statement Pearl (₹2,899), Elegant Leather Handbag (₹1,299), Steel Blue Cat-Eye Sunglasses (₹1,249). Men: Printed Suit Blazer (₹8,760), Black Suit (₹4,350), Black Wool Overcoat (₹6,450).",

  // Casual & Everyday Occasions
  "casual weekend outfit ideas": "Women: Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), White V-neck Blouse (₹6,340), Rust Cardigan White Tee (₹3,986), Jeans/trousers, Chunky Pink Sneakers (₹2,365), Black Mules (₹1,899), Brown Canvas Tote (₹429), Cat-eye Sunglasses (₹1,099-₹1,249). Men: Yellow Striped Shirt (₹2,977), White Bomber Jacket (₹3,450), Olive Zip Jacket (₹3,456), Cargo Pants (₹1,200), Sneakers (₹1,899-₹2,799).",
  
  "coffee date outfit": "Casual chic! Women: Rust Ribbed Top (₹1,450), White Linen Shirt (₹5,679), Floral Blouse (₹1,580), Beige Trousers (₹1,600), Black Mules (₹1,899), Tan Shoulder Bag (₹998), Slim Sunglasses (₹975-₹1,125), Pearl & Gold Layered Set (₹990). Men: Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977), Tan Sneakers (₹2,299), Classic Fedora (₹1,190).",
  
  "brunch outfit ideas": "Fresh & stylish! Women: Off-Shoulder Rust Wrap Dress (₹3,000), White Cotton Shirt Set (₹2,899), Floral Tie-Neck Blouse (₹1,580), Pastel Heels (₹2,299), Straw Hats (₹799-₹1,049), Canvas Tote (₹799), Oversized Red Round Sunglasses (₹1,199). Men: Beige Silk Shirt (₹4,600), Beige Trendy Trousers (₹1,600), Brown Suede Sneakers (₹2,499).",
  
  "movie night casual hangout": "Comfortable cool! Topwear: Beige Co-ord Sweatshirt (₹2,999), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), White Bomber Jacket (₹3,450). Footwear: All sneakers (₹1,899-₹2,799). Bags: Canvas Totes (₹319-₹799). Sunglasses: Any style! Hats: Bucket Hat (₹699), Camo Cap (₹599).",
  
  "grocery shopping errands outfit": "Effortless essentials! Topwear: Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), simple tees. Bags: Brown Canvas Tote (₹429) - PERFECT for groceries, spacious, washable! Also: Classic Canvas Tote (₹799), Shopping Bag (₹359). Footwear: Sneakers (₹1,899-₹2,799), Mules (₹1,899). Sunglasses: Any!",

  // Seasonal & Weather-Based
  "summer outfit ideas": "Stay cool! Topwear: Off-Shoulder Rust Linen Wrap Dress (₹3,000), Tennis Dress (₹3,345), Floral Tie-Neck Blouse (₹1,580), White V-neck (₹6,340), Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977), White Linen Shirt (₹5,679). Footwear: Mules (₹1,899), Heels (₹2,199-₹2,299), Sneakers. Accessories: ALL sunglasses (UV400!), Straw Hats (₹799-₹1,049), Canvas Totes (₹429-₹799). Perfumes: Sunfig Bloom (₹1,250), Citrus Orange (₹670), Sheer Light (₹1,350).",
  
  "winter wardrobe essentials": "Bundle up stylishly! Topwear: Red Oversized Wool Coat (₹4,200), Black Wool Overcoat (₹6,450), Olive Trench Coat (₹6,879), Rust Textured Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), Burgundy Wool Blazer (₹5,466), Plaid Blazer (₹5,300). Footwear: Knee-High Leather Boots (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499). Hats: Wide Brim Felt (₹1,349), Fedora (₹1,190).",
  
  "beach vacation outfit ideas": "Tropical vibes! Jewelry: Freshwater Pearl Beach Choker (₹780) - PERFECT for beach!, Shell Bead Choker (₹2,399). Topwear: Off-Shoulder Rust Wrap Dress (₹3,000), Tennis Dress (₹3,345), White Linen Shirt (₹5,679). Sunglasses: ALL styles - UV400 protection essential! Hats: Straw Sun Hat (₹1,049), Straw Boho (₹799), Bucket Hat (₹699). Bags: Canvas Totes (₹429-₹799), Pearl Handbag (₹1,890). Perfumes: Sunfig Bloom (₹1,250), Wave Eau (₹1,799), Citrus Orange (₹670).",
  
  "rainy day outfit": "Weather-proof style! Topwear: Olive Trench Coat (₹6,879), Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630). Footwear: Combat Boots (₹2,499), Chelsea Boots (₹2,598), Sneakers. Bags: Leather bags hold up better than canvas in rain - PU Tote (₹999), Tan Shoulder Bag (₹998).",
  
  "spring fall transitional outfits": "Layer up! Topwear: Rust Cardigan (₹3,986), Burgundy Wool Blazer (₹5,466), Plaid Blazer (₹5,300), White Bomber Jacket (₹3,450), Zip Jackets (₹3,456-₹5,630), Rust Textured Knit Sweater (₹3,500). Footwear: Sneakers (₹1,899-₹2,799), Ankle boots. Accessories: Fedora (₹1,190), Canvas Totes (₹429-₹799).",

  // Travel Occasions
  "airport travel outfit": "Comfort + style! Topwear: Beige Co-ord Sweatshirt (₹2,999), Rust Cardigan (₹3,986), Zip Jackets (₹3,450-₹5,630). Footwear: Sneakers (₹1,899-₹2,799) - easy security check. Bags: Leather Crossbody Set (₹2,649) - hands-free secure!, Classic Canvas Tote (₹799) - fits everything. Sunglasses: Oversized styles (₹1,149-₹1,399). Hats: Fedora (₹1,190), Bucket Hat (₹699).",
  
  "road trip essentials": "Adventure ready! Sunglasses: Oversized Amber Shield (₹1,149) - PERFECT road trip shades!, Classic Dark Rectangle (₹1,050). Bags: Large Canvas Totes (₹429-₹799) - snacks, essentials. Topwear: Beige Co-ord (₹2,999), Cardigans (₹3,986), Zip Jackets. Footwear: Comfortable sneakers (₹1,899-₹2,799). Hats: Camo Cap (₹599), Bucket Hat (₹699).",
  
  "resort luxury vacation wear": "Elevated relaxation! Jewelry: Pearl Layered Necklace (₹2,699) - resort glamour, Beach Choker (₹780). Topwear: Off-Shoulder Rust Wrap Dress (₹3,000), White Cotton Shirt Set (₹2,899), Beige Silk Shirt (₹4,600). Bags: Pearl Beaded Handbag (₹1,890), Leather Crossbody (₹2,649). Sunglasses: Statement styles (₹1,249-₹1,399). Hats: Straw Sun Hat (₹1,049), Wide Brim (₹1,349). Perfumes: Premium scents (₹1,250-₹1,799).",

  // Sports & Active Occasions
  "gym workout outfit": "Tennis Dress with Green Accent (₹3,345) - sporty breathable activewear, Blue Chunky Sports Sneakers (₹2,799) - athletic performance, Beige Co-ord Sweatshirt (₹2,999) - comfortable movement. Pair with sports bags/totes!",
  
  "tennis sports activity wear": "Tennis Dress (₹3,345) - specifically designed for tennis! Breathable fabric, built-in shorts, flattering fit. Also great for casual athletic activities. Blue Chunky Sports Sneakers (₹2,799) for traction. Oversized Amber Shield Sunglasses (₹1,149) for outdoor play!",
  
  "hiking outdoor adventure outfit": "Durable comfort! Footwear: Combat Boots (₹2,499) - rugged traction, Chunky Sneakers (₹1,899-₹2,799). Topwear: Zip Jackets (₹3,450-₹5,630), Cargo Pants (₹1,200). Bags: Canvas Totes (₹429-₹799) - sturdy. Hats: Camo Cap (₹599), Straw Sun Hat (₹1,049) - sun protection. Sunglasses: UV400 all styles!",
  
  "running jogging outfit": "Our sneakers are for casual wear/light workouts rather than serious running. For actual running, we recommend specialized athletic running shoes. Chunky Sports Sneakers (₹2,799) work for gym sessions and light jogs!",

  // Date Night & Romantic Occasions
  "first date outfit ideas": "Impress! Women: Off-Shoulder Rust Wrap Dress (₹3,000), Floral Tie-Neck Blouse (₹1,580), Beige Blazer White Tank (₹3,240), Classic Pointed Heels (₹2,199), Pearl & Gold Layered Set (₹990), Tan Shoulder Bag (₹998). Men: Beige Silk Shirt (₹4,600), Plaid Blazer (₹5,300), Tan Sneakers (₹2,299), Classic Fedora (₹1,190). Perfumes: Flame Essence (₹1,450), Sunfig Bloom (₹1,250), Lum Eau (₹1,199).",
  
  "romantic dinner outfit": "Elegant sophistication! Women: Black Oversized Jacket Dress (₹3,977), Beige Blazer Turtleneck Set (₹6,547), Dual-Tone Heels (₹2,799), Pearl Layered Back Necklace (₹1,350), Elegant Leather Handbag (₹1,299). Men: Black Suit with Burgundy Shirt (₹4,350), Burgundy Wool Blazer (₹5,466), Chelsea Boots (₹2,598). Perfumes: Flame Essence (₹1,450) bold evening!",
  
  "anniversary celebration outfit": "Special occasion glam! Jewelry: Statement Pearl (₹2,899), Gold Chain Blue Crystal Hearts (₹1,599), Amber Crystal Pendant (₹1,299). Footwear: Black Patent Red Sole Heels (₹2,599), Pastel Stiletto (₹2,299). Bags: Pearl Beaded Handbag (₹1,890), Elegant Leather Handbag (₹1,299). Topwear: Red Wool Coat (₹4,200), Black Jacket Dress (₹3,977).",

  // Summer Products & Recommendations
  "what should i buy for summer": "Topwear: Off-Shoulder Rust Linen Wrap Dress (₹3,000), Tennis Dress Green Accent (₹3,345), Floral Tie-Neck Blouse (₹1,580), White V-neck Blouse (₹6,340), White Linen Shirt (₹5,679), Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977). Footwear: All heels (₹2,199-₹2,799), Mules (₹1,899), Sneakers. Accessories: ALL sunglasses (UV400!), Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes (₹429-₹799). Jewelry: Beach Choker (₹780), Shell Bead Choker (₹2,399). Perfumes: Sunfig Bloom (₹1,250), Citrus Orange (₹670), Sheer Light (₹1,350)!",

  "best summer dresses": "Off-Shoulder Rust Linen Wrap Dress (₹3,000) - breathable linen, breezy, sun-kissed elegance! Tennis Dress Green Accent (₹3,345) - sporty, breathable, built-in shorts! Floral Tie-Neck Blouse with Vintage Skirt (₹1,580) - cheerful vintage spring/summer! All lightweight, breathable, perfect for hot days!",

  "summer shoes": "Women: Pointed Toe Black Mules (₹1,899) - slip-on ease!, Classic Pointed Heels (₹2,199-₹2,299) - elegant summer events, Pastel Heels (₹2,299) - brunch-ready! Men: Tan Brown Sneakers (₹2,299), Olive Green Chunky Sneakers (₹1,899), Brown Suede Sneakers (₹2,499). Avoid boots - too hot! Open/breathable styles best!",

  "summer accessories": "Sunglasses - ESSENTIAL! All 17 styles have UV400 protection (₹899-₹1,399). Hats: Straw Sun Hat (₹1,049) - max sun protection, Straw Boho Hat (₹799), Bucket Hat (₹699). Bags: Canvas Totes (₹429-₹799) - breathable, casual. Jewelry: Beach Choker (₹780) - perfect for beach!, Shell Bead Choker (₹2,399) - ocean vibes!",

  "what colors for summer": "Bright & Light: White, beige, yellow, rust/orange, pastel pink, pastel green, light blue, mint green! Our summer picks: Yellow Striped Shirt (₹2,977), Rust Linen Wrap Dress (₹3,000), White tops (₹2,899-₹6,340), Beige items (₹2,999-₹4,600), Pastel Heels (₹2,299), Mint Green Sunglasses (₹999), Yellow Sunglasses (₹1,050)!",

  "summer perfumes": "Tropical Floral Sunfig Bloom (₹1,250) - fig, jasmine, neroli - summer garden! Citrus Orange (₹670) - zesty fresh energy! Sheer Light (₹1,350) - light citrus white tea! Wave Eau (₹1,799) - aquatic sea salt! Avoid heavy woody scents - go fresh, fruity, floral, aquatic!",

  "beach vacation essentials": "Jewelry: Freshwater Pearl Beach Choker (₹780) - DESIGNED for beach!, Shell Bead Choker (₹2,399). Sunglasses: ALL styles - UV protection essential! Hats: Straw Sun Hat (₹1,049), Straw Boho Hat (₹799), Bucket Hat (₹699). Dresses: Rust Linen Wrap (₹3,000), Tennis Dress (₹3,345). Bags: Canvas Totes (₹429-₹799), Pearl Handbag (₹1,890). Perfumes: Sunfig Bloom (₹1,250), Wave Eau (₹1,799), Citrus Orange (₹670)!",

  "breathable fabrics for hot weather": "Linen: Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) - most breathable! Cotton: Rust Ribbed Cotton Top (₹1,450), Yellow Striped Cotton Shirt (₹2,977), White Cotton Shirt Set (₹2,899). Silk: Beige Silk Shirt (₹4,600) - temperature-regulating! Canvas: All tote bags (₹319-₹799). Avoid wool, heavy knits!",

  // Winter Products & Recommendations
  "what should i buy for winter": "Topwear: Red Oversized Wool Coat (₹4,200), Black Wool Overcoat (₹6,450), Olive Trench Coat (₹6,879), Rust Textured Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), Burgundy Wool Blazer (₹5,466), Plaid Blazer Turtleneck (₹5,300), Striped Sweater (₹4,567). Footwear: Knee-High Leather Boots (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499). Accessories: Wide Brim Felt Hat (₹1,349), Fedora (₹1,190), Leather bags (₹998-₹2,649) - weather-resistant!",

  "best winter coats": "#1: Red Oversized Wool Coat (₹4,200) - bold statement, premium wool blend warmth, broad lapels, plush texture! #2: Black Wool Overcoat (₹6,450) - classic investment, structured, timeless elegance! #3: Olive Green Trench Coat (₹6,879) - sophisticated knee-length, versatile layering! All designed for maximum warmth + style!",

  "winter boots": "Women's Knee-High Leather Block Heel Boots (₹2,799) - BESTSELLER! Chic, structured, warm coverage, block heels for stability! Men's Glossy Black Chelsea Boots (₹2,598) - sleek slip-on, formal winter style! Men's Black Suede Combat Boots (₹2,499) - rugged, insulated, outdoor-ready! All leather for durability + warmth!",

  "warmest items": "Coats: Red Wool Coat (₹4,200), Black Wool Overcoat (₹6,450) - wool = maximum warmth! Sweaters: Black Turtleneck (₹5,775), Green Turtleneck (₹3,489), Rust Knit Sweater (₹3,500), Blue Floral Knit (₹5,490) - thick knits! Layering: Rust Cardigan (₹3,986) over turtlenecks! Boots: All boots (₹2,499-₹2,799) keep feet warm!",

  "winter colors": "Deep & Rich: Black, burgundy, rust, olive green, navy, brown, grey, deep red! Our winter picks: Black Wool Overcoat (₹6,450), Red Wool Coat (₹4,200), Burgundy Wool Blazer (₹5,466), Olive Trench Coat (₹6,879), Rust Knit Sweater (₹3,500), Green Turtleneck (₹3,489), Black Turtleneck (₹5,775), Corduroy Brown Trousers (₹1,200)!",

  "layering pieces for winter": "Base layer: Turtleneck sweaters (₹3,489-₹5,775) - Black, Green. Mid layer: Cardigans (₹3,986), Knit Sweaters (₹3,500-₹5,490), Blazers (₹5,300-₹5,466). Outer layer: Wool Coats (₹4,200-₹6,450), Trench Coat (₹6,879). Bottomwear: Corduroy Trousers (₹1,200), Pleated Pants (₹1,400-₹1,500). Layer for warmth + style!",

  "winter accessories": "Hats: Wide Brim Felt Hat (₹1,349) - elegant + warm, Fedora (₹1,190) - classic. Bags: Leather bags (₹998-₹2,649) - weather-resistant, structured. Jewelry: Layer necklaces under coats - Pearl & Gold Set (₹990)! Perfumes: Flame Essence (₹1,450) - warm woods, Lum Eau (₹1,199) - amber musk, cozy scents!",

  "cold weather shoes": "Boots ONLY! Knee-High Leather Boots (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499) - insulated, warm, weatherproof! Avoid: Mules, heels, canvas sneakers. Leather/suede with socks = warmth. Boots protect from cold, wet, snow!",

  // Fall/Autumn Products & Recommendations
  "what should i buy for fall": "Topwear: Rust Cardigan White Tee (₹3,986), Rust Textured Knit Sweater (₹3,500), Burgundy Wool Blazer (₹5,466), Plaid Blazer Brown Turtleneck (₹5,300), Rust Collared Ribbed Top (₹1,450), Striped Sweater (₹4,567), Olive Zip Jacket (₹3,456). Bottomwear: Corduroy Brown Trousers (₹1,200), Wide-Leg Pants (₹2,658). Accessories: Fedora (₹1,190), Canvas/Leather bags. Colors: Rust, burgundy, olive, brown, beige!",

  "best fall colors": "Rust/Orange tones DOMINATE fall! Rust Collared Ribbed Top (₹1,450), Rust Linen Wrap Dress (₹3,000), Rust Textured Knit Sweater (₹3,500), Rust Cardigan (₹3,986), Rust Knit Wide-Leg Pants (₹2,658). Also: Burgundy Wool Blazer (₹5,466), Olive Green items (₹3,456-₹6,879), Brown Corduroy Trousers (₹1,200), Beige pieces. Fall = warm earthy tones!",

  "transitional clothing for fall": "Light Layers: Cardigans (₹3,986) - easy on/off!, Zip Jackets (₹3,450-₹5,630) - versatile, Blazers (₹5,300-₹5,466) - professional layering. Medium weight: Knit Sweaters (₹3,500-₹5,490) - not too heavy. Versatile bottoms: Corduroy Trousers (₹1,200), Beige Trendy Trousers (₹1,600). Footwear: Sneakers (₹1,899-₹2,799), Chelsea Boots (₹2,598) - transition to boots!",

  "fall accessories": "Hats: Classic Fedora (₹1,190) - autumn staple!, Bucket Hat (₹699). Bags: Tan Leather Shoulder Bag (₹998), Brown Canvas Tote (₹429) - earthy tones! Sunglasses: Amber Shield (₹1,149) - warm amber tones perfect for fall! Jewelry: Amber Crystal Pendant (₹1,299) - warm autumn glow!",

  "autumn jackets": "Light-Medium weight: Olive Green Zip Jacket (₹3,456), Mustard Yellow Zip Jacket (₹5,630), White Bomber Jacket (₹3,450) - transitional! Heavier: Burgundy Wool Blazer (₹5,466), Plaid Blazer (₹5,300) - structured warmth. Save heavy coats (₹4,200-₹6,879) for deep winter. Fall = layerable jackets!",

  // Spring Products & Recommendations
  "what should i buy for spring": "Topwear: Floral Tie-Neck Blouse Vintage Skirt (₹1,580), White Cotton Shirt Set (₹2,899), White V-neck Blouse (₹6,340), White Linen Shirt (₹5,679), Rust Collared Ribbed Top (₹1,450). Footwear: Pastel Stiletto Heels Green & Pink (₹2,299), Mules (₹1,899), Chunky Pink Sneakers (₹2,365). Accessories: Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes. Colors: Pastels, florals, white, beige!",

  "spring dresses": "Floral Tie-Neck Blouse with Vintage Skirt (₹1,580) - cheerful vintage spring/summer garden party vibes! Off-Shoulder Rust Linen Wrap Dress (₹3,000) - breezy spring elegance! White Cotton Shirt and Skirt Set (₹2,899) - fresh minimalist! Tennis Dress (₹3,345) - sporty spring activities! Light, breathable, cheerful!",

  "pastel items for spring": "Footwear: Pastel Stiletto Heels Green & Pink (₹2,299) - PERFECT spring colors!, Chunky Pink Sneakers (₹2,365). Bags: Pastel Summer Carryall (₹429) - light pastel tones! Bottomwear: White Pleated Skirt (₹1,300) - soft feminine. Topwear: White Cotton items (₹2,899-₹6,340), Beige Co-ord (₹2,999). Spring = soft colors!",

  "light jackets for spring": "White Bomber Jacket (₹3,450) - lightweight layering! Olive Green Zip Jacket (₹3,456) - transitional weather! Rust Cardigan (₹3,986) - easy breezy! Beige Blazer (₹3,240) - professional spring! Avoid heavy wool coats - too warm. Spring = light layers you can remove!",

  "spring colors": "Soft & Fresh: White, beige, pastel pink, pastel green, light blue, yellow, floral prints! Our spring picks: White tops (₹2,899-₹6,340), Beige pieces (₹2,999-₹4,600), Pastel Heels (₹2,299), Yellow Striped Shirt (₹2,977), Pink Sneakers (₹2,365), Floral Blouse (₹1,580), Mint Green Sunglasses (₹999)!",

  "spring accessories": "Hats: Straw Hats (₹799-₹1,049) - sun protection begins!, Bucket Hat (₹699). Bags: Canvas Totes (₹429-₹799) - light casual, Pastel Carryall (₹429). Sunglasses: ALL styles - UV protection as sun strengthens! Jewelry: Beach Choker (₹780), Pearl & Gold Layered Set (₹990) - delicate spring jewelry!",

  // Rainy Season Products & Recommendations
  "what to wear in rain": "Topwear: Olive Green Trench Coat (₹6,879) - classic rain coat!, Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630) - water-resistant. Footwear: Combat Boots (₹2,499) - rugged waterproof!, Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) - coverage! Bags: Leather bags (₹998-₹2,649) - hold up better than canvas. Avoid: Canvas bags, suede, delicate fabrics!",

  "waterproof items": "Coats: Olive Trench Coat (₹6,879) - designed for rain! Apply waterproof spray to: Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630). Boots: Leather/suede boots (₹2,499-₹2,799) - treat with waterproof spray before wearing! Bags: Leather bags (₹998-₹2,649) more water-resistant than canvas. Note: NO items are fully waterproof - treat and protect!",

  "rain boots": "Our Combat Boots (₹2,499) work well - rugged sole, higher ankle! Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) offer coverage. Treat with waterproof spray before monsoon! Avoid mules, heels, canvas sneakers - slip hazards + water damage!",

  "monsoon accessories": "Bags: Leather bags (₹998-₹2,649) - wipeable, water-resistant! Avoid canvas (absorbs water). Hats: Felt hats CAN get wet but dry carefully. Jewelry: Remove before rain - water damages! Sunglasses: Keep handy for sudden sunshine! Umbrellas: Not sold but recommended!",

  "colors for rainy season": "Dark tones hide splashes: Black (coats, boots, pants), Olive Green (Trench Coat ₹6,879, Zip Jacket ₹3,456), Brown (boots, bags), Grey. Avoid: White, beige, pastels - show stains! Rainy season = practical dark colors!",

  // Hot Weather Specifics
  "cooling clothes for extreme heat": "Linen: Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) - MOST breathable fabric! Loose silhouettes: Oversized styles allow air flow. Light colors: White, beige reflect heat. Minimal layers: Single-layer tops, dresses. Open footwear: Mules (₹1,899), open-toe heels. Cotton: Rust Ribbed Cotton Top (₹1,450), Cotton shirts (₹2,977-₹2,899). Stay cool!",

  "sun protection items": "Sunglasses: ALL 17 styles have UV400 protection (₹899-₹1,399) - ESSENTIAL eye protection! Hats: Straw Sun Hat (₹1,049) - MAXIMUM sun coverage wide brim!, Straw Boho Hat (₹799), Bucket Hat (₹699), any wide brim hat (₹1,349-₹1,499). Light long sleeves: White Linen Shirt (₹5,679) protects arms. Perfumes: Apply sunscreen before perfume!",

  "best fabrics for hot weather": "#1: Linen - most breathable (Rust Wrap Dress ₹3,000, White Linen Shirt ₹5,679). #2: Cotton - natural, breathable (Rust Ribbed Top ₹1,450, Cotton shirts ₹2,899-₹2,977). #3: Silk - temperature-regulating (Beige Silk Shirt ₹4,600). #4: Canvas - for bags (₹319-₹799). AVOID: Wool, heavy knits, polyester, leather clothing (bags OK)!",

  // Cold Weather Specifics
  "warmest coat": "Red Oversized Wool Coat (₹4,200) and Black Wool Overcoat (₹6,450) - WOOL = warmest! Premium wool blend, structured, designed for extreme cold. Olive Trench Coat (₹6,879) good but less insulated. For maximum warmth: wool coats + layer sweaters underneath!",

  "insulated items": "Wool coats (₹4,200-₹6,450) - natural insulation! Thick knit sweaters (₹3,500-₹5,775) - Rust Knit, Black Turtleneck, Blue Floral Knit. Wool blazers (₹5,466) - Burgundy Wool. Layering strategy: Turtleneck + Cardigan + Wool Coat = maximum insulation! Boots (₹2,499-₹2,799) keep feet insulated!",

  "best layering combinations": "Ultra Cold: Green Turtleneck (₹3,489) + Rust Cardigan (₹3,986) + Black Wool Overcoat (₹6,450) + Corduroy Trousers (₹1,200) + Chelsea Boots (₹2,598)! Moderately Cold: White tee + Rust Knit Sweater (₹3,500) + Burgundy Blazer (₹5,466) + Black Pleated Pants (₹1,500)! Professional Cold: Shirt + Plaid Blazer Turtleneck (₹5,300) + Wool Overcoat! Layer = warmth!",

  // Year-Round & Versatile Items
  "what works all year": "Topwear: Rust Collared Ribbed Cotton Top (₹1,450) - layer or alone!, White V-neck Blouse (₹6,340), Beige Blazer (₹3,240-₹6,547) - layer over anything! Footwear: Chelsea Boots (₹2,598) - formal year-round, Sneakers (₹1,899-₹2,799), Black Mules (₹1,899). Bags: ALL bags work year-round! Sunglasses: ALL - sun protection always needed! Jewelry: ALL!",

  "versatile colors for all seasons": "Black - EVERYTHING black works year-round! White - fresh all seasons! Beige/Tan/Brown - neutral timeless! Rust/Orange - surprisingly versatile fall-summer! Olive Green - earthy year-round! Grey - professional always! Our neutral collection (₹429-₹8,765) works 365 days!",

  "transitional season must-haves": "Layerable pieces: Cardigans (₹3,986), Blazers (₹3,240-₹8,760), Zip Jackets (₹3,450-₹5,630) - add/remove as temperature changes! Medium-weight sweaters (₹3,500-₹5,490). Versatile footwear: Chelsea Boots (₹2,598), Sneakers. Neutral colors: Beige, black, olive, rust. Transition = layers + neutral!",

  // Category & Browsing Questions - Main Categories
  "what products do you sell": "We have 8 amazing categories! Jewelry (pearl necklaces, chokers, crystal pendants), Perfumes (unisex/women's fragrances), Topwear (blazers, sweaters, coats, dresses), Footwear (sneakers, boots, heels), Sunglasses (cat-eye, oversized, geometric), Bottomwear (trousers, skirts, pants), Bags (totes, crossbody, clutches), Hats (wide brim, fedoras, bucket hats). Over 120 products!",
  
  "show me all women products": "We have 70+ women's items! Jewelry (pearl necklaces, chokers, crystal pendants), Perfumes (Sheer Light, Sunfig Bloom, floral scents), Topwear (blazers, sweaters, dresses, blouses, coats), Footwear (heels, boots, mules, sneakers), Sunglasses (cat-eye, oval, oversized), Bottomwear (pleated pants, skirts, trousers), Bags (totes, crossbody, clutches), Hats (wide brim, straw hats, bucket hats).",
  
  "what do you have for men": "30+ men's items! Topwear (blazers, suits, bomber jackets, overcoats, turtleneck sweaters, silk/cotton shirts), Footwear (sneakers, Chelsea boots, combat boots), Sunglasses (classic dark rectangle), Bottomwear (corduroy trousers, beige trendy pants, cargo pants, shorts), Hats (classic fedora, camo cap).",
  
  "do you have unisex products": "Yes! Perfumes (Flame Essence, Wave Eau, Lum Eau, Citrus Orange), Sunglasses (Octagon Blue, Black & Gold Geometric, Mint Green Chunky, Amber Shield, White Cat-Eye Statement, Yellow Square, Ice Blue Matte, Clear Frame), Footwear (Brown Suede Sneakers, Glossy Black Chelsea Boots), Bags (Light Shopping Bag, Brown Printed Canvas Tote), Bottomwear (Neutral Beige Trousers).",
  
  "what is your bestselling category": "Sunglasses and Jewelry are flying off shelves! Also popular: Footwear (heels, boots) and Topwear (blazers, coats). Check out our bestsellers section!",

  // Price-Based Questions - Overall
  "whats cheapest": "Women White Mini Stylish Bag at ₹319! Perfect for carrying essentials. We also have the Light Everyday Shopping Bag at ₹359 and Women Brown Canvas Tote Bag at ₹429.",
  
  "whats the most expensive item": "Men White Knitted Sweater Vest at ₹8,765! Also Men Printed Suit Blazer (₹8,760) - bold patterned, tailored for parties and fashion events.",
  
  "show me products under 500": "Women White Mini Bag (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469).",
  
  "what can i get between 1000-2000": "Tons of options! Sunglasses (₹975-₹1,399), Jewelry (₹780-₹1,599), Perfumes (₹1,199-₹1,799), Sneakers (₹1,899-₹1,999), Bags (₹1,299-₹1,890), Hats (₹1,049-₹1,499), and more!",
  
  // BAGS - PRICE QUERIES
  "cheapest bag": "Women White Mini Stylish Bag at ₹319! Cute mini tote for essentials – wallet, phone, keys. Lightweight and adorable!",

  "bags under 500": "Women White Mini Bag (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469).",

  "most expensive bag": "Women Leather Crossbody Bag Set - Tan & Beige at ₹2,649! Premium structured set with angular silhouette – modern elegance at its finest.",

  "bags between 700-1000": "Quilted Style Party Tote (₹749), Women Classic Canvas Tote (₹799), Women Tan Leather Shoulder Bag (₹998), Women PU Leather Tote Set (₹999).",

  "leather bags between 1000-2000": "Elegant Leather Handbag with Gold Clasp (₹1,299), Women Beaded Pearl Handbag (₹1,890).",

  // HATS - PRICE QUERIES
  "cheapest hat": "Men Abstract Camouflage Cap at ₹599! Bold red-beige pattern, perfect for streetwear.",

  "hats under 800": "Men Abstract Camo Cap (₹599), Women Printed Bucket Hat (₹699), Women Straw Hat Summer Boho (₹799).",

  "most expensive hat": "Women Textured Brim Hat - Evening Black at ₹1,499! Bold, wide brim, perfect for formal evening wear.",

  "womens hats between 1000-1500": "Women Straw Sun Hat (₹1,049), Men Classic Fedora (₹1,190), Women Wide Brim Felt Hat (₹1,349), Women Textured Brim Hat (₹1,499).",

  // Category-specific Questions & Price Ranges
  // BOTTOMWEAR - PRICE QUERIES
  "cheapest bottomwear": "Men White Pleated Shorts with White T-shirt at ₹1,100! Perfect casual summer outfit.",

  "trousers under 1500": "Men Corduroy Brown Trousers (₹1,200), Women Chic White Pleated Skirt (₹1,300), Men Grey Cardigan with Black Pants (₹1,400), Women White Formal Pleated Pants (₹1,400).",

  "most expensive bottomwear": "Women Black Striped Trousers Set at ₹1,800! Sleek pinstriped trousers with matching blazer – office perfection.",

  "womens pants between 1400-1700": "Women White Formal Pleated Pants (₹1,400), Unisex Neutral Beige Trousers (₹1,500), Women Formal Light Gray Pants (₹1,500), Women Black Pleated Pants (₹1,500), Men Beige Trendy Trousers (₹1,600), Women Black Urban Maxi Skirt (₹1,600), Women Stylish Black Maxi Pleated Skirt (₹1,600).",

  // Jewelry Price Ranges
  "whats the cheapest jewelry": "Women Freshwater Pearl Beach Choker at ₹780! Handcrafted with sea-green beads and crystal drops – perfect for beach days and boho vibes.",
  "show me jewelry under 1000": "Women Freshwater Pearl Beach Choker (₹780) and Women Pearl and Gold Layered Necklace Set (₹990) – both stunning and affordable!",
  "most expensive jewelry": "Women Statement Pearl at ₹2,899 – a bold, artistic statement piece perfect for making an impression at any event!",
  "jewelry between 1000-1500": "Women Pearl Layered Back Necklace (₹1,350), Women Amber Crystal Pendant Necklace (₹1,299).",
  "jewelry between 1500-3000": "Women Gold Chain with Blue & Crystal Heart Charms (₹1,599), Women Chunky Shell Bead Choker (₹2,399), Women Pearl Layered Necklace (₹2,699), Women Statement Pearl (₹2,899).",
  
  // Perfumes Price Ranges
  "cheapest perfume": "Elegant Round Perfume Bottle at ₹450! Floral-inspired, minimalist design perfect for gifting or displaying.",
  "perfumes under 700": "Elegant Round Perfume Bottle (₹450), Minimalist Cube Perfume (₹580), Classic Square Amber Glow (₹620), Citrus Orange Perfume (₹670).",
  "most expensive perfume": "Unisex Aqua Minimalist Duo 'Wave Eau' at ₹1,799 – clean aquatic scent with sea salt and white amber. Luxury twin bottles!",
  "perfumes between 1000-1500": "Luxury Blue Glass Perfume (₹890), Unisex Artistic Swirl 'Lum Eau' (₹1,199), Women's Tropical Floral 'Sunfig Bloom' (₹1,250), Premium Glass Perfume Set (₹1,299), Women's Subtle Glow 'Sheer Light' (₹1,350), Unisex Luxury Amber 'Flame Essence' (₹1,450).",
  
  // TOPWEAR - PRICE QUERIES
  "cheapest top": "Women Rust Collared Ribbed Cotton Top at ₹1,450! Fitted, retro-inspired, perfect for casual and smart outings.",

  "tops under 2000": "Women Rust Ribbed Cotton Top (₹1,450), Women Floral Tie-Neck Blouse (₹1,580).",

  "most expensive top": "Men Printed Suit Blazer at ₹8,760! Bold patterned, tailored for parties and fashion events. Also Men White Knitted Sweater Vest (₹8,765).",

  "womens tops between 2500-3500": "Women White Cotton Shirt & Skirt Set (₹2,899), Women Oversized Beige Co-ord Sweatshirt (₹2,999), Women Off-Shoulder Rust Linen Wrap Dress (₹3,000), Women Beige Blazer with White Ribbed Tank (₹3,240), Women Tennis Dress with Green Accent (₹3,345), Women Rust Textured Knit Sweater (₹3,500).",

  "mens blazers between 4000-6000": "Men Tailored Black Suit with Burgundy Shirt (₹4,350), Men Beige Silk Shirt (₹4,600), Men Plaid Blazer with Brown Turtleneck (₹5,300), Men Burgundy Wool Blazer (₹5,466), Men Mustard Yellow Zip Jacket (₹5,630).",

  "winter coats between 4000-7000": "Women Red Oversized Wool Blend Coat (₹4,200), Men Black Wool Overcoat (₹6,450), Women Olive Green Trench Coat (₹6,879), Women Beige Blazer and Turtleneck Set (₹6,547).",

  "kids clothing": "Here are our kids' collection:\n- Girls Round Neck Cotton Top (₹220)\n- Girls Round Neck Cotton Top (₹140)\nAvailable in various sizes for different age groups.",
  
  "men trousers": "Here are our men's trousers:\n- Men Tapered Fit Flat-Front Trousers (₹190)\nAvailable in S, L, and XL sizes.",
  
  // Footwear Price Ranges
  "cheapest shoes": "Women Pointed Toe Slip-On Black Mules at ₹1,899! Sleek, minimalist, perfect for everyday office or casual wear.",
  "shoes under 2000": "Men Casual Retro Sneakers (₹1,999), Women Black Mules (₹1,899), Men Olive Green Chunky Sneakers (₹1,899).",
  "most expensive shoes": "Women Knee-High Leather Block Heel Boots and Women Dual-Tone Pointed Toe Heels both at ₹2,799! Chic winter fashion and elegant formal styling.",
  "heels under 2500": "Women Classic Pointed Heels Yellow & Red (₹2,199), Women Pastel Stiletto Heels (₹2,299).",
  "boots between 2500-3000": "Women Knee-High Leather Boots (₹2,799), Men Blue Chunky Sports Sneakers (₹2,799), Unisex Glossy Black Chelsea Boots (₹2,598), Unisex Brown Suede Sneakers (₹2,499), Men Black Suede Combat Boots (₹2,499), Women Black Patent Leather Heels (₹2,599).",
  "mens shoes under 2500": "Men Casual Retro Sneakers (₹1,999), Men Tan Brown Sneakers (₹2,299), Men Olive Green Chunky Sneakers (₹1,899), Unisex Brown Suede Sneakers (₹2,499), Men Black Suede Combat Boots (₹2,499), Women Chunky Pink Sneakers (₹2,365).",
  "womens heels between 2000-3000": "Women Classic Pointed Heels Yellow & Red (₹2,199), Women Pastel Stiletto Heels Green & Pink (₹2,299), Women Black Patent Leather Red Sole Heels (₹2,599), Women Dual-Tone Pointed Toe Heels Cream & Red (₹2,799), Women Knee-High Leather Block Heel Boots (₹2,799).",
  
  // Sunglasses Price Ranges
  "cheapest sunglasses": "Unisex Oversized Clear Frame Glasses at ₹899! Minimalist, oversized, iconic statement piece.",
  "sunglasses under 1000": "Unisex Clear Frame Glasses (₹899), Women Slim Green Oval Sunglasses (₹975), Unisex Ice Blue Matte Square (₹989), Unisex Mint Green Chunky Frame (₹999).",
  "most expensive sunglasses": "Unisex Octagon Gradient Blue Sunglasses and Women Oversized Matte Black Wrap Sunglasses both at ₹1,399! Bold statement pieces.",
  "sunglasses between 1000-1200": "Women White Cat-Eye (₹1,099), Women Slim Oval Tinted Red (₹1,125), Unisex Oversized Amber Shield (₹1,149), Unisex Yellow Transparent Square (₹1,050), Men's Classic Dark Rectangle (₹1,050), Women Oversized Transparent Red Round (₹1,199), Women Sharp Black Cat-Eye (₹1,199).",
  "womens sunglasses under 1100": "Women White Frame Slim Cat-Eye (₹1,099), Women Slim Green Oval (₹975).",
  "unisex sunglasses between 1200-1400": "Unisex Black & Gold Geometric Round (₹1,299), Unisex White Cat-Eye Statement (₹1,299), Unisex Octagon Gradient Blue (₹1,399).",
  
  // Price Range Questions
  "cheapest products": "Our most affordable products:\n- Women Round Neck Cotton Top (₹100)\n- Girls Round Neck Cotton Top (₹100)\n- Men Round Neck Pure Cotton T-shirt (₹110)",
  
  "price range tops": "Our tops range from ₹100 to ₹220:\n- Basic Cotton Tops: ₹100-₹130\n- Premium T-shirts: ₹140-₹200",
  
  // TOPWEAR COMPARISONS
  "compare womens blazer vs mens blazer": "Women's (Beige Blazer ₹6,547, Beige with Tank ₹3,240) are tailored, chic, office-ready. Men's (Plaid ₹5,300, Burgundy Wool ₹5,466, Printed ₹8,760) are structured, bold, fashion statements. Both offer power dressing!",
  
  "co-ord set vs separate pieces – which is better value": "Co-ord Sets (Beige Sweatshirt ₹2,999, Rust Knit Wide-Leg Pants ₹2,658) give you complete outfits instantly – effortless styling! Separates offer mix-and-match flexibility. Co-ords = convenience, Separates = versatility!",
  
  "wool coat vs bomber jacket – which is warmer": "Wool Coat (Red Oversized ₹4,200, Black Overcoat ₹6,450) are premium warm, structured – winter essentials! Bomber Jacket (White ₹3,450) is lighter, casual – spring/fall layering. Wool = maximum warmth, Bomber = transitional!",
  
  "floral blouse vs white blouse – which is more versatile": "White Blouses (V-neck ₹6,340, Cotton Shirt Set ₹2,899) are timeless, pair with everything – ultimate versatile! Floral Tie-Neck (₹1,580) is cheerful, vintage, statement – spring/summer charm. White = wardrobe staple, Floral = personality!",
  
  "mens silk shirt vs cotton shirt – which is better for summer": "Silk Shirt (Beige ₹4,600) is luxurious, smooth, party-ready – evening elegance! Cotton Shirt (Yellow Striped ₹2,977) is breathable, casual, everyday – practical comfort. Silk = luxury, Cotton = daily wear!",
  
  "tennis dress vs wrap dress – which is more comfortable": "Tennis Dress (₹3,345) is sporty, breathable, activewear – athletic comfort! Wrap Dress (Rust Linen ₹3,000) is breezy, flattering, summer elegant – elevated comfort. Tennis = athletic, Wrap = elegant ease!",
  
  "oversized sweater vs fitted sweater – which looks better": "Oversized (Blue Floral Knit ₹5,490, Rust Textured ₹3,500) are cozy, relaxed, trendy – casual chic! Fitted (Black Turtleneck ₹5,775) are sleek, polished, classic – sophisticated. Oversized = comfort trend, Fitted = timeless elegance!",

  // BOTTOMWEAR COMPARISONS
  "corduroy trousers vs beige trendy trousers – which is more formal": "Corduroy Brown (₹1,200) is tailored, textured, formal/semi-formal perfect – office meetings! Beige Trendy (₹1,600) is modern, fashion-forward – creative workplaces, smart casual. Corduroy = traditional formal, Beige = modern formal!",

  "pleated skirt vs maxi skirt – which is more elegant": "Both elegant! Pleated Skirt (White ₹1,300) is feminine, flowy, semi-formal – versatile chic! Maxi Skirt (Black Urban ₹1,600, Black Pleated ₹1,600) is sophisticated, floor-length – elevated elegance. Pleated = playful, Maxi = dramatic!",

  "wide-leg pants vs fitted pants – which is trendier": "Wide-Leg (Rust Knit Top Set ₹2,658) are modern, structured, street-style edge – very trendy! Fitted (Black Pleated ₹1,500) are classic, sleek, timeless – always stylish. Wide-leg = fashion-forward, Fitted = timeless!",

  "shorts vs trousers for summer – which is better": "Shorts (Men White Pleated ₹1,100) are cool, casual, perfect for hot days – maximum comfort! Trousers (Beige Trendy ₹1,600) are polished, versatile, office-appropriate – more formal. Shorts = casual summer, Trousers = smart summer!",

  "pinstriped pants vs solid black pants – which is more professional": "Both professional! Pinstriped (Women Striped Trousers Set ₹1,800, Grey Knit Cardigan Set ₹1,300) are sharp, traditional, business formal – classic power! Solid Black (Black Pleated ₹1,500, Grey Cardigan Set ₹1,400) are versatile, modern, easier to style. Pinstriped = corporate, Black = versatile pro!",

  // BAGS COMPARISONS
  "canvas tote vs leather bag – which is more durable": "Leather (Crossbody Set ₹2,649, Tan Shoulder Bag ₹998, Elegant Handbag ₹1,299) is premium, long-lasting, ages beautifully – investment pieces! Canvas (Brown Tote ₹429, Classic Tote ₹799) is sturdy, washable, casual – great value! Leather = luxury durability, Canvas = practical durability!",

  "tote bag vs crossbody bag – which is better for daily use": "Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) are spacious, shoulder-carry, fit laptops – everyday workhorse! Crossbody (Leather Set ₹2,649) is hands-free, compact, secure – travel-friendly! Tote = capacity, Crossbody = convenience!",

  "mini bag vs large tote – which should I buy": "Mini Bag (White Stylish ₹319) is cute, essentials only (phone, wallet, keys) – nights out, minimal days! Large Tote (Canvas ₹799, PU Leather Set ₹999) fits laptop, books, groceries – work, college, errands! Mini = light travel, Large = daily needs!",

  "brown canvas tote vs black canvas bag – which is more versatile": "Both versatile! Brown Canvas (₹429) is warm, pairs with earth tones, casual chic – boho vibes! Black Canvas (₹359) is sleek, minimalist, pairs with everything – modern edge. Brown = warm casual, Black = cool minimal!",

  "PU leather vs genuine leather – what's the difference": "PU Leather (Tote Set ₹999) is vegan, affordable, easy maintenance – great value! Genuine Leather (Crossbody Set ₹2,649, Elegant Handbag ₹1,299) is premium, ages beautifully, long-lasting – investment! PU = budget-friendly, Genuine = luxury!",

  "pearl handbag vs leather handbag – which is better for parties": "Pearl Beaded (₹1,890) is bold, luminous, statement-making – weddings, summer parties, unique! Leather Handbag with Gold Clasp (₹1,299) is chic, sophisticated, elegant – formal evening events! Pearl = show-stopper, Leather = refined elegance!",

  "shopping bag vs tote bag – what's the difference": "They're similar! Shopping Bags (Light Everyday ₹359) are lightweight, casual, grocery runs. Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) are sturdier, structured, fit more – work, college, daily carry. Both great for everyday!",

  // HATS COMPARISONS
  "wide brim hat vs fedora – which is more formal": "Wide Brim (Women Felt ₹1,349, Textured Evening ₹1,499) are elegant, dramatic, formal events – sophistication! Fedora (Men Classic ₹1,190) is polished, structured, smart-casual – refined but versatile. Wide Brim = formal elegance, Fedora = smart casual!",

  "straw hat vs felt hat – which is better for summer": "Straw Hat (Beach Wide Brim ₹1,049, Summer Boho ₹799) is breathable, lightweight, sun protection – summer essential! Felt Hat (Black Wide Brim ₹1,349) is heavier, structured – autumn/winter elegance. Straw = summer, Felt = cool weather!",

  "bucket hat vs baseball cap – which is trendier": "Bucket Hat (Animal Print Beige ₹699) is Y2K revival, festival fashion, unisex – very trendy! Baseball Cap (Abstract Camo ₹599) is classic streetwear, sporty, everyday – timeless cool. Bucket = fashion trend, Cap = street staple!",

  "mens hat vs womens hat – can I wear both": "Absolutely! Men's (Fedora ₹1,190, Abstract Cap ₹599) are classic, structured. Women's (Wide Brim ₹1,349, Straw Hat ₹1,049) are elegant, sun-protective. Unisex (Printed Bucket ₹699) works for everyone! Hats are for ALL!",

  "black hat vs beige hat – which is more versatile": "Black Hats (Wide Brim ₹1,349, Textured Brim ₹1,499) are dramatic, formal, pair with everything – sophisticated edge! Beige/Natural (Fedora ₹1,190, Straw Hats ₹799-₹1,049) are soft, casual, summery – warm vibes. Black = formal versatile, Beige = casual versatile!",

  // Product Comparisons - Accessories
  "hat vs bag": "Hats (Wide Brim ₹1,349, Fedora ₹1,190, Bucket Hat ₹699) add dramatic flair and sun protection! Bags (Canvas Totes ₹319-₹799, Leather ₹999-₹2,649) offer practical style. Consider occasion and needs!",

  // Jewelry Comparisons  
  "pearl necklace vs gold necklace": "Depends on your style! Pearl Layered Back Necklace (₹1,350) is elegant and dramatic for backless dresses. Gold Chain with Blue Crystal Hearts (₹1,599) is romantic and versatile for necklines. Pearls = classic formal, Gold = everyday charm!",
  "freshwater pearl beach choker vs chunky shell bead choker": "Beach Choker (₹780) is delicate, handcrafted, perfect for boho beach vibes. Shell Bead Choker (₹2,399) is bold, statement-making with gold detailing – more luxe! Beach = casual chic, Shell = bold glam.",
  "pearl jewelry vs crystal jewelry": "Pearls (Beach Choker ₹780, Layered Back ₹1,350) offer timeless elegance and natural beauty – perfect for formal events. Crystal (Gold Chain Blue Hearts ₹1,599, Amber Pendant ₹1,299) adds sparkle and color – great for romantic or evening looks!",
  "necklace for weddings": "Pearl Layered Back Necklace (₹1,350) is PERFECT for backless bridal gowns! Also great: Amber Crystal Pendant (₹1,299) for warm-toned evening elegance.",
  
  // Perfume Comparisons
  "flame essence vs wave eau": "Flame Essence (₹1,450) is bold, smoky spice with warm woods – evening statement scent. Wave Eau (₹1,799) is clean, aquatic with sea salt and white amber – daily freshness. Flame = drama, Wave = serenity!",
  "womens perfume vs unisex perfume": "Women's (Sheer Light ₹1,350, Sunfig Bloom ₹1,250) are softer, floral, citrus – delicate and feminine. Unisex (Flame Essence ₹1,450, Lum Eau ₹1,199) are bold, warm, versatile – anyone can rock them! Women's = gentle, Unisex = statement.",
  "tropical sunfig bloom vs subtle glow sheer light": "Sunfig Bloom (₹1,250) is vibrant, exotic with fig and jasmine – beach vacation energy! Sheer Light (₹1,350) is airy, light with citrus and white tea – everyday office-friendly. Sunfig = bold summer, Sheer = subtle elegance!",
  "luxury blue glass perfume vs premium glass set": "Blue Glass (₹890) is single designer bottle – luxe and affordable. Premium Set (₹1,299) gives you THREE bottles for gifting or variety! Set = better value, Blue = statement piece.",
  "citrus orange vs amber perfumes": "Both are Eau de Parfum (8-12 hours)! Citrus Orange (₹670) is fresh, zesty – energizing. Amber bottles (Square ₹620, Flame Essence ₹1,450) are warm, deeper – sophisticated. Citrus = daytime, Amber = all-day richness!",
  
  // Footwear Comparisons
  "yellow heels vs red heels": "Lemon Yellow (Classic Pointed ₹2,199) is playful, bold, pairs with neutrals and denim. Red (Classic Pointed ₹2,199) is classic power, works with black, white, beige. Yellow = fun statement, Red = timeless elegance! Both versatile!",
  "stiletto heels vs block heel boots": "Stiletto Heels (Pastel ₹2,299) are elegant, dressy, 3-3.5 inch – formal events, parties. Block Heel Boots (Knee-High ₹2,799) are comfortable, structured – winter fashion, office wear. Stiletto = glamour, Block = all-day comfort!",
  "sneakers vs boots winter": "Boots (Knee-High Leather ₹2,799, Chelsea ₹2,598, Combat ₹2,499) offer warmth, coverage, style – winter essentials! Sneakers (Chunky Blue ₹2,799) are sporty, casual but less warm. Boots = winter winner!",
  "mens tan sneakers vs maroon sneakers": "Tan Brown Sneakers (₹2,299) are sleek, minimal, neutral – office-casual versatile. Maroon Low Top (₹3,456) adds refined color pop – fashion-forward! Tan = everyday, Maroon = standout style!",
  "chelsea boots vs combat boots": "Chelsea Boots (Glossy Black ₹2,598) are sleek, slip-on – formal and semi-formal perfect! Combat Boots (Black Suede ₹2,499) are rugged, masculine – casual outdoor vibes. Chelsea = dress up, Combat = dress down!",
  "mules vs heels": "Mules (Black Pointed ₹1,899) are slip-on, flat/low – everyday office comfort! Heels (₹2,199-₹2,799) are elevated, 3-3.5 inch – glamorous but less comfy. Mules = comfort, Heels = elegance!",
  "pink sneakers vs olive green sneakers": "Pink Chunky Sneakers (₹2,365) are bold, elevated street style – fashion statement! Olive Green Chunky (₹1,899) are versatile, sporty – everyday cool. Pink = trendsetter, Olive = versatile cool!",
  
  // Sunglasses Comparisons
  "cat eye vs round sunglasses": "Cat-eye (White ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) are sharp, retro, suit angular faces – bold statement! Round (Red Oversized ₹1,199, Black & Gold Geometric ₹1,299) are softer, vintage, suit square faces – playful! Try both styles!",
  "white cat eye vs black cat eye": "White Frame (₹1,099) is futuristic, slim, daytime cool. Sharp Black (₹1,199) is dramatic, powerful, dark – evening edge. White = modern minimal, Black = bold power!",
  "oversized amber shield vs octagon gradient blue": "Both are PERFECT! Amber Shield (₹1,149) is sporty, futuristic, unisex – high-impact. Octagon Blue (₹1,399) is playful, golden frame, gradient – retro twist. Amber = sporty, Octagon = retro!",
  "mens sunglasses vs womens sunglasses": "Absolutely! Men's (Dark Rectangle ₹1,050) are classic, sharp, timeless. Women's (Cat-eye, Oval styles) are bold, fashion-forward. Unisex options (Amber Shield ₹1,149, Octagon Blue ₹1,399, Mint Green ₹999) work for EVERYONE! Style has no gender!",
  "transparent vs solid frames": "Transparent (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) are bold, playful, Y2K vibes – super trendy! Solid (Black Cat-Eye ₹1,199, White Frame ₹1,099) are classic, versatile – timeless. Transparent = fashion-forward, Solid = always chic!",
  "sunglasses uv protection": "YES! Every single pair has 100% UV400 protection. All come with protective case and cleaning cloth. Style AND safety guaranteed!",
  "frosted steel blue cat eye vs slim green oval": "Steel Blue (₹1,249) is icy, sharp, futuristic – unforgettable statement! Green Oval (₹975) is sleek, moss-toned, minimalist – modern taste. Steel = avant-garde, Green = understated cool!",
  
  // Category Browsing - Jewelry
  "what jewelry do you have": "9 stunning pieces! Pearl necklaces (Layered Back ₹1,350, Beach Choker ₹780, Gold Layered Set ₹990, Pearl Layered ₹2,699, Statement Pearl ₹2,899), Crystal jewelry (Gold Chain Blue & Crystal Hearts ₹1,599, Amber Crystal Pendant ₹1,299), Statement pieces (Chunky Shell Bead Choker ₹2,399). All handcrafted!",
  
  "do you have pearl jewelry": "Yes! 6 pearl pieces: Layered Back Necklace (₹1,350) - perfect for backless dresses, Freshwater Beach Choker (₹780) - boho vibes, Pearl & Gold Layered Set (₹990) - everyday elegance, Pearl Layered Necklace (₹2,699) - resort glamour, Statement Pearl (₹2,899) - artistic bold. All genuine freshwater pearls!",
  
  "show me necklaces": "All 9 jewelry items are necklaces! From chokers (Beach Choker ₹780, Shell Bead ₹2,399) to layered pieces (Back Necklace ₹1,350, Gold Layered Set ₹990) to pendants (Amber Crystal ₹1,299, Gold Chain Hearts ₹1,599).",
  
  "do you have accessories": "Yes! Jewelry (9 necklaces ₹780-₹2,899), Sunglasses (17 styles ₹899-₹1,399), Bags (13 styles ₹319-₹2,649), Hats (8 styles ₹599-₹1,499). Complete your look!",
  
  "women jewelry only": "All 9 jewelry pieces are for women! Pearl necklaces, crystal pendants, chokers, statement pieces. Prices ₹780-₹2,899.",

  // Category Browsing - Perfumes
  "what perfumes do you sell": "12 premium fragrances! Unisex (Flame Essence ₹1,450, Lum Eau ₹1,199, Wave Eau ₹1,799, Citrus Orange ₹670, Minimalist Cube ₹580), Women's (Sheer Light ₹1,350, Sunfig Bloom ₹1,250, Round Bottle ₹450, Blue Glass ₹890, Square Amber ₹620, Soft Teardrop ₹720), Sets (Premium Glass Set ₹1,299). All Eau de Parfum!",
  
  "do you have womens perfumes": "7 women's fragrances! Sheer Light (₹1,350) - citrus & white tea, daily wear, Sunfig Bloom (₹1,250) - tropical floral, summer garden, Blue Glass Perfume (₹890) - luxury designer bottle, Square Amber Glow (₹620) - classic warm floral, Elegant Round Bottle (₹450) - minimalist gift, Soft Teardrop (₹720) - earthy musky, Premium Glass Set (₹1,299) - trio for gifting!",
  
  "show me unisex fragrances": "5 unisex perfumes! Flame Essence (₹1,450) - smoky spice & warm woods, Lum Eau (₹1,199) - amber, vetiver & musk, Wave Eau (₹1,799) - sea salt & white amber, Citrus Orange (₹670) - zesty fresh energy, Minimalist Cube (₹580) - clean modern scent!",
  
  "do you have perfume gift sets": "Yes! Premium Glass Perfume Set (₹1,299) - luxury trio of bottles, beautifully packaged, perfect for gifting! All individual perfumes also come gift-ready.",
  
  "long lasting perfumes": "ALL our perfumes are Eau de Parfum concentration - 8-12 hour wear! Top picks: Flame Essence (₹1,450), Wave Eau (₹1,799), Lum Eau (₹1,199).",

  // Category Browsing - Footwear
  "what shoes do you have": "15 styles! Men's (sneakers ₹1,899-₹3,456, Chelsea boots ₹2,598, combat boots ₹2,499), Women's (heels ₹2,199-₹2,799, knee-high boots ₹2,799, mules ₹1,899, chunky sneakers ₹2,365), Unisex (brown suede sneakers ₹2,499, black Chelsea boots ₹2,598).",
  
  "long lasting perfumes": "ALL our perfumes are Eau de Parfum concentration - 8-12 hour wear! Top picks: Flame Essence (₹1,450), Wave Eau (₹1,799), Lum Eau (₹1,199).",
  
  "womens topwear": "21 styles! Casual (Rust Ribbed Cotton Top ₹1,450, Floral Tie-Neck Blouse ₹1,580, Beige Co-ord Sweatshirt ₹2,999, White V-neck ₹6,340), Formal (White Cotton Shirt Set ₹2,899, Beige Blazer Sets ₹3,240-₹6,547), Dresses (Rust Linen Wrap ₹3,000, Black Jacket Dress ₹3,977, Tennis Dress ₹3,345), Winter (Rust Knit Sweater ₹3,500, Red Wool Coat ₹4,200, Black Turtleneck ₹5,775, Blue Floral Knit ₹5,490, Cardigans ₹3,986-₹5,679).",
  
  "mens topwear": "12 styles! Shirts (Yellow Striped Cotton ₹2,977, Beige Silk ₹4,600), Blazers (Plaid with Turtleneck ₹5,300, Burgundy Wool ₹5,466, Printed Suit ₹8,760), Suits (Black with Burgundy Shirt ₹4,350), Jackets (White Bomber ₹3,450, Mustard Yellow Zip ₹5,630, Olive Green Zip ₹3,456), Winter (Black Wool Overcoat ₹6,450, Green Turtleneck ₹3,489, White Knitted Vest ₹8,765).",
  
  "womens hats": "5 styles! Wide Brim Felt Hat (₹1,349) - elegant black formal, Textured Brim Hat (₹1,499) - evening black dramatic, Straw Sun Hat (₹1,049) - beach wide brim, Straw Hat Summer Boho (₹799) - woven natural, Textured Teal Wide Brim (₹899) - bold fashion statement!",
  
  "mens hats": "2 styles! Classic Fedora Beige & Brown Band (₹1,190) - polished smart-casual, Abstract Camouflage Cap (₹599) - red-beige streetwear! Plus unisex Printed Bucket Hat works great for men!",
  
  "show me womens footwear": "8 women's styles! Heels (Classic Pointed Yellow & Red ₹2,199, Pastel Stiletto Green & Pink ₹2,299, Dual-Tone Cream & Red ₹2,799, Black Patent Red Sole ₹2,599), Boots (Knee-High Leather Block Heel ₹2,799), Mules (Pointed Toe Black ₹1,899), Sneakers (Chunky Pink ₹2,365).",
  
  "mens shoes": "7 men's styles! Sneakers (Retro Striped ₹1,999, Tan Brown ₹2,299, Brown Suede ₹2,499, Blue Chunky Sports ₹2,799, Olive Chunky ₹1,899, Maroon Low Top ₹3,456), Boots (Glossy Black Chelsea ₹2,598, Black Suede Combat ₹2,499).",
  
  "do you have heels": "Yes! 5 stunning styles: Classic Pointed Yellow & Red (₹2,199) - retro playful, Pastel Stiletto Green & Pink (₹2,299) - elegant brunch-ready, Black Patent Red Sole (₹2,599) - sultry night-out, Dual-Tone Cream & Red (₹2,799) - formal chic. All 3-3.5 inch mid-heels!",
  
  "show me boots": "3 boot styles! Women's Knee-High Leather Block Heel (₹2,799) - chic winter fashion, Men's Glossy Black Chelsea (₹2,598) - formal sleek, Men's Black Suede Combat (₹2,499) - rugged outdoor. Plus unisex Chelsea boots!",
  
  "casual shoes": "Sneakers - Men's Retro (₹1,999), Tan Brown (₹2,299), Olive Chunky (₹1,899), Women's Pink Chunky (₹2,365), Unisex Brown Suede (₹2,499). Mules - Women's Black Pointed (₹1,899). All comfortable daily wear!",
  
  "formal footwear": "Women's Heels (₹2,199-₹2,799) - all styles work for formal events, Men's Chelsea Boots (₹2,598) - polished formal, Women's Knee-High Boots (₹2,799) - structured elegance.",
  
  // Category Browsing - Topwear
  "what tops do you have": "33 pieces! Women's (21 styles ₹1,450-₹6,879), Men's (12 styles ₹2,977-₹8,765). Includes blouses, blazers, sweaters, coats, dresses, cardigans, turtlenecks, shirts, jackets!",
  
  "womens topwear": "21 styles! Casual (Rust Ribbed Cotton Top ₹1,450, Floral Tie-Neck Blouse ₹1,580, Beige Co-ord Sweatshirt ₹2,999, White V-neck ₹6,340), Formal (White Cotton Shirt Set ₹2,899, Beige Blazer Sets ₹3,240-₹6,547), Dresses (Rust Linen Wrap ₹3,000, Black Jacket Dress ₹3,977, Tennis Dress ₹3,345), Winter (Rust Knit Sweater ₹3,500, Red Wool Coat ₹4,200, Black Turtleneck ₹5,775, Blue Floral Knit ₹5,490, Cardigans ₹3,986-₹5,679).",
  
  "mens topwear": "12 styles! Shirts (Yellow Striped Cotton ₹2,977, Beige Silk ₹4,600), Blazers (Plaid with Turtleneck ₹5,300, Burgundy Wool ₹5,466, Printed Suit ₹8,760), Suits (Black with Burgundy Shirt ₹4,350), Jackets (White Bomber ₹3,450, Mustard Yellow Zip ₹5,630, Olive Green Zip ₹3,456), Winter (Black Wool Overcoat ₹6,450, Green Turtleneck ₹3,489, White Knitted Vest ₹8,765).",
  
  "do you have blazers": "Yes! Women's (Beige Blazer Turtleneck Set ₹6,547, Beige Blazer White Tank ₹3,240, Black Jacket Dress ₹3,977), Men's (Plaid Blazer Brown Turtleneck ₹5,300, Burgundy Wool Blazer ₹5,466, Printed Suit Blazer ₹8,760, Black Suit ₹4,350).",
  
  "show me dresses": "3 women's dresses! Off-Shoulder Rust Linen Wrap Dress (₹3,000) - summer elegance, Black Oversized Jacket Dress (₹3,977) - streetwear charm, Tennis Dress with Green Accent (₹3,345) - sporty chic!",
  
  "winter wear": "Women's (Rust Textured Knit Sweater ₹3,500, Red Oversized Wool Coat ₹4,200, Rust Cardigan ₹3,986, Black Turtleneck ₹5,775, Blue Floral Knit ₹5,490, Olive Trench Coat ₹6,879, Striped Sweater ₹4,567), Men's (Black Wool Overcoat ₹6,450, Green Turtleneck ₹3,489, White Knitted Vest ₹8,765, Burgundy Wool Blazer ₹5,466).",
  
  "casual tops": "Women's (Rust Ribbed Cotton ₹1,450, Floral Tie-Neck ₹1,580, Beige Co-ord Sweatshirt ₹2,999, White V-neck ₹6,340, White Linen Shirt ₹5,679), Men's (Yellow Striped Shirt ₹2,977, White Bomber Jacket ₹3,450).",

  // Category Browsing - Bottomwear
  "what bottomwear do you have": "14 styles! Men's (trousers, pants, shorts, cargo pants), Women's (pleated pants, skirts, trousers, wide-leg pants). Prices ₹1,100-₹1,800.",
  
  "show me trousers": "Men's (Corduroy Brown ₹1,200, Beige Trendy ₹1,600, Beige Cargo Pants ₹1,200), Women's (White Formal Pleated Pants ₹1,400, Black Pleated Pants ₹1,500, Black Striped Trousers Set ₹1,800, Light Gray Pants ₹1,500), Unisex (Neutral Beige Trousers ₹1,500).",
  
  "womens bottomwear": "9 styles! Pants (White Formal Pleated ₹1,400, Black Pleated ₹1,500, Light Gray Formal ₹1,500, Rust Knit Wide-Leg ₹2,658, Grey Knit Pinstriped ₹1,300), Skirts (White Pleated ₹1,300, Black Urban Maxi ₹1,600, Black Maxi Pleated ₹1,600), Sets (Black Striped Trousers with Blazer ₹1,800).",
  
  "mens trousers": "5 styles! Corduroy Brown Trousers (₹1,200) - formal/semi-formal, Beige Trendy Trousers (₹1,600) - modern fashion, Grey Cardigan with Black Pants (₹1,400), Beige Cargo Pants (₹1,200) - street style, White Pleated Shorts (₹1,100) - summer casual!",
  
  "do you have skirts": "3 women's skirts! White Pleated Skirt (₹1,300) - chic feminine, Black Urban Maxi Skirt (₹1,600) - elegant timeless, Black Maxi Pleated Skirt (₹1,600) - sophisticated floor-length!",
  
  "formal pants": "Men's (Corduroy Brown ₹1,200, Beige Trendy ₹1,600), Women's (White Formal Pleated ₹1,400, Black Pleated ₹1,500, Light Gray Formal ₹1,500, Black Striped Set ₹1,800).",

  // Category Browsing - Bags
  "what bags do you sell": "13 styles! Tote bags (canvas ₹319-₹799, leather ₹999-₹2,649), Crossbody (leather ₹2,649), Shoulder bags (leather ₹998-₹1,299), Clutches (pearl handbag ₹1,890), Shopping bags (₹359-₹469). Something for everyone!",
  
  "womens bags": "11 styles! Canvas Totes (Brown ₹429, Classic ₹799, Black ₹359, Printed ₹469, Pastel Summer ₹429, White Mini ₹319), Leather (Crossbody Set ₹2,649, Tan Shoulder Bag ₹998, PU Tote Set ₹999, Elegant Handbag ₹1,299, Pearl Handbag ₹1,890), Party (Quilted Green ₹749).",
  
  "show me tote bags": "8 tote styles! Canvas (Brown ₹429 - bestseller!, Classic ₹799, Black ₹359, Printed ₹469, Pastel Summer ₹429, White Mini ₹319, Light Shopping ₹359), Leather (PU Tote Set ₹999 - 3 colors!).",
  
  "do you have leather bags": "5 leather styles! Crossbody Set Tan & Beige (₹2,649) - premium structured, Tan Shoulder Bag (₹998) - everyday office, PU Leather Tote Set (₹999) - 3 classic shades, Elegant Handbag with Gold Clasp (₹1,299) - party-ready, Pearl Beaded Handbag (₹1,890) - wedding statement!",
  
  "everyday bags": "Canvas Totes (Brown ₹429, Classic ₹799, Black ₹359) - spacious, washable, laptop-friendly! Tan Leather Shoulder Bag (₹998) - structured daily carry. Perfect for work, college, errands!",
  
  "party bags": "Quilted Style Party Tote (₹749) - glossy green trendy, Elegant Leather Handbag with Gold Clasp (₹1,299) - wine red sophisticated, Pearl Beaded Handbag (₹1,890) - luminous statement for weddings!",

  // Category Browsing - Hats
  "what hats do you have": "8 styles! Women's (5 styles ₹699-₹1,499), Men's (2 styles ₹599-₹1,190), Unisex (1 style ₹699). Wide brim, fedoras, bucket hats, sun hats, caps!",
  
  "womens hats": "5 styles! Wide Brim Felt Hat (₹1,349) - elegant black formal, Textured Brim Hat (₹1,499) - evening black dramatic, Straw Sun Hat (₹1,049) - beach wide brim, Straw Hat Summer Boho (₹799) - woven natural, Textured Teal Wide Brim (₹899) - bold fashion statement!",
  
  "mens hats": "2 styles! Classic Fedora Beige & Brown Band (₹1,190) - polished smart-casual, Abstract Camouflage Cap (₹599) - red-beige streetwear! Plus unisex Printed Bucket Hat works great for men!",
  
  "do you have sun hats": "3 styles! Women's Straw Sun Hat Beach Wide Brim (₹1,049) - max sun protection tropical, Women's Straw Hat Summer Boho (₹799) - woven natural beige, Unisex Printed Bucket Hat (₹699) - animal print casual!",
  
  "wide brim hats": "4 styles! Women's Elegant Black Felt (₹1,349), Women's Textured Evening Black (₹1,499), Women's Straw Beach (₹1,049), Women's Textured Teal (₹899). All dramatic, sun-protective, statement-making!",
  
  "casual hats": "Printed Bucket Hat (₹699) - animal print beige, Abstract Camo Cap (₹599) - red-beige streetwear, Straw Hats (₹799-₹1,049) - summer boho!",

  // Material and Quality
  "cotton products": "All our cotton products:\n- Women Round Neck Cotton Top\n- Men Round Neck Pure Cotton T-shirt\n- Girls Round Neck Cotton Top\nAll made with high-quality cotton fabric.",
  
  // Bestsellers
  "bestsellers": "Our top sellers include:\n- Women Classic Pointed Heels (₹2,199)\n- Pearl Layered Back Necklace (₹1,350)\n- Unisex Octagon Gradient Blue Sunglasses (₹1,399)\n- Women Knee-High Leather Boots (₹2,799)\n- Wave Eau Perfume (₹1,799)",
  // Category Browsing - Sunglasses
  "what sunglasses do you sell": "17 styles! Women's (7 styles ₹975-₹1,399), Men's (1 style ₹1,050), Unisex (9 styles ₹899-₹1,399). All 100% UV400 protected with case + cleaning cloth!",
  
  "womens sunglasses": "7 styles! White Frame Slim Cat-Eye (₹1,099) - futuristic, Oversized Transparent Red Round (₹1,199) - retro glam, Sharp Black Cat-Eye (₹1,199) - dramatic edge, Frosted Steel Blue Cat-Eye (₹1,249) - icy statement, Slim Oval Tinted Red (₹1,125) - bold compact, Slim Green Oval (₹975) - minimalist modern, Rimless Tinted Winged (₹1,320) - avant-garde!",
  
  "mens sunglasses": "Men's Classic Dark Tinted Rectangle Sunglasses (₹1,050) - timeless sharp everyday cool! Plus 9 unisex styles that work perfectly for men.",
  
  "unisex sunglasses": "9 styles! Octagon Gradient Blue (₹1,399), Black & Gold Geometric Round (₹1,299), Mint Green Chunky Frame (₹999), Oversized Amber Shield (₹1,149) - bestseller!, White Cat-Eye Statement (₹1,299), Yellow Transparent Square (₹1,050), Ice Blue Matte Square (₹989), Clear Frame Glasses (₹899), Oversized Matte Black Wrap (₹1,399).",
  
  "cat eye sunglasses": "4 styles! White Frame Slim (₹1,099), Sharp Black (₹1,199), Frosted Steel Blue (₹1,249), White Cat-Eye Statement (₹1,299) unisex. Bold retro vibes!",
  
  "do all sunglasses have uv protection": "YES! Every single pair has 100% UV400 protection against UVA and UVB rays. All include protective case and cleaning cloth!",
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

  // Size & Fit Questions - Topwear
  "what sizes do womens tops come in": "Most women's tops come in XS, S, M, L, XL. Some exclusive pieces have limited runs - check individual product pages! Rust Ribbed Cotton Top (XS-L), Beige Co-ord Sweatshirt (S-XL), Red Wool Coat (M-XL), Blazers (S-L).",
  
  "what sizes do mens tops come in": "Men's tops typically come in M, L, XL. Yellow Striped Shirt (M-XL), Blazers (M-XL), Sweaters (S-XL), Jackets (M-XL). Check each product page for specific availability!",
  
  "do blazers run small or large": "Our blazers run true to size with tailored fits. Women's blazers are structured but not tight. Men's blazers offer classic fit with room for layering shirts/turtlenecks underneath. Check Size Guide for chest and shoulder measurements!",
  
  "how do i measure for a blazer": "Measure your chest (fullest part around bust/chest), shoulders (across back from shoulder point to shoulder point), sleeve length (from shoulder to wrist). Compare to our Size Guide on product page!",
  
  "what size sweater should i get for layering": "If you want to layer shirts/turtlenecks underneath, size up one size for comfort. For fitted look worn alone, stick to true size. Our oversized sweaters (Rust ₹3,500, Blue Floral ₹5,490) are intentionally roomy!",
  
  "are dresses true to size": "Yes! Rust Linen Wrap Dress (M-XL), Tennis Dress (S-L), Black Jacket Dress (S-L) all run true to size. Wrap dress is adjustable at waist for flexible fit. Check Size Guide for bust, waist, hip, and length measurements!",
  
  "how long are the coats": "Red Wool Coat is knee-length to mid-thigh, Black Overcoat is mid-thigh to knee, Olive Trench Coat is knee-length. Exact lengths in Size Guide! All designed for elegant proportions without overwhelming your frame.",
  
  "do coord sets come in separate sizes": "No, co-ord sets (Beige Sweatshirt ₹2,999, Rust Knit Wide-Leg ₹2,658) are sold as matching size sets - top and bottom same size. If you need different sizes for top/bottom, purchase separates instead!",

  // Size & Fit Questions - General
  "how do i know my size": "Check our detailed Size Guide on each product page! We provide measurements for chest, waist, hips, length, and inseam for accurate fitting. Measure yourself and compare to our charts. If between sizes, we recommend sizing up for comfort!",
  
  "what if size doesnt fit": "No worries! You can return or exchange within 30 days. We offer FREE size exchanges - just pay return shipping (or it's free if item is defective). Go to My Orders → Select item → Click 'Exchange' → Choose new size!",
  
  "are your products true to size": "YES! Most products run true to size. Check customer reviews on product pages for real fit feedback from actual buyers. Our Size Guide provides exact measurements so you can compare with your own clothing!",
  
  "do you offer plus sizes": "Our size range varies by product - most go up to XL. Check individual product pages for specific size availability. We're working on expanding our size range to be more inclusive!",
  
  "can i get custom sizing": "Currently we offer standard sizes only. Use our detailed Size Guide to find your best fit, and remember we offer FREE size exchanges if needed!",

  // CROSS-CATEGORY COMPARISONS
  "should i buy jewelry or sunglasses with 1200": "Both great! Jewelry (Pearl Choker ₹780, Layered Set ₹990) adds elegance, lasts forever, formal events. Sunglasses (Cat-Eye ₹1,099-₹1,199, Amber Shield ₹1,149) offer UV protection, daily style, summer essential. Jewelry = timeless investment, Sunglasses = practical style!",

  "perfume vs bag – which is better as a gift": "Both perfect! Perfume (Premium Set ₹1,299, Flame Essence ₹1,450) is personal, luxurious, everyone loves fragrance! Bags (Canvas Tote ₹429, Leather Handbag ₹1,299) are practical, daily use, visible style. Perfume = intimate luxury, Bag = practical chic!",

  "heels vs sneakers – which should i invest in": "Invest in BOTH! Heels (Classic Pointed ₹2,199, Stiletto ₹2,299) for formal events, parties, dates – elegance! Sneakers (₹1,899-₹2,799) for daily comfort, travel, casual outings – versatility. Heels = occasions, Sneakers = everyday!",

  "winter coat vs summer dress – which is better value": "Winter Coat (Red Wool ₹4,200, Black Overcoat ₹6,450) is high-investment, lasts years, cold-weather essential – wear for months! Summer Dress (Rust Linen Wrap ₹3,000, Tennis Dress ₹3,345) is seasonal, lighter use – less wear time. Coat = long-term value, Dress = seasonal joy!",

  "hat vs bag – which completes an outfit better": "Both! Hats (₹599-₹1,499) add personality, sun protection, statement style – face-framing! Bags (₹319-₹2,649) are practical, carry essentials, visible accessory – functional style. Hat = personality, Bag = practicality! Get both!",

  // JEWELRY FEATURES
  "tell me about the pearl layered back necklace": "Women Pearl Layered Back Necklace (₹1,350) - An elegant multi-strand pearl necklace designed to drape gracefully down your back. Perfect for low-back dresses or gowns! Features genuine freshwater pearls in a timeless design. Adds sophisticated drama to formal ensembles, weddings, and evening events. Comes with protective storage pouch.",

  "what material is the jewelry made of": "Our jewelry features genuine freshwater pearls, crystal pendants, gold-toned chains, and shell beads. All pieces are handcrafted with premium materials for quality and durability. Hypoallergenic metals used for sensitive skin!",

  "are the pearls real": "YES! Our pearl jewelry features genuine freshwater pearls - natural, lustrous, and unique. Each pearl has slight variations that prove authenticity. High-quality handcrafted pieces that last!",

  "can i wear pearl jewelry daily": "Absolutely! Our Pearl & Gold Layered Necklace Set (₹990) and other minimalist designs are perfect for everyday wear. Just avoid direct contact with perfume, water, and harsh chemicals. Wipe gently after each wear to maintain luster!",

  "whats special about the beach choker": "Freshwater Pearl Beach Choker (₹780) is handcrafted with sea-green beads, freshwater pearls, and a delicate crystal drop charm. Perfect for beach days, boho outfits, vacation wear! Lightweight, catches sunlight beautifully, and pairs with casual summer looks.",

  "which necklace is best for backless dresses": "Pearl Layered Back Necklace (₹1,350) is SPECIFICALLY designed for low-back and backless dresses! The multi-strand design drapes elegantly down your spine, creating a stunning focal point. Perfect for formal gowns, bridal wear, and evening events.",

  "do necklaces come with packaging": "Yes! All jewelry comes with protective storage pouches. Perfect for gifting or safe storage when not wearing!",

  // PERFUME FEATURES
  "tell me about flame essence perfume": "Unisex Luxury Amber Glass Perfume - Flame Essence (₹1,450) - A bold, sophisticated fragrance with notes of smoky spice and warm woods. Housed in a jewel-like amber glass bottle with luxe presentation. Perfect evening statement scent. Eau de Parfum concentration lasts 8-12 hours. Unisex appeal for confident wearers!",

  "how long do perfumes last": "ALL our perfumes are Eau de Parfum concentration - lasting 8-12 hours! Higher concentration than Eau de Toilette means better longevity and richer scent. Apply to pulse points for maximum lasting power!",

  "whats the difference between womens and unisex perfumes": "Women's perfumes (Sheer Light, Sunfig Bloom) feature softer, floral, citrus notes - delicate and feminine. Unisex perfumes (Flame Essence, Wave Eau, Lum Eau) have bolder, deeper notes like amber, musk, woody spices - versatile for anyone! Choose based on your scent preference, not gender!",

  "what does sunfig bloom smell like": "Women's Tropical Floral 'Sunfig Bloom' (₹1,250) - A bright, exotic fragrance blending fig, jasmine, and neroli. Smells like a summer garden in full bloom! Perfect for beach vacations, warm weather, and bringing tropical vibes to any day. Fresh, fruity, floral - irresistibly cheerful!",

  "do perfumes come in gift packaging": "Yes! All perfumes come beautifully packaged in designer glass bottles. Our Premium Glass Perfume Set (₹1,299) is specifically a luxury trio for gifting. Perfect presentation for birthdays, anniversaries, special occasions!",

  "whats eau de parfum": "Eau de Parfum (EDP) is a perfume concentration with 15-20% fragrance oils - higher than Eau de Toilette (5-15%). This means stronger scent, better longevity (8-12 hours), richer aroma. Premium quality that lasts all day with fewer reapplications!",

  "which perfume is best for daily office wear": "Women's Subtle Glow 'Sheer Light' (₹1,350) - Light, airy with notes of citrus blossom, white tea, and musk. Not overpowering, professional, fresh all day. Perfect for office environments where you want to smell good without being too bold!",

  "are perfume bottles refillable": "Our perfumes come in sealed designer glass bottles. While not designed for refilling, the beautiful bottles make stunning décor pieces even after use! Collectible designs.",

  // FOOTWEAR FEATURES
  "what heel height are your heels": "Most heels are 3-3.5 inch mid-heels - the perfect balance between elegance and comfort! High enough to elongate legs and look sophisticated, but comfortable enough for all-day wear at events, parties, and office settings.",

  "are heels comfortable": "YES! Our heels feature cushioned insoles, quality materials, and practical 3-3.5 inch mid-heights. Block heels (Knee-High Boots ₹2,799) offer extra stability. Designed for real wear - weddings, parties, office - not just photos! Stilettos are elegant but best for shorter durations.",

  "tell me about the classic pointed heels": "Women Classic Pointed Heels Lemon Yellow & Red (₹2,199) - Retro-inspired dual-tone heels with pointed toes and 3-inch mid-height. Playful lemon yellow paired with fire red creates bold, versatile statement. Perfect for parties, formal events, making fashion statements. Comfortable for all-day wear. Bestseller!",

  "what material are boots made of": "Women's Knee-High Boots (₹2,799) - Premium leather with block heels, square toe. Men's Chelsea Boots (₹2,598) - Glossy leather slip-on. Men's Combat Boots (₹2,499) - Black suede with rugged sole. All high-quality, durable materials built to last!",

  "are sneakers good for running": "Our sneakers are designed for casual wear, streetwear, and everyday comfort - walking, errands, travel, fashion. For serious running, we recommend specialized athletic running shoes. Our Chunky Sports Sneakers (₹2,799) work for gym sessions and light workouts!",

  "do shoes come in half sizes": "Our shoes come in standard full sizes. Check our detailed Size Guide on each product page for exact measurements (length, width). If between sizes, we recommend sizing up for comfort. FREE size exchanges available!",

  "whats special about chelsea boots": "Unisex Glossy Black Chelsea Boots (₹2,598) - Sleek slip-on design with elastic side panels, no laces needed! Polished glossy finish perfect for modern formal and semi-formal looks. Easy on/off, versatile styling, works for any gender. Premium leather construction!",

  "are mules comfortable for all-day wear": "YES! Women Pointed Toe Black Mules (₹1,899) - Slip-on design, flat/low heel, sleek minimalist style. Perfect for everyday office wear or casual outings. No straps or laces means effortless comfort. Pairs with everything from jeans to professional trousers!",

  // SUNGLASSES FEATURES
  "do sunglasses have uv protection": "YES! Every single pair has 100% UV400 protection - shields your eyes from harmful UVA and UVB rays. Style meets safety! All sunglasses also come with protective case and cleaning cloth included.",

  "what does uv400 mean": "UV400 protection blocks 99-100% of UVA and UVB rays (up to 400 nanometers wavelength). This is the highest level of UV protection available in sunglasses! Protects your eyes from sun damage, cataracts, and harmful rays. Medical-grade protection with fashion!",

  "tell me about the amber shield sunglasses": "Unisex Oversized Amber Shield Sunglasses (₹1,149) - BESTSELLER! Sporty meets futuristic with wraparound shield design and warm amber tint. Oversized coverage, perfect for festivals, road trips, high-impact street styling. 100% UV400 protected. Unisex design works for everyone!",

  "do sunglasses come with cases": "YES! Every pair includes a protective case and microfiber cleaning cloth in the box. Keep your sunglasses safe when not wearing and clean lenses without scratches!",

  "whats the difference between cat-eye and round sunglasses": "Cat-eye (White Frame ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) - Sharp, upswept edges, retro 50s-60s vibe, dramatic and bold. Flatters angular faces. Round (Red Oversized ₹1,199, Black & Gold ₹1,299) - Soft circular lenses, vintage 70s vibe, playful and softer. Flatters square faces. Both iconic styles!",

  "are transparent frames trendy": "SUPER trendy! Transparent frames (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) are Y2K revival fashion - bold, playful, Instagram-worthy! Show off your face shape while making a statement. Very popular right now!",

  "can men wear womens sunglasses": "Absolutely! Sunglasses have no gender - it's all about face shape and personal style! We also have 9 unisex styles (₹899-₹1,399) designed specifically to work for everyone. Try what you love!",

  "whats special about frosted steel blue cat-eye": "Women's Frosted Cat-Eye in Steel Blue (₹1,249) - Icy, sharp, futuristic silhouette that cuts through ordinary! Frosted finish gives unique texture, steel blue color is bold yet cool-toned. Statement-making, unforgettable, avant-garde style. Perfect for fashion-forward looks!",

  // TOPWEAR FEATURES
  "tell me about the red wool coat": "Women Red Oversized Wool Blend Coat (₹4,200) - Command attention with this bold red oversized design! Tailored in soft wool blend for premium warmth and elegance. Features broad lapels, plush texture, structured yet comfortable fit. Pairs seamlessly with minimalist innerwear. Perfect winter statement piece for making an entrance!",

  "what material are sweaters made of": "Our sweaters are knitted fabrics - some are textured knit (Rust ₹3,500), wool blend (Red Coat ₹4,200, Black Overcoat ₹6,450, Burgundy Blazer ₹5,466), cotton blend, and ribbed materials. Cozy, warm, breathable for fall/winter comfort!",

  "are blazers machine washable": "Wool and structured blazers should be dry cleaned or hand washed to maintain shape and quality. Cotton blazers can be machine washed on gentle cycle with cold water. Always check care labels! Proper care ensures longevity.",

  "whats a co-ord set": "Co-ord set = coordinated outfit set - matching top and bottom pieces designed to be worn together! Examples: Beige Sweatshirt Set (₹2,999) - sweatshirt + joggers, Rust Knit Wide-Leg Pants (₹2,658) - knit top + wide-leg trousers. Effortless styling, complete look in one purchase!",

  "tell me about the tennis dress": "Women Tennis Dress with Green Accent (₹3,345) - Stylish, modern athletic dress with sleek white design and green accents. Breathable fabric, flattering fit, built-in shorts. Perfect for actual tennis, sports activities, OR casual athleisure looks! Comfort meets style for active lifestyles.",

  "what sizes do tops come in": "Most items come in XS, S, M, L, XL. Some exclusive pieces have limited size runs - check individual product pages for specific availability and our detailed Size Guide with measurements!",

  "is silk comfortable for summer": "YES! Men Beige Silk Shirt (₹4,600) - Silk is naturally temperature-regulating, breathable, and lightweight. Feels cool against skin in summer heat while looking luxurious. Perfect for summer parties, vacations, evening gatherings. Smooth, comfortable, elegant!",

  "whats the difference between a blazer and a suit": "Blazer = structured jacket worn with non-matching pants (mix & match styling). Suit = matching jacket + pants set (coordinated formal look). We have both! Blazers offer more versatility, suits offer polished formality.",

  // BOTTOMWEAR FEATURES
  "tell me about corduroy brown trousers": "Men Corduroy Brown Trousers (₹1,200) - Stylish corduroy fabric with distinctive ribbed texture and tailored fit. Perfect for formal and semi-formal occasions - office meetings, smart-casual events. Timeless brown color pairs with everything. Available in M, L, XL. Versatile wardrobe essential!",

  "whats the difference between pleated and flat-front pants": "Pleated pants (White Pleated ₹1,300, Black Pleated ₹1,500) have fabric folds at waistband - adds volume, movement, vintage charm, comfortable fit. Flat-front pants are smooth at waist - sleek, modern, streamlined look. Both stylish - choose based on preference!",

  "are trousers machine washable": "Cotton and linen trousers - YES, machine wash cold, gentle cycle. Wool and structured pants - dry clean or hand wash recommended. Always air dry to maintain shape. Check care labels for specific instructions!",

  "whats a maxi skirt": "Maxi skirt = floor-length or ankle-length skirt. Our Black Urban Maxi Skirt (₹1,600) and Black Maxi Pleated Skirt (₹1,600) are sophisticated, elegant, flow beautifully. Perfect for formal events, evening wear, or elevated everyday style!",

  "what sizes do trousers come in": "Men's trousers come in M, L, XL. Women's pants/skirts come in S, M, L, XL. Check our Size Guide on product pages for exact waist, hip, and inseam measurements!",

  "what are cargo pants": "Men Modern Beige Cargo Pants (₹1,200) - Pants with large utility pockets on sides/legs. Originally military/workwear, now trendy streetwear! Relaxed fit, functional, modern street style. Pairs great with casual tops and sneakers.",

  "tell me about wide-leg pants": "Women Rust Knit Top with Wide-Leg Pants (₹2,658) - High-waisted orange wide-leg trousers with modern sophistication! Wide-leg = loose, flowing from hips down (opposite of skinny). Creates elegant silhouette, comfortable, very trendy! Paired with matching rust knit mock-neck top as complete co-ord set.",

  // BAGS FEATURES
  "what material are tote bags made of": "Canvas totes (Brown ₹429, Classic ₹799) are durable, washable cotton canvas - sturdy, eco-friendly, casual! Leather totes (PU Tote Set ₹999, Crossbody Set ₹2,649) are vegan PU leather or genuine leather - premium, structured, long-lasting!",

  "are canvas bags machine washable": "YES! Canvas tote bags can be machine washed - gentle cycle, cold water, air dry flat. Do not bleach or tumble dry. This makes them perfect for daily use - spills and dirt wash right out!",

  "tell me about the brown canvas tote": "Women Brown Canvas Tote Bag (₹429) - BESTSELLER! Minimal, reliable, spacious brown canvas for everyday use. Perfect for college, casual outings, grocery runs, carrying laptops and books. Washable, durable, effortlessly chic. Comfortable shoulder straps. Best value daily workhorse!",

  "whats the difference between tote and crossbody bags": "Tote bags (₹319-₹799) - large, open-top, shoulder straps, carry lots (laptop, books, groceries). Spacious but need one hand. Crossbody bags (Leather Set ₹2,649) - smaller, zippered, diagonal strap across body, hands-free! Secure for travel. Tote = capacity, Crossbody = convenience!",

  "how big are mini bags": "Women White Mini Stylish Bag (₹319) - Compact mini size perfect for essentials only: phone, wallet, keys, small items. NOT for laptops or books! Great for nights out, minimal days, when you want to travel light. Cute and functional!",

  "whats special about the pearl handbag": "Women Beaded Pearl Handbag (₹1,890) - Elegant mini clutch made ENTIRELY of luminous faux pearls! Structured shape, shell clasp, bead handle. Statement accessory for weddings, parties, summer getaways. Unique, show-stopping, conversation piece. Pairs beautifully with formal and resort wear!",

  "do leather bags need special care": "Yes! Wipe with damp cloth, use leather conditioner every 3 months, avoid prolonged water exposure, store in cool dry place. Proper care makes leather age beautifully and last years! PU leather requires less maintenance than genuine leather.",

  "can i fit a laptop in tote bags": "YES! Canvas Tote (Classic ₹799, Brown ₹429) and PU Leather Tote Set (₹999) are spacious enough for laptops (13-15 inch), books, daily essentials. Perfect for work, college, everyday carry!",

  // HATS FEATURES
  "what material are hats made of": "Straw hats (Beach ₹1,049, Summer Boho ₹799) - natural woven straw, breathable. Felt hats (Black Wide Brim ₹1,349) - wool felt, structured. Bucket hats (Printed ₹699) - soft fabric. Caps (Camo ₹599) - cotton/polyester blend. Fedoras (Beige ₹1,190) - breathable fabric with band!",

  // SIZING AND MEASUREMENTS
  "how do i measure for pants": "Measure your waist (natural waistline, smallest part), hips (fullest part), inseam (inside leg from crotch to ankle). Compare to Size Guide! If between sizes, size up for comfort.",

  // FOOTWEAR SIZING
  "what sizes do shoes come in": "Our shoes come in standard full sizes - check each product page for available size range! Men's typically 7-12, Women's typically 5-10. Size Guide provides exact measurements in cm/inches.",

  "do you have half sizes": "Currently we offer full sizes only. If you typically wear half sizes, we recommend sizing up for comfort. Example: If you wear 7.5, order size 8. Check Size Guide for exact length measurements!",

  "are heels true to size": "YES! Our heels (Classic Pointed ₹2,199, Pastel Stiletto ₹2,299, Dual-Tone ₹2,799) run true to size. If between sizes or have wider feet, size up. Check customer reviews for real fit feedback!",

  "how do i measure my foot for shoes": "Stand on paper, trace foot outline, measure length from heel to longest toe and width at widest point. Compare to Size Guide measurements! Measure in evening when feet are slightly swollen for accurate fit.",

  "do sneakers run small or large": "Our sneakers run true to size. Chunky styles (Blue ₹2,799, Olive ₹1,899, Pink ₹2,365) have roomy toe boxes for comfort. Athletic sneakers should have thumb's width space at toes - size up if between sizes!",

  "are boots true to size": "Yes! Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) all run true to size. For knee-high boots, also check calf circumference in Size Guide to ensure proper fit!",

  "what if boots are too tight on calves": "Check our Size Guide for calf circumference measurements before ordering! Knee-High Leather Boots (₹2,799) have structured fit. If calves are muscular/wider, consider ankle boots or combat boots instead. FREE size exchanges available!",

  "do mules come in wide fit": "Women's Black Mules (₹1,899) have standard width. If you have wider feet, we recommend sizing up. Pointed toe design is sleek - check Size Guide measurements and customer reviews for fit guidance!",

  // BAGS SIZING
  "how big are tote bags": "Canvas Totes (Classic ₹799, Brown ₹429) are spacious - fit 13-15 inch laptops, books, daily essentials! Approximate dimensions in product descriptions. Perfect for work, college, everyday carry. Mini Bag (₹319) fits essentials only - phone, wallet, keys.",

  "will a laptop fit in the tote bag": "YES! Classic Canvas Tote (₹799), Brown Canvas Tote (₹429), and PU Leather Tote Set (₹999) accommodate 13-15 inch laptops comfortably. Check product dimensions on each page!",

  "how small are mini bags": "Women White Mini Stylish Bag (₹319) is compact mini size - approximately 8-10 inches wide. Fits phone, small wallet, keys, lipstick, sunglasses. NOT for laptops, books, or large items! Perfect for nights out or minimal days.",

  "what are crossbody bag dimensions": "Women Leather Crossbody Bag Set (₹2,649) are medium crossbody size - structured, angular silhouette. Fit essentials plus small tablet/kindle. Check product page for exact dimensions! Adjustable straps for custom fit.",

  "are bag straps adjustable": "Crossbody bags have adjustable straps for height customization. Tote bags have fixed shoulder straps designed for comfortable over-shoulder carry. Handbags/clutches have fixed handles or no straps.",

  // HATS SIZING
  "what sizes do hats come in": "Most hats come in one size fits most with adjustable features! Fedoras and wide brim hats have internal bands for fit adjustment. Bucket hats and caps are flexible, stretchy materials. Approximate head circumference: 56-60cm.",

  "how do i measure my head for a hat": "Use soft measuring tape around your head just above ears and eyebrows (widest part). If measurement is 56-58cm = Medium, 58-60cm = Large. Our hats accommodate most head sizes!",

  "are hats adjustable": "Caps (Abstract Camo ₹599) have adjustable back straps. Fedoras (Classic ₹1,190) have internal sizing bands. Wide brim hats (₹1,049-₹1,499) have adjustable inner bands. Bucket hats (₹699) are flexible stretchy fit!",

  "will wide brim hats fit small heads": "Yes! Wide brim hats have adjustable internal bands to customize fit for smaller or larger heads. The brim size (wide) is for sun protection and style - doesn't affect head fit. One size fits most!",

  // JEWELRY SIZING
  "what length are necklaces": "Chokers (Beach Choker ₹780, Shell Bead ₹2,399) are 14-16 inches - sit at base of neck. Layered necklaces (Pearl & Gold Set ₹990) are 16-20 inches - various lengths. Pendants (Amber Crystal ₹1,299) are 18-20 inches - hang at collarbone. Exact lengths on product pages!",

  "are necklaces adjustable": "Most necklaces have adjustable chains with extenders - add 2-3 inches of length customization! Perfect for different necklines and personal preference. Check product pages for specific details.",

  "what size is the pearl layered back necklace": "Pearl Layered Back Necklace (₹1,350) is multi-strand design specifically for draping down the back - various lengths (16-24 inches) create layered effect. Adjustable clasp for custom fit on different body types!",

  // SUNGLASSES SIZING
  "what sizes do sunglasses come in": "Sunglasses come in one size fits most! Frame dimensions (lens width, bridge width, temple length) listed on product pages. Oversized styles (Amber Shield ₹1,149, Red Round ₹1,199) are intentionally large for bold look!",

  "how do i know if sunglasses will fit my face": "Check product descriptions for frame style guidance! Cat-eye suits angular faces, Round suits square faces, Oversized suits most faces. Measure your current sunglasses (lens width/temple length) and compare to our dimensions on product pages!",

  "are oversized sunglasses too big for small faces": "Oversized styles (Red Round ₹1,199, Amber Shield ₹1,149, Matte Black Wrap ₹1,399) are designed to be bold and large - that's the style! If you prefer smaller frames, try Slim styles (White Cat-Eye ₹1,099, Green Oval ₹975) for petite faces.",

  "do sunglasses have adjustable nose pads": "Some styles have adjustable nose pads for comfort customization. Check individual product pages! Most frames are designed to fit comfortably on average nose bridges. If concerned about fit, check dimensions and customer reviews!",

  // COLOR-SPECIFIC QUERIES
  "what colors do you have": "We have a RAINBOW of options! Neutrals (black, white, beige, tan, brown, grey), Bold colors (red, yellow, rust, burgundy, olive, mustard, pink, blue, green), Metallics (gold accents), Transparent (clear, amber). Something for every style!",

  "show me all black items": "Tons of black! Topwear (Black Turtleneck Sweater ₹5,775, Black Wool Overcoat ₹6,450, Black Oversized Jacket Dress ₹3,977), Sunglasses (Sharp Black Cat-Eye ₹1,199, Black & Gold Geometric ₹1,299, Matte Black Wrap ₹1,399), Footwear (Black Mules ₹1,899, Black Patent Heels ₹2,599, Black Chelsea Boots ₹2,598, Black Combat Boots ₹2,499), Bottomwear (Black Pleated Pants ₹1,500, Black Maxi Skirts ₹1,600, Black Striped Trousers Set ₹1,800), Bags (Black Canvas Bag ₹359), Hats (Black Wide Brim Felt ₹1,349, Textured Brim Evening Black ₹1,499).",

  "do you have white products": "Yes! Topwear (White V-neck Blouse ₹6,340, White Cotton Shirt Set ₹2,899, White Bomber Jacket ₹3,450, White Linen Shirt ₹5,679, White Knitted Vest ₹8,765), Sunglasses (White Cat-Eye ₹1,099, White Cat-Eye Statement ₹1,299), Bottomwear (White Pleated Skirt ₹1,300, White Formal Pleated Pants ₹1,400, White Pleated Shorts ₹1,100), Bags (White Mini Stylish Bag ₹319).",

  "show me beige/neutral items": "Topwear (Beige Co-ord Sweatshirt ₹2,999, Beige Blazer Sets ₹3,240-₹6,547, Beige Silk Shirt ₹4,600), Footwear (Tan Brown Sneakers ₹2,299), Sunglasses (Clear Frame ₹899), Bottomwear (Beige Trendy Trousers ₹1,600, Beige Cargo Pants ₹1,200, Neutral Beige Trousers ₹1,500), Bags (Tan Leather Shoulder Bag ₹998, PU Leather Tote Set ₹999 - beige option, Leather Crossbody Set ₹2,649 - beige), Hats (Classic Fedora Beige ₹1,190, Straw Hats ₹799-₹1,049, Printed Bucket Hat Beige ₹699).",

  "do you have red products": "Bold reds! Topwear (Red Oversized Wool Coat ₹4,200), Footwear (Classic Pointed Heels Yellow & Red ₹2,199 - red accent, Dual-Tone Cream & Red ₹2,799 - red accent, Black Patent Red Sole ₹2,599 - red sole), Sunglasses (Oversized Transparent Red Round ₹1,199, Slim Oval Tinted Red ₹1,125), Bags (Elegant Leather Handbag wine red ₹1,299), Hats (Abstract Camo Cap red-beige ₹599).",

  "show me rust/orange colored items": "Rust is TRENDING! Topwear (Rust Collared Ribbed Cotton Top ₹1,450, Rust Off-Shoulder Linen Wrap Dress ₹3,000, Rust Textured Knit Sweater ₹3,500, Rust Cardigan ₹3,986, Rust Knit Top with Wide-Leg Pants ₹2,658), Perfumes (Citrus Orange ₹670 - orange).",

  "do you have blue items": "Blues available! Topwear (Blue Floral Knit Sweater ₹5,490), Footwear (Blue Chunky Sports Sneakers ₹2,799), Sunglasses (Octagon Gradient Blue ₹1,399, Frosted Steel Blue Cat-Eye ₹1,249, Ice Blue Matte Square ₹989), Jewelry (Gold Chain Blue Crystal Hearts ₹1,599), Perfumes (Luxury Blue Glass Perfume ₹890), Bags (PU Leather Tote Set ₹999 - royal blue option).",

  "show me green products": "Greens! Topwear (Olive Green Trench Coat ₹6,879, Olive Green Zip Jacket ₹3,456, Green Turtleneck Sweater ₹3,489, Tennis Dress Green Accent ₹3,345), Sunglasses (Mint Green Chunky Frame ₹999, Slim Green Oval ₹975), Footwear (Olive Green Chunky Sneakers ₹1,899, Pastel Stiletto Green & Pink ₹2,299 - green), Bags (Quilted Style Party Tote green ₹749).",

  "do you have yellow items": "Sunny yellows! Topwear (Men Yellow Striped Shirt ₹2,977, Mustard Yellow Zip Jacket ₹5,630), Footwear (Classic Pointed Heels Lemon Yellow & Red ₹2,199 - yellow), Sunglasses (Yellow Transparent Square ₹1,050).",

  "show me pink items": "Pretty pinks! Footwear (Pastel Stiletto Heels Green & Blush Pink ₹2,299 - pink, Chunky Pink Sneakers ₹2,365).",

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
      let maxScore = 0;

      const queryWords = new Set(query.toLowerCase().split(/\s+/));
      
      // Keywords for comparison questions
      const comparisonKeywords = ['vs', 'versus', 'or', 'compare', 'better', 'difference', 'which'];
      const priceKeywords = ['cheapest', 'expensive', 'cost', 'price', 'under', 'between', 'affordable'];
      const categoryKeywords = ['what', 'show', 'products', 'have', 'sell', 'browse', 'category', 'do you have'];
      const genderKeywords = ['mens', "men's", 'womens', "women's", 'unisex'];
      const productTypeKeywords = ['necklace', 'perfume', 'sunglasses', 'heels', 'boots', 'sneakers', 'jewelry', 'tops', 'dresses', 'bags', 'hats', 'trousers', 'bottomwear', 'accessories', 'shoes', 'footwear'];
      
      // Check if query is a comparison question
      const isComparison = comparisonKeywords.some(word => query.includes(word));
      const isPriceQuery = priceKeywords.some(word => query.includes(word));

      for (const [key, value] of Object.entries(faqDatabase)) {
        let score = 0;
        const keyWords = new Set(key.toLowerCase().split(/\s+/));
        
        // Word matching score
        for (const word of queryWords) {
          if (keyWords.has(word)) score += 1;
        }
        
        // Exact phrase matching
        if (query.includes(key.toLowerCase())) {
          score += 3;
        }
        
        // Boost score for comparison questions
        if (isComparison && comparisonKeywords.some(word => key.includes(word))) {
          score += 2;
        }
        
        // Boost score for price queries
        if (isPriceQuery && priceKeywords.some(word => key.includes(word))) {
          score += 2;
        }

        // Boost score for gender-specific queries
        const queryHasGender = genderKeywords.some(word => query.includes(word));
        const keyHasGender = genderKeywords.some(word => key.includes(word));
        if (queryHasGender && keyHasGender) {
          const matchingGender = genderKeywords.find(word => query.includes(word) && key.includes(word));
          if (matchingGender) {
            score += 3;  // Higher priority for exact gender match
          }
        }
        
        // Product type matching (e.g., "shoes", "sunglasses", etc.)
        for (const type of productTypeKeywords) {
          if (query.includes(type) && key.includes(type)) {
            score += 2;
          }
        }
        
        // Category browsing boost
        if (categoryKeywords.some(word => query.includes(word)) && 
            categoryKeywords.some(word => key.includes(word))) {
          score += 2;
        }

        if (score > maxScore) {
          maxScore = score;
          bestMatch = value;
        }
      }

      return maxScore > 0 ? bestMatch : null;
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