import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";

// Store recent answers per session to avoid repetition (uses session ID instead of userId)
const sessionAnswerHistory = new Map();

// Helper function to get random answer variation (avoids immediate repetition)
const getRandomAnswer = (answers, sessionId, questionKey) => {
  if (!Array.isArray(answers)) {
    return answers;
  }
  
  // If only one answer, return it
  if (answers.length === 1) {
    return answers[0];
  }
  
  // Use a default session ID if none provided (for backward compatibility)
  const effectiveSessionId = sessionId || 'default-session';
  
  // Get session's answer history
  if (!sessionAnswerHistory.has(effectiveSessionId)) {
    sessionAnswerHistory.set(effectiveSessionId, new Map());
  }
  const sessionHistory = sessionAnswerHistory.get(effectiveSessionId);
  
  // Get last answer index for this question
  const lastAnswerIndex = sessionHistory.get(questionKey);
  
  // If this is the first time asking this question, pick randomly
  if (lastAnswerIndex === undefined) {
    const randomIndex = Math.floor(Math.random() * answers.length);
    sessionHistory.set(questionKey, randomIndex);
    
    // Clean up old history (keep last 20 questions per session)
    if (sessionHistory.size > 20) {
      const firstKey = sessionHistory.keys().next().value;
      sessionHistory.delete(firstKey);
    }
    
    return answers[randomIndex];
  }
  
  // Pick a different answer from last time
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * answers.length);
  } while (newIndex === lastAnswerIndex && answers.length > 1);
  
  sessionHistory.set(questionKey, newIndex);
  return answers[newIndex];
};

// FAQ Database with multiple answer variations
const faqDatabase = {
  // Care Instructions & Maintenance Questions
  "how to care for leather bags": [
    "Wipe with damp cloth weekly. Use leather conditioner every 3 months for our Tan Leather Shoulder Bag (₹998), Leather Crossbody Set (₹2,649), Elegant Handbag (₹1,299). Avoid prolonged water exposure. If wet, stuff with newspaper and air dry. Store in dust bag with shape-maintaining stuffing (tissue paper). Keep away from direct sunlight!",
    "Keep your leather bags looking gorgeous! Weekly wipe-downs with a damp cloth are essential. Our Tan Leather Shoulder Bag (₹998), Leather Crossbody Set (₹2,649), and Elegant Handbag (₹1,299) need conditioning every 3 months. Got caught in the rain? Blot dry, stuff with newspaper, and let air dry naturally. Always store in dust bags away from sunlight!",
    "Leather care essentials: Clean weekly with damp cloth, condition quarterly for our Tan Leather Shoulder Bag (₹998), Leather Crossbody Set (₹2,649), Elegant Handbag (₹1,299). Water is the enemy - if wet, immediately stuff with newspaper and air dry away from heat. Store properly in dust bags with tissue stuffing, never in direct sunlight!"
  ],
  
  "can leather bags get wet": [
    "Avoid rain! Water stains leather permanently. If caught in rain, blot immediately with soft cloth, stuff with newspaper, air dry away from heat. Apply leather conditioner after drying. For protection, use leather waterproofing spray before first use. Our leather bags (₹998-₹2,649) aren't waterproof!",
    "Keep leather bags away from water - it causes permanent stains! If you get caught in unexpected rain, act fast: blot with a soft cloth, stuff with newspaper, and air dry (never use heat). Once dry, apply leather conditioner. Pro tip: waterproof spray before first use helps protect our leather collection (₹998-₹2,649)!",
    "Water and leather don't mix! Our leather bags (₹998-₹2,649) can get permanent water stains. Emergency caught in rain? Immediate action: gentle blot, newspaper stuffing, natural air drying. Follow up with leather conditioner. Prevention is best - waterproof spray before wearing!"
  ],
  
  "how to remove stains from bags": [
    "Canvas bags: Pre-treat with stain remover, machine wash. Leather bags: Gentle leather cleaner on soft cloth, blot (don't rub!). Test in inconspicuous area first! For tough stains, professional cleaning recommended. Act fast - old stains harder to remove!",
    "Stain removal guide: Canvas bags are forgiving - pre-treat and machine wash them! Leather bags need more care - use gentle leather cleaner, always blot (never rub!), and test first in a hidden spot. Stubborn stains? Go professional. Time matters - fresh stains come out easier!",
    "Got stains? Canvas bags: pre-treat + machine wash = problem solved! Leather bags: gentle approach with leather cleaner, soft cloth, blotting motion only. Always test first! Tough stains need professional help. Remember: faster you act, better the results!"
  ],
  
  "how do i care for pearl jewelry": [
    "Pearls need special care! Avoid water, perfume, hairspray, and harsh chemicals - apply these BEFORE wearing pearls. Wipe gently with soft cloth after each wear to remove oils and dirt. Store in provided pouch separately from other jewelry to prevent scratches. Pearls are organic gems that need moisture - wear them regularly to maintain luster! Never use ultrasonic cleaners or steam.",
    "Keep your pearls pristine! These organic beauties need TLC: Put on perfume/hairspray FIRST, then pearls. Wipe gently after wearing to remove body oils. Store separately in the pouch we provide - prevents scratches. Fun fact: pearls need moisture from wearing to stay lustrous! Skip ultrasonic cleaners and steam - they damage pearls.",
    "Pearl care 101: These delicate organic gems require gentle handling. Apply cosmetics and perfumes before putting on pearls. After each wear, wipe with soft cloth to remove oils. Individual storage in provided pouch is essential. Surprisingly, pearls need regular wearing to maintain their natural luster! Never expose to ultrasonic cleaning or steam."
  ],
  
  "how to clean crystal jewelry": [
    "Wipe with soft, damp cloth - never soak! For our Gold Chain Blue Crystal Hearts (₹1,599) and Amber Crystal Pendant (₹1,299), gently clean crystal stones with damp microfiber cloth. Avoid harsh chemicals, perfumes directly on crystals. Dry immediately after cleaning. Store in provided pouch to prevent scratches.",
    "Crystal jewelry cleaning made easy! Use a soft, damp cloth for our Gold Chain Blue Crystal Hearts (₹1,599) and Amber Crystal Pendant (₹1,299) - never submerge in water! Keep harsh chemicals and perfumes away from the crystals. After cleaning, dry immediately and return to protective pouch. Simple care keeps them sparkling!",
    "Keep your crystals brilliant! Our Gold Chain Blue Crystal Hearts (₹1,599) and Amber Crystal Pendant (₹1,299) need gentle care - soft, damp cloth only, no soaking! Skip harsh chemicals and direct perfume contact. Quick dry after cleaning, safe storage in pouch. That's it for lasting sparkle!"
  ],
  
  "how long will jewelry last": [
    "With proper care, years to decades! Our handcrafted pieces use genuine freshwater pearls and quality materials. Regular cleaning, proper storage, and avoiding chemicals ensure longevity. Pearls naturally age beautifully with wear - they need body oils to maintain luster!",
    "Our handcrafted jewelry is built to last! With the right care, expect years to decades of wear. The secret? Regular gentle cleaning, proper storage, and keeping chemicals away. Bonus: genuine freshwater pearls actually benefit from regular wear - body oils keep them lustrous!",
    "Jewelry longevity? Decades are possible with our quality pieces! We use genuine freshwater pearls and premium materials in our handcrafted designs. Your role: clean regularly, store properly, avoid harsh chemicals. Pearls have a secret - they age beautifully and need your body's natural oils!"
  ],

  // Perfume Care
  "how to store perfumes": [
    "Keep in cool, dry place away from direct sunlight - sunlight breaks down fragrance! Store in original boxes if possible. Avoid bathroom storage - humidity and temperature changes degrade scent. Ideal storage: bedroom drawer or closet. Our designer glass bottles protect fragrance when stored properly!",
    "Perfume storage secrets: Cool, dry, and dark wins! Sunlight is fragrance's enemy - it breaks down the scent. Skip the bathroom (humidity + temp changes = degradation). Best spots: bedroom drawer or closet. Your original box helps too! Our designer glass bottles do their part when you store right!",
    "Protect your perfume investment! Store in cool, dry areas away from sunlight (which destroys fragrance notes). Original boxes offer extra protection. Bathroom storage? Bad idea - moisture and temperature swings ruin scents. Bedroom drawers and closets are perfect! Our designer glass bottles help preserve quality with proper storage."
  ],
  
  "do perfumes expire": [
    "Yes, typically 3-5 years unopened, 1-2 years after opening. Signs of expiration: color change, smell turns sour/vinegary, reduced strength. Our Eau de Parfum concentration lasts longer than lighter concentrations. Proper storage extends life!",
    "Perfumes do have a shelf life! Unopened: 3-5 years. Once opened: 1-2 years. Watch for red flags like color changes, sour/vinegar smells, or weakened scent. Good news: our Eau de Parfum concentration outlasts lighter formulas. Pro tip: proper storage significantly extends life!",
    "Yes, perfumes expire! Expect 3-5 years sealed, 1-2 years after opening. Expiration signs: off-color, sour smell, reduced potency. Silver lining: Eau de Parfum (like ours!) lasts longer than Eau de Toilette. Smart storage = extended shelf life!"
  ],

  // Footwear Care
  "how do i care for leather shoes": [
    "Wipe with damp cloth after each wear to remove dirt. Use leather conditioner every 3 months to prevent cracking. Avoid prolonged water exposure - if wet, stuff with newspaper and air dry away from heat. Use shoe trees to maintain shape. Our Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) all need regular conditioning!",
    "Leather shoe care routine: Post-wear wipe-down removes dirt. Quarterly conditioning prevents cracks (essential for our Chelsea Boots ₹2,598, Combat Boots ₹2,499, Knee-High Boots ₹2,799). Got wet? Newspaper stuffing + air drying away from heat sources. Shoe trees between wears maintain shape. Easy maintenance = lasting quality!",
    "Keep leather shoes looking fresh! After wearing: quick damp cloth wipe. Every 3 months: leather conditioner to prevent cracking (crucial for our Chelsea ₹2,598, Combat ₹2,499, Knee-High Boots ₹2,799). Water damage control: stuff with newspaper, air dry naturally. Shoe trees = shape retention. Simple care, long-lasting results!"
  ],
  
  "can i wear heels in rain": [
    "Avoid if possible! Water damages materials and makes heels slippery/dangerous. If caught in rain, dry immediately - stuff with newspaper, air dry away from direct heat. Apply waterproof spray before wearing for protection. Our heels (₹2,199-₹2,799) are not waterproof!",
    "Rain and heels don't mix! Water ruins materials and creates slip hazards. Emergency rain situation? Dry ASAP: newspaper stuffing, natural air drying (no heat!). Prevention is key - waterproof spray before first wear. Remember: our heels (₹2,199-₹2,799) aren't water-resistant!",
    "Skip heels in rain when possible! Why? Material damage plus safety risk from slippery surfaces. Caught unexpectedly? Immediate drying: newspaper inside, air dry away from heat. Best defense: waterproof spray before wearing. Important note: our heels (₹2,199-₹2,799) lack waterproofing!"
  ],
  
  "how to clean suede boots": [
    "Men's Black Suede Combat Boots (₹2,499) need special care! Use suede brush to remove dirt (brush in one direction). For stains, use suede eraser or white vinegar on damp cloth. Never use water directly - causes water marks. Apply suede protector spray before first wear. Store with shoe trees!",
    "Suede care for our Men's Black Suede Combat Boots (₹2,499): Special treatment required! Dirt removal: suede brush, one direction only. Stains: suede eraser or vinegar-dampened cloth works. Water is the enemy - direct contact leaves marks! Pre-wear suede protector spray is smart. Storage: always use shoe trees!",
    "Our Men's Black Suede Combat Boots (₹2,499) deserve special attention! Cleaning routine: one-direction suede brushing for dirt. Stubborn stains? Suede eraser or white vinegar on slightly damp cloth. Critical: never apply water directly (hello, water marks!). Prevention: suede protector before first wear. Maintenance: shoe trees for storage!"
  ],
  
  "how to clean sneakers": [
    "Remove laces, brush off loose dirt. Hand wash with mild soap and warm water using soft brush. For canvas sneakers, machine wash gentle cycle works too (remove insoles first). Air dry only - never tumble dry! Stuff with paper to maintain shape. Our Chunky Sneakers (₹1,899-₹2,799) stay fresh with regular cleaning!",
    "Sneaker cleaning simplified! Step 1: Remove laces, brush away dirt. Step 2: Hand wash with mild soap + warm water + soft brush. Canvas sneakers bonus: machine wash on gentle (insoles out!). Step 3: Air dry only, paper stuffing maintains shape. Keep our Chunky Sneakers (₹1,899-₹2,799) looking fresh with this routine!",
    "Keep sneakers pristine! Start: laces out, loose dirt brushed away. Process: gentle hand washing with mild soap, warm water, soft brush. Canvas pairs: gentle machine cycle OK (remove insoles first!). Finish: air dry with paper stuffing (never tumble dry!). Our Chunky Sneakers (₹1,899-₹2,799) love this treatment!"
  ],
  
  "how to prevent shoe odor": [
    "Air out shoes after wearing - remove insoles, let dry 24 hours. Use cedar shoe trees - absorb moisture and odor naturally. Sprinkle baking soda inside overnight, shake out morning. Rotate shoes - don't wear same pair daily. Replace insoles every 6 months for freshness!",
    "Odor prevention strategy: Post-wear airing (insoles out, 24-hour rest). Cedar shoe trees work magic on moisture and odors. Overnight baking soda treatment, morning shake-out. Shoe rotation is key - daily wearing one pair = odor city! Fresh insoles every 6 months seal the deal!",
    "Say goodbye to shoe odor! Method: Remove insoles after wearing, air 24 hours. Cedar shoe trees naturally combat moisture and smell. Quick fix: overnight baking soda, shake out AM. Smart habit: rotate pairs (same shoes daily = smell trouble). Pro move: new insoles every 6 months!"
  ],
  
  "how long do heels last": [
    "1-3 years with proper care depending on wear frequency! Our heels have quality materials and cushioned insoles. Resole when needed - extends life significantly. Regular cleaning, proper storage (shoe bags), rotating pairs ensures longevity. 3-3.5 inch mid-heels last longer than stilettos due to better weight distribution!",
    "Heel lifespan: 1-3 years with good care (wear frequency matters!). Our quality materials + cushioned insoles = durability. Secret weapon: resoling extends life dramatically. Maintenance trio: regular cleaning, shoe bag storage, pair rotation. Bonus: our 3-3.5 inch mid-heels outlast stilettos thanks to better weight distribution!",
    "Expect 1-3 years from well-maintained heels! We build ours with quality materials and comfy cushioned insoles. Life extender: professional resoling. Longevity formula: clean regularly, store in shoe bags, rotate your collection. Fun fact: our 3-3.5 inch mid-heels last longer than sky-high stilettos (weight distribution wins!)"
  ],
  
  "can i resole boots": [
    "Yes! Our Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) can be resoled by cobblers when worn down. Good quality boots last years with resoling. Leather uppers outlast soles - resoling is eco-friendly and cost-effective!",
    "Absolutely! Professional cobblers can resole our Chelsea Boots (₹2,598), Combat Boots (₹2,499), and Knee-High Boots (₹2,799) when worn. Quality boots + resoling = years of wear. Why it works: leather uppers outlive soles. Plus, resoling is sustainable and saves money!",
    "Resoling? Yes! Our Chelsea (₹2,598), Combat (₹2,499), and Knee-High Boots (₹2,799) are perfect candidates for cobbler resoling. Investment boots deserve multiple sole lives! Truth: leather uppers significantly outlast soles. Benefits: eco-friendly choice, budget-smart decision, extended boot life!"
  ],

  // Sunglasses Care
  "how to clean sunglasses": [
    "Use provided microfiber cloth - gently wipe lenses in circular motion. For deeper clean, rinse with lukewarm water + drop of dish soap, dry with microfiber cloth. Avoid paper towels, tissues, clothing - scratch lenses! Never use harsh chemicals, ammonia, bleach. Clean weekly for clear vision!",
    "Sunglasses cleaning: Your microfiber cloth (included!) is perfect - gentle circular wiping. Deep clean needs? Lukewarm water + tiny soap drop, then microfiber dry. Scratching enemies: paper towels, tissues, your shirt! Chemical no-nos: ammonia, bleach, harsh cleaners. Weekly cleaning = optimal clarity!",
    "Keep those lenses pristine! Daily: microfiber cloth circular wipes. Weekly deep clean: lukewarm water, dish soap drop, microfiber dry. Scratch prevention: skip paper towels, tissues, clothing! Damage prevention: no ammonia, bleach, or harsh chemicals. Regular cleaning = better vision through your shades!"
  ],
  
  "how to prevent scratches on sunglasses": [
    "Always use protective case when not wearing - every pair comes with case! Never place lenses-down on surfaces. Don't leave in hot car - heat damages coatings. Clean regularly - dirt particles cause scratches when wiped. Handle by frames, not lenses!",
    "Scratch prevention essentials: Use that protective case we include - every single time! Lens-down placement? Never! Hot car storage? Damages coatings! Regular cleaning removes scratch-causing dirt particles. Golden rule: handle frames only, never touch lenses!",
    "Keep sunglasses scratch-free! Rule #1: Always use your included case when not wearing. Rule #2: Never set lenses-down. Rule #3: Hot cars damage coatings - avoid! Rule #4: Clean often (dirt scratches when wiped). Rule #5: Frames for holding, lenses for seeing!"
  ],
  
  "how to store sunglasses": [
    "Always in protective case - prevents scratches, damage. Store in cool, dry place away from extreme heat/cold. Don't leave in car - dashboard heat warps frames. Keep away from sharp objects. Our cases fit perfectly - use them every time!",
    "Storage is simple: protective case, always! Location matters: cool, dry spots away from temperature extremes. Car dashboard? Frame-warping heat zone - avoid! Sharp objects? Keep distance. We sized those cases perfectly - make them your sunglasses' home!",
    "Perfect storage formula: Case + Cool/dry location + No extreme temps = happy sunglasses! Dashboard danger: heat warps frames. Sharp objects: scratch risk. Your included case? Perfectly sized for protection. Make case storage a habit - your shades will thank you!"
  ],
  
  "do sunglasses need maintenance": [
    "Clean weekly, tighten screws monthly, replace nose pads yearly (if applicable). Check for loose screws, frame alignment. UV protection doesn't expire but proper care maintains clarity. With care, our sunglasses last years of daily wear!",
    "Maintenance schedule: Weekly cleaning, monthly screw tightening, yearly nose pad replacement (when applicable). Regular checks: screw tightness, frame alignment. Good news: UV protection never expires! Care benefit: years of daily wear from our quality sunglasses!",
    "Keep sunglasses performing! Routine: clean every week, check/tighten screws monthly, new nose pads annually (if needed). Monitor: loose screws, alignment issues. Fun fact: UV400 protection lasts forever! Result: proper care = many years of daily sun protection!"
  ],

  // Topwear Care
  "how to wash cotton tops": [
    "Machine wash cold water, gentle cycle. Turn inside out to protect colors. Use mild detergent - avoid bleach. Air dry flat or hang - no tumble dry high heat (shrinks!). Our Rust Ribbed Cotton Top (₹1,450), Yellow Striped Shirt (₹2,977), White Cotton Shirt Set (₹2,899) all machine washable!",
    "Cotton care made easy! Cold water + gentle cycle + inside-out washing protects colors. Mild detergent yes, bleach no! Drying: flat or hanging air dry (high heat tumble = shrinkage!). Our machine-washable cotton: Rust Ribbed Top (₹1,450), Yellow Striped Shirt (₹2,977), White Cotton Set (₹2,899)!",
    "Washing cotton tops right: Machine on cold, gentle cycle, turn inside-out first. Detergent: mild only (skip bleach!). Drying: air is friend, high heat is enemy (causes shrinking!). Safe for machine: our Rust Ribbed Cotton Top (₹1,450), Yellow Striped Shirt (₹2,977), White Cotton Shirt Set (₹2,899)!"
  ],
  
  "how to care for wool coats": [
    "Dry clean or hand wash cold with wool-specific detergent. Never wring or twist - gently squeeze water out. Lay flat to dry on towel - hanging stretches. Use garment bag for storage with cedar blocks (moth prevention). Our Red Wool Coat (₹4,200), Black Overcoat (₹6,450), Burgundy Blazer (₹5,466) need gentle care!",
    "Wool coat TLC: Professional dry cleaning OR cold hand wash with wool detergent. Water removal: gentle squeezing (no wringing/twisting!). Drying: flat on towel (hanging = stretching). Storage: garment bag + cedar blocks = moth-free! Applies to: Red Wool Coat (₹4,200), Black Overcoat (₹6,450), Burgundy Blazer (₹5,466)!",
    "Premium wool care for our Red Wool Coat (₹4,200), Black Overcoat (₹6,450), Burgundy Blazer (₹5,466): Dry clean when possible, or cold hand wash with wool-specific detergent. Drying: gentle squeezing (never wring!), lay flat on towels (hanging damages shape). Storage secret: garment bags with cedar blocks keep moths away!"
  ],
  
  "can i machine wash blazers": [
    "Structured blazers = dry clean only to maintain shape. Casual cotton blazers may be machine washable (check care label). Use garment bag, gentle cycle, cold water if washing. Air dry on hanger - no tumble dry. Professional cleaning preserves tailoring longer!",
    "Blazer washing guide: Structured styles need dry cleaning to keep that sharp shape. Casual cotton blazers might handle machine washing (always check label first!). If machine washing: garment bag, gentle cycle, cold water. Drying: hang to air dry (tumble drying damages tailoring). Pro cleaning = longevity!",
    "Can you machine wash? Depends on blazer type! Structured styles: dry clean only (protects shape). Casual cotton: possibly machine washable (verify care label!). Machine washing protocol: garment bag protection, gentle cycle, cold water setting. Always air dry on hanger. For longest life, choose professional cleaning!"
  ],
  
  "how to wash silk shirts": [
    "Hand wash cold with gentle detergent or dry clean for our Beige Silk Shirt (₹4,600). If hand washing: soak 5 minutes, gently agitate, rinse cold water, never wring. Roll in towel to remove water, air dry flat away from sunlight. Iron on silk setting (low heat) while slightly damp. Silk is delicate!",
    "Silk care for our Beige Silk Shirt (₹4,600): Professional dry cleaning is safest, or gentle hand washing. Hand wash method: 5-minute cold soak, gentle swishing, cold rinse, no wringing! Water removal: towel rolling technique. Drying: flat, away from sun. Ironing: low heat silk setting, slightly damp fabric. Handle with care - silk rewards gentleness!",
    "Our Beige Silk Shirt (₹4,600) needs TLC! Best option: dry clean. DIY route: cold water hand wash with gentle detergent. Process: soak 5 min, soft agitation, cold rinse, zero wringing. Dry: roll in towel to absorb, lay flat away from sunlight. Press: silk setting iron while damp. Silk demands delicate handling!"
  ],
  
  "how to care for sweaters": [
    "Hand wash cold or dry clean - never machine wash/dry (pills, shrinks!). For our Rust Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Green Turtleneck (₹3,489): gently hand wash, lay flat to dry on towel. Fold, never hang - hangers stretch shoulders. Use sweater comb to remove pills. Store with cedar blocks!",
    "Sweater survival guide for our Rust Knit (₹3,500), Black Turtleneck (₹5,775), Green Turtleneck (₹3,489): Cold hand wash or professional dry clean only - machines cause pilling and shrinkage! Drying: towel flat-lay method. Storage: folded (hanging stretches!), with cedar blocks. Maintenance: sweater comb for pills. Gentle care = lasting sweaters!",
    "Keep sweaters perfect! Our Rust Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Green Turtleneck (₹3,489) need hand washing (cold) or dry cleaning - never machine! Why? Pilling and shrinking disasters! Dry flat on towels. Storage secret: fold them (hangers damage shoulders), add cedar blocks. De-pill with sweater comb. Care pays off!"
  ],
  
  "how to remove wrinkles": [
    "Steam or iron according to fabric. Cotton: high heat. Silk/synthetic: low heat with cloth barrier. Wool: medium heat, steam. Wrinkle release spray works for quick touch-ups. Hang in steamy bathroom for natural de-wrinkling. Our linen pieces (₹3,000) embrace natural wrinkles - it's part of the charm!",
    "Wrinkle removal guide: Match heat to fabric - Cotton loves high heat, silk/synthetics need low heat (use barrier cloth!), wool prefers medium + steam. Quick fixes: wrinkle spray or steamy bathroom hanging. Pro tip: our linen pieces (₹3,000) wear wrinkles beautifully - it's their signature look!",
    "De-wrinkling by fabric: Cotton items can handle high heat ironing. Silk/synthetic needs gentle low heat with protective cloth. Wool responds to medium heat steaming. Shortcuts: wrinkle release spray or bathroom steam method. Fun fact: linen pieces (₹3,000) are meant to be naturally wrinkled - embrace the texture!"
  ],
  
  "how to prevent shrinking": [
    "Wash cold water, air dry flat or hang - never hot water/high heat dryer! Hot water + heat = major shrinkage. For cotton/linen, expect 3-5% shrinkage first wash. Pre-washing before alterations recommended. Dry cleaning prevents shrinkage for delicate items!",
    "Shrinkage prevention: Cold water washing + air drying is your formula (hot water and heat = disaster!). Cotton/linen naturally shrinks 3-5% on first wash - factor this in! Alteration tip: pre-wash first. Delicate pieces? Dry cleaning eliminates shrinkage risk entirely!",
    "Stop shrinkage before it starts! Cold water wash, air dry only - hot temps cause major shrinking! Reality check: cotton/linen will shrink 3-5% initially. Smart move: wash before tailoring alterations. Safest route for delicates: professional dry cleaning = zero shrinkage!"
  ],
  
  "how long do tops last": [
    "2-10 years depending on care and fabric! Cotton basics: 2-5 years. Quality blazers/coats: 5-10+ years with proper care. Rotate outfits - don't wear same item weekly. Repair small damages immediately - extends life. Investment pieces like our coats (₹4,200-₹6,879) last decades!",
    "Lifespan varies by care and quality! Cotton basics give you 2-5 years, while our quality blazers/coats deliver 5-10+ years (or longer with TLC). Longevity secrets: rotate your wardrobe, fix small issues fast. Big picture: investment coats (₹4,200-₹6,879) can serve you for decades!",
    "Your tops' longevity: 2-10 years range! Everyday cotton pieces last 2-5 years, but premium blazers and coats easily reach 5-10+ years with proper care. Extension tactics: outfit rotation, prompt repairs. The payoff: our luxury coats (₹4,200-₹6,879) become decade-spanning wardrobe staples!"
  ],

  // Bags Care
  "how to clean canvas bags": [
    "Machine wash gentle cycle, cold water for our Canvas Totes (₹319-₹799)! Use mild detergent, no bleach. Air dry flat - don't tumble dry! Pre-treat stains with gentle soap before washing. This is why canvas is PERFECT for daily use - totally washable!",
    "Canvas tote washing (₹319-₹799): Machine-friendly! Gentle cycle, cold water, mild detergent (bleach is banned). Pre-treat stains first. Drying: flat air dry (tumble drying damages). This washability makes canvas ideal for everyday heavy use - stains wash right out!",
    "Love your canvas totes (₹319-₹799)? They're machine washable! Setup: gentle cycle + cold water + mild soap (no bleach!). Prep work: pre-treat any stains. Finish: air dry flat (skip dryer!). Canvas wins for daily bags because it handles the wash - truly worry-free!"
  ],
  
  "how to clean pearl handbag": [
    "Spot clean only! Our Pearl Beaded Handbag (₹1,890) has faux pearls - gently wipe with barely damp cloth, dry immediately. Never submerge in water! Store in provided dust bag away from sharp objects. Handle carefully - beaded bags are delicate statement pieces!",
    "Our Pearl Beaded Handbag (₹1,890) requires gentle spot cleaning! Method: barely damp cloth, gentle wipes, immediate drying. Water submersion? Absolutely not! Protection: keep in dust bag, away from sharp items. Remember: beaded bags are delicate art pieces requiring careful handling!",
    "Cleaning the Pearl Beaded Handbag (₹1,890): Spot cleaning ONLY! Technique: minimally damp cloth for gentle wiping, fast drying. Never soak or submerge! Storage: protective dust bag, no sharp objects nearby. These beaded beauties are statement pieces - treat them delicately!"
  ],
  
  "how to clean straw hats": [
    "Spot clean with damp cloth for our Straw Hats (₹799-₹1,049). Mix water + drop dish soap, gently dab stains, dry with clean cloth. Never submerge in water - weakens straw! Brush off dust regularly with soft brush. Air out after wearing - prevents sweat buildup!",
    "Straw hat care (₹799-₹1,049): Spot cleaning method with damp cloth + soap drop solution. Technique: gentle dabbing (not rubbing!), clean cloth drying. Critical: no water submersion (weakens straw structure). Maintenance: regular soft brushing removes dust, post-wear airing prevents odors!",
    "Our Straw Hats (₹799-₹1,049) need careful spot cleaning! Solution: water + soap drop, applied via damp cloth. Process: gentle dab stains, dry with clean cloth. Never dunk in water - straw loses strength! Upkeep: soft brush for dust, air out after each wear to avoid sweat issues!"
  ],

  // Bestsellers and Trending Items
  "what are your bestselling products": [
    "Our TOP sellers across all categories! **Jewelry**: Pearl Layered Back Necklace (₹1,350), Freshwater Pearl Beach Choker (₹780). **Perfumes**: Luxury Blue Glass Perfume (₹890), Flame Essence (₹1,450). **Footwear**: Women Classic Pointed Heels Yellow & Red (₹2,199), Knee-High Leather Boots (₹2,799). **Sunglasses**: Oversized Amber Shield (₹1,149), Frosted Steel Blue Cat-Eye (₹1,249). **Topwear**: Rust Collared Ribbed Top (₹1,450), Red Wool Coat (₹4,200). **Bags**: Brown Canvas Tote (₹429)!",
    "Check out our bestseller lineup! **Jewelry hits**: Pearl Layered Back Necklace (₹1,350), Freshwater Pearl Beach Choker (₹780). **Perfume stars**: Luxury Blue Glass (₹890), Flame Essence (₹1,450). **Footwear favorites**: Classic Pointed Heels Yellow & Red (₹2,199), Knee-High Leather Boots (₹2,799). **Sunglasses champions**: Oversized Amber Shield (₹1,149), Frosted Steel Blue Cat-Eye (₹1,249). **Topwear winners**: Rust Collared Ribbed Top (₹1,450), Red Wool Coat (₹4,200). **Bag hero**: Brown Canvas Tote (₹429)!",
    "Our hottest sellers by category! **Jewelry**: Pearl Layered Back Necklace (₹1,350) & Freshwater Pearl Beach Choker (₹780) lead. **Perfumes**: Luxury Blue Glass (₹890) & Flame Essence (₹1,450) dominate. **Footwear**: Classic Pointed Heels (₹2,199) & Knee-High Boots (₹2,799) flying off shelves! **Sunglasses**: Oversized Amber Shield (₹1,149) & Frosted Steel Blue Cat-Eye (₹1,249) unstoppable! **Topwear**: Rust Ribbed Top (₹1,450) & Red Wool Coat (₹4,200). **Bags**: Brown Canvas Tote (₹429) reigns supreme!"
  ],
  
  "whats trending right now": [
    "**Cat-eye sunglasses are EXPLODING!** Also hot: **Pearl jewelry** (beach chokers, layered necklaces), **Pastel heels** (green & pink tones), **Oversized blazers** (beige, burgundy), **Rust-toned knitwear** (sweaters, cardigans, tops), **Chunky sneakers** (sporty street style), **Canvas tote bags** (sustainable everyday), **Wide brim hats** (sun protection chic), **Unisex perfumes** (gender-neutral scents)!",
    "Current trend explosion: **Cat-eye sunglasses leading the charge!** What else is fire? **Pearl jewelry** everywhere (chokers, layered styles), **Pastel heels** in green/pink, **Oversized blazers** (beige/burgundy), **Rust knitwear** taking over, **Chunky sneakers** for street cred, **Canvas totes** (sustainability wins!), **Wide brim hats** (sun protection meets style), **Unisex perfumes** breaking gender rules!",
    "Trending NOW: **Cat-eye sunglasses dominating!** More hot items: **Pearl jewelry** (beach chokers + layered looks), **Pastel heels** (green & pink vibes), **Oversized blazers** in neutrals, **Rust-toned knits** (sweaters, cardigans, tops), **Chunky sneakers** (athletic street fusion), **Canvas totes** (eco-conscious daily carry), **Wide brim hats** (chic sun protection), **Unisex fragrances** (scent without boundaries)!"
  ],
  
  "most popular items by category": [
    "**Jewelry**: Pearl Layered Back Necklace (₹1,350) - backless dress essential! **Perfumes**: Luxury Blue Glass (₹890) - designer bottle! **Footwear**: Classic Pointed Heels Yellow & Red (₹2,199) - retro playful! **Sunglasses**: Oversized Amber Shield (₹1,149) - festival ready! **Topwear**: Rust Collared Ribbed Top (₹1,450) - versatile chic! **Bags**: Brown Canvas Tote (₹429) - daily workhorse! **Hats**: Straw Sun Hat (₹1,049) - beach perfect!",
    "Category champions: **Jewelry** - Pearl Layered Back Necklace (₹1,350) rules backless fashion! **Perfumes** - Luxury Blue Glass (₹890) wins with designer aesthetics! **Footwear** - Classic Pointed Heels (₹2,199) brings retro fun! **Sunglasses** - Oversized Amber Shield (₹1,149) owns festival season! **Topwear** - Rust Ribbed Top (₹1,450) ultimate versatility! **Bags** - Brown Canvas Tote (₹429) everyday MVP! **Hats** - Straw Sun Hat (₹1,049) beach essential!",
    "Top pick per category: **Jewelry** - Pearl Layered Back Necklace (₹1,350) for elegant events! **Perfumes** - Luxury Blue Glass (₹890) Instagram-worthy! **Footwear** - Classic Pointed Heels (₹2,199) playful retro! **Sunglasses** - Oversized Amber Shield (₹1,149) festival favorite! **Topwear** - Rust Ribbed Top (₹1,450) style chameleon! **Bags** - Brown Canvas Tote (₹429) daily champion! **Hats** - Straw Sun Hat (₹1,049) beach royalty!"
  ],
  
  "customer favorites": [
    "Based on reviews + repeat purchases: **Brown Canvas Tote (₹429)** - \"best bag ever!\", **Oversized Amber Shield Sunglasses (₹1,149)** - \"perfect for everything!\", **Classic Pointed Heels Yellow & Red (₹2,199)** - \"comfortable & gorgeous!\", **Pearl Layered Back Necklace (₹1,350)** - \"stunning for weddings!\", **Red Wool Coat (₹4,200)** - \"investment piece!\". People LOVE these!",
    "Customer obsessions (verified reviews + rebuy): **Brown Canvas Tote (₹429)** dubbed \"best bag ever!\" **Oversized Amber Shield Sunglasses (₹1,149)** praised as \"perfect for everything!\" **Classic Pointed Heels (₹2,199)** raved \"comfortable & gorgeous!\" **Pearl Layered Back Necklace (₹1,350)** called \"stunning for weddings!\" **Red Wool Coat (₹4,200)** declared \"investment piece!\" These items earn endless love!",
    "What customers rave about (reviews + reorders tell all): **Brown Canvas Tote (₹429)** - fans say \"best bag ever!\" **Oversized Amber Shield Sunglasses (₹1,149)** - \"perfect for everything!\" feedback. **Classic Pointed Heels (₹2,199)** - \"comfortable & gorgeous!\" reviews. **Pearl Layered Back Necklace (₹1,350)** - \"stunning for weddings!\" praise. **Red Wool Coat (₹4,200)** - \"investment piece!\" testimonials. These are the real crowd-pleasers!"
  ],

  // Jewelry Bestsellers
  "bestselling jewelry": [
    "**#1: Women Pearl Layered Back Necklace (₹1,350)** - stunning for backless dresses, weddings, formal events! **#2: Freshwater Pearl Beach Choker (₹780)** - boho beach vibes, affordable beauty! **#3: Gold Chain Blue Crystal Hearts (₹1,599)** - romantic Y-necklace! **#4: Chunky Shell Bead Choker (₹2,399)** - bold statement! **#5: Statement Pearl (₹2,899)** - artistic show-stopper!",
    "Top 5 jewelry winners: **#1: Pearl Layered Back Necklace (₹1,350)** dominates backless fashion! **#2: Freshwater Pearl Beach Choker (₹780)** delivers boho beauty on budget! **#3: Gold Chain Blue Crystal Hearts (₹1,599)** romance in Y-necklace form! **#4: Chunky Shell Bead Choker (₹2,399)** makes bold statements! **#5: Statement Pearl (₹2,899)** stops shows artistically!",
    "Jewelry bestseller rankings: **#1 spot: Pearl Layered Back Necklace (₹1,350)** for elegant events! **#2: Freshwater Pearl Beach Choker (₹780)** boho chic affordably! **#3: Gold Chain Blue Crystal Hearts (₹1,599)** romantic styling! **#4: Chunky Shell Bead Choker (₹2,399)** statement power! **#5: Statement Pearl (₹2,899)** artistic boldness!"
  ],
  
  "most popular necklace": [
    "**Pearl Layered Back Necklace (₹1,350)** hands down! Customers love the dramatic multi-strand design for backless gowns. Perfect for weddings, proms, formal galas. Genuine freshwater pearls, handcrafted quality. Reviews say \"absolutely stunning\", \"got so many compliments\", \"worth every rupee\"!",
    "Undisputed champion: **Pearl Layered Back Necklace (₹1,350)**! The multi-strand drama customers adore for backless elegance. Wedding, prom, and gala essential. Genuine freshwater pearls meet handcrafted artistry. Customer quotes: \"absolutely stunning\", \"compliment magnet\", \"worth every rupee\"!",
    "Clear winner: **Pearl Layered Back Necklace (₹1,350)**! That dramatic multi-strand back draping? Customers obsessed! Wedding and formal event go-to. Authentic freshwater pearls, handcrafted perfection. Real reviews: \"absolutely stunning\", \"non-stop compliments\", \"worth every rupee\"!"
  ],
  
  "trending jewelry styles": [
    "**Pearl jewelry is HUGE** right now - natural, timeless, elegant! **Layered necklaces** (mixing metals, lengths) super popular. **Beach/boho chokers** with beads and crystals trending for summer. **Statement pieces** over delicate - bold shells, chunky pearls. **Crystal pendants** in warm tones (amber, blue) romantic!",
    "Current jewelry trends: **Pearl pieces dominating** - timeless natural elegance! **Layered necklace combinations** (metal mixing, varied lengths) everywhere. **Beach/boho chokers** with bead-crystal combos summer-hot. **Bold statement jewelry** eclipsing delicate styles - chunky pearls, shell accents. **Crystal pendants** in amber/blue creating romance!",
    "What's hot in jewelry: **Pearl everything** - natural elegance wins! **Layered necklace styling** (metals mixed, length variety) trending hard. **Beach boho chokers** (beads + crystals) summer essentials. **Statement over subtle** - bold shells, chunky pearls rule. **Warm-toned crystal pendants** (amber, blue) bring romantic vibes!"
  ],
  
  "what jewelry do people buy most": [
    "**Pearl pieces dominate!** Beach Choker (₹780) for casual, Layered Back (₹1,350) for formal. **Crystal pendants** (₹1,299-₹1,599) for gifting - romantic + elegant. **Shell Bead Choker (₹2,399)** for statement-makers. Pearl jewelry outsells crystal 2:1 - classic never goes out of style!",
    "Purchase patterns clear: **Pearl jewelry leads!** Casual buyers grab Beach Choker (₹780), formal shoppers choose Layered Back (₹1,350). **Crystal pendants** (₹1,299-₹1,599) gift favorites - romantic elegance. **Shell Bead Choker (₹2,399)** statement seekers. Sales data: pearls beat crystals 2:1 - timeless wins!",
    "Buying behavior shows: **Pearls reign supreme!** Beach Choker (₹780) for everyday, Layered Back (₹1,350) for events. **Crystal pendants** (₹1,299-₹1,599) popular gifts - romance meets elegance. **Shell Bead Choker (₹2,399)** bold shoppers. Numbers confirm: pearl:crystal ratio 2:1 - classic never fades!"
  ],

  // Footwear, Perfume & Sunglasses Bestsellers
  "best boots for winter": [
    "**Women's Knee-High Leather Boots (₹2,799)** bestseller - structured, block heel, chic! Also hot: **Men's Combat Boots (₹2,499)** - rugged cool. **Chelsea Boots (₹2,598)** year-round versatile. Winter = boot season, these three styles can't stay in stock!",
    "Winter boot champions: **Women's Knee-High Leather Boots (₹2,799)** top seller - structured elegance, block heel comfort! Next up: **Men's Combat Boots (₹2,499)** rugged style. Plus **Chelsea Boots (₹2,598)** versatile any season. Winter demand keeps these three flying off shelves!",
    "Top winter boots: **Women's Knee-High Leather (₹2,799)** leads - chic structure, block heel! Running close: **Men's Combat Boots (₹2,499)** rugged aesthetic. Don't forget **Chelsea Boots (₹2,598)** all-season flexibility. Boot season truth: these three can't stock fast enough!"
  ],
  
  "most popular perfume": [
    "**Luxury Blue Glass Perfume (₹890)** is our #1! Customers obsessed with the bold blue bottle + gold cap - looks expensive, Instagram-worthy. Great value for premium presentation. Perfect for collectors and fragrance lovers. Reviews: \"gorgeous bottle\", \"smells amazing\", \"best gift\"!",
    "Perfume bestseller: **Luxury Blue Glass (₹890)** dominates! That bold blue bottle with gold cap? Customers can't resist - premium look, Instagram gold. Excellent value for luxury presentation. Collector and enthusiast favorite. Real feedback: \"gorgeous bottle\", \"amazing scent\", \"perfect gift\"!",
    "Number one fragrance: **Luxury Blue Glass Perfume (₹890)**! Why? Bold blue bottle + gold cap = expensive aesthetic, social media-worthy. Premium presentation at great value. Collectors and scent lovers unite here. Customer words: \"gorgeous bottle\", \"smells amazing\", \"best gift\"!"
  ],
  
  "trending perfume scents": [
    "**Unisex fragrances BOOMING** - gender-neutral scents for everyone! **Aquatic/fresh scents** (Wave Eau ₹1,799) for daily wear. **Warm woody/spice** (Flame Essence ₹1,450) for evenings. **Tropical florals** (Sunfig Bloom ₹1,250) for summer. **Clean minimal** scents over heavy floral - modern preference!",
    "Scent trends now: **Unisex perfumes exploding** - gender-free fragrance movement! **Aquatic/fresh notes** (Wave Eau ₹1,799) everyday favorites. **Woody spice warmth** (Flame Essence ₹1,450) evening picks. **Tropical floral blends** (Sunfig Bloom ₹1,250) summer hits. **Minimal clean** beats heavy floral - contemporary choice!",
    "Current fragrance trends: **Gender-neutral unisex boom** - scent without boundaries! **Fresh aquatic profiles** (Wave Eau ₹1,799) daily go-tos. **Warm wood/spice blends** (Flame Essence ₹1,450) night options. **Tropical florals** (Sunfig Bloom ₹1,250) summer essentials. **Clean simplicity** trumps heavy florals - modern sensibility!"
  ],
  
  "best perfume for gifting": [
    "**Premium Glass Perfume Set (₹1,299)** - luxury trio, beautiful packaging, versatile! Also popular: **Luxury Blue Glass (₹890)** - designer look at accessible price. **Flame Essence (₹1,450)** - unisex sophistication. Perfume is TOP gifting category - personal, luxurious, memorable!",
    "Gift perfume winners: **Premium Glass Set (₹1,299)** luxury trio, stunning packaging! Runner-up: **Luxury Blue Glass (₹890)** designer aesthetics, budget-friendly. Strong contender: **Flame Essence (₹1,450)** unisex elegance. Why perfume gifts rock: personal touch, luxury feel, lasting memory!",
    "Top gift choices: **Premium Glass Perfume Set (₹1,299)** three luxe bottles, gorgeous presentation! Also loved: **Luxury Blue Glass (₹890)** premium look, accessible cost. Plus **Flame Essence (₹1,450)** sophisticated unisex appeal. Perfume wins gifting: intimately personal, feels luxurious, creates memories!"
  ],
  
  "bestselling sunglasses": [
    "**#1: Unisex Oversized Amber Shield (₹1,149)** - EVERYONE loves these! Sporty, futuristic, festival-ready! **#2: Women Frosted Steel Blue Cat-Eye (₹1,249)** - icy statement! **#3: Unisex White Cat-Eye Statement (₹1,299)** - bold retro drama! **#4: Women Sharp Black Cat-Eye (₹1,199)** - dramatic edge! **#5: Women Oversized Red Round (₹1,199)** - retro glam!",
    "Sunglasses top 5: **#1: Oversized Amber Shield (₹1,149)** universal love! Sporty-futuristic-festival perfect! **#2: Frosted Steel Blue Cat-Eye (₹1,249)** icy cool statement! **#3: White Cat-Eye Statement (₹1,299)** retro drama boldness! **#4: Sharp Black Cat-Eye (₹1,199)** edge and drama! **#5: Oversized Red Round (₹1,199)** retro glamour!",
    "Best sunglasses ranked: **#1 position: Oversized Amber Shield (₹1,149)** - mass appeal! Festival-sporty-futuristic fusion! **#2: Frosted Steel Blue Cat-Eye (₹1,249)** - ice queen vibes! **#3: White Cat-Eye Statement (₹1,299)** - bold retro! **#4: Sharp Black Cat-Eye (₹1,199)** - dramatic styling! **#5: Oversized Red Round (₹1,199)** - vintage glam!"
  ],

  // Hats, Bags & Winter Coats Bestsellers
  "bestselling hats": [
    "**#1: Women Straw Sun Hat Beach Wide Brim (₹1,049)** - sun protection essential! **#2: Men Classic Fedora Beige (₹1,190)** - smart-casual staple! **#3: Unisex Printed Bucket Hat (₹699)** - Y2K trend! **#4: Women Straw Hat Summer Boho (₹799)** - woven natural charm! **#5: Women Wide Brim Felt Hat (₹1,349)** - elegant formal!",
    "Hat bestsellers lineup: **#1: Straw Sun Hat Beach Wide Brim (₹1,049)** must-have sun protection! **#2: Classic Fedora Beige (₹1,190)** smart-casual essential! **#3: Printed Bucket Hat (₹699)** Y2K throwback! **#4: Straw Hat Summer Boho (₹799)** natural woven beauty! **#5: Wide Brim Felt Hat (₹1,349)** formal elegance!",
    "Top-selling hats: **#1 winner: Straw Sun Hat Beach (₹1,049)** sun protection hero! **#2: Fedora Beige (₹1,190)** smart-casual classic! **#3: Printed Bucket Hat (₹699)** Y2K revival! **#4: Straw Hat Boho (₹799)** woven charm! **#5: Wide Brim Felt (₹1,349)** elegant events!"
  ],
  
  "best everyday bag": [
    "**Brown Canvas Tote (₹429)** universally loved for daily use! Also popular: **Classic Canvas Tote (₹799)** bigger capacity, **Tan Leather Shoulder Bag (₹998)** polished professional. Everyday bag needs: spacious, durable, versatile, washable!",
    "Daily bag champion: **Brown Canvas Tote (₹429)** universal favorite! Close runners: **Classic Canvas Tote (₹799)** more space, **Tan Leather Shoulder (₹998)** professional polish. Essential qualities: spacious capacity, lasting durability, style versatility, easy washing!",
    "Everyday bag winner: **Brown Canvas Tote (₹429)** loved by all! Strong alternatives: **Classic Canvas Tote (₹799)** larger size, **Tan Leather Shoulder Bag (₹998)** office-ready. Perfect daily bag features: roomy interior, tough construction, adaptable style, washable material!"
  ],
  
  "best winter coats": [
    "**Red Oversized Wool Coat (₹4,200)** #1 seller - bold statement, premium warmth! **Black Wool Overcoat (₹6,450)** classic investment. **Olive Trench Coat (₹6,879)** sophisticated. Customers invest in **quality winter coats** - wear for years, worth the price!",
    "Winter coat leaders: **Red Oversized Wool (₹4,200)** tops sales - statement warmth! **Black Wool Overcoat (₹6,450)** timeless choice. **Olive Trench (₹6,879)** refined sophistication. Why customers buy: **lasting quality** makes multi-year wear worth investment!",
    "Top winter coats: **Red Wool Coat (₹4,200)** bestseller - bold premium warmth! **Black Overcoat (₹6,450)** investment classic. **Olive Trench (₹6,879)** sophisticated styling. Customer logic: **quality construction** delivers years of wear, justifies cost!"
  ],
  
  "trending topwear styles": [
    "**Rust/orange tones EVERYWHERE** - fall color of the year! **Oversized silhouettes** - blazers, coats, sweatshirts. **Ribbed/textured knits** over smooth. **Co-ord sets** - matching top + bottom convenience! **Layered looks** - cardigans, blazers, turtlenecks. **Bold statement coats** (red, olive) investment pieces!",
    "Topwear trends dominating: **Rust/orange hues flooding** - seasonal color takeover! **Oversized cuts winning** - blazers, coats, sweatshirts. **Textured/ribbed knits** beat smooth. **Co-ord set convenience** - matched tops + bottoms! **Layering mastery** - cardigans, blazers, turtlenecks. **Statement coats boldness** (red, olive) worthy investments!",
    "Current topwear trends: **Rust/orange spectrum everywhere** - year's defining color! **Oversized proportions** - blazers, coats, sweatshirts. **Ribbed/textured knits preferred** over plain. **Co-ord set ease** - coordinated tops + pants! **Strategic layering** - cardigans, blazers, turtlenecks. **Bold coat statements** (red, olive) investment-worthy!"
  ],

  // Wedding & Formal Events
  "what should i wear to a wedding": [
    "Women: Pearl Layered Back Necklace (₹1,350) for backless gowns, Classic Pointed Heels (₹2,199-₹2,799), Pearl Beaded Handbag (₹1,890), Wide Brim Felt Hat (₹1,349). Men: Tailored Black Suit with Burgundy Shirt (₹4,350), Glossy Black Chelsea Boots (₹2,598), Classic Fedora (₹1,190). Elegant perfumes: Flame Essence (₹1,450), Sunfig Bloom (₹1,250).",
    "Wedding outfit guide! Women: Pearl Layered Back Necklace (₹1,350) with backless dress, Classic Pointed Heels (₹2,199-₹2,799), Pearl Beaded Handbag (₹1,890), Wide Brim Felt Hat (₹1,349). Men: Tailored Black Suit + Burgundy Shirt (₹4,350), Glossy Black Chelsea Boots (₹2,598), Classic Fedora (₹1,190). Fragrance finishes: Flame Essence (₹1,450), Sunfig Bloom (₹1,250)!",
    "Wedding-ready looks: Women options - Pearl Layered Back Necklace (₹1,350) for dramatic gowns, Classic Pointed Heels (₹2,199-₹2,799), Pearl Handbag (₹1,890), Wide Brim Felt Hat (₹1,349). Men's picks - Tailored Black Suit/Burgundy Shirt combo (₹4,350), Chelsea Boots (₹2,598), Fedora (₹1,190). Scent selection: Flame Essence (₹1,450) or Sunfig Bloom (₹1,250)!"
  ],
  
  "best jewelry for formal events": [
    "Pearl Layered Back Necklace (₹1,350) - stunning for backless/low-back gowns, Amber Crystal Pendant (₹1,299) - warm elegant evening wear, Gold Chain Blue Crystal Hearts (₹1,599) - romantic sophistication, Statement Pearl (₹2,899) - bold artistic statement. All handcrafted premium pieces!",
    "Formal event jewelry stars: Pearl Layered Back Necklace (₹1,350) excels with backless styles, Amber Crystal Pendant (₹1,299) brings evening warmth, Gold Chain Blue Crystal Hearts (₹1,599) delivers romance, Statement Pearl (₹2,899) makes bold art. Every piece premium handcrafted quality!",
    "Top formal jewelry picks: Pearl Layered Back Necklace (₹1,350) perfect for low-back elegance, Amber Crystal Pendant (₹1,299) warmly sophisticated, Gold Chain Blue Crystal Hearts (₹1,599) romantically refined, Statement Pearl (₹2,899) artistically daring. All showcase handcrafted premium craftsmanship!"
  ],
  
  "what heels for formal occasions": [
    "All our heels work beautifully! Black Patent Red Sole (₹2,599) - sultry power, Dual-Tone Cream & Red (₹2,799) - refined elegance, Pastel Stiletto Green & Pink (₹2,299) - soft sophistication, Classic Pointed Yellow & Red (₹2,199) - playful formal. 3-3.5 inch mid-heels for all-day comfort!",
    "Formal heel options (all stunning!): Black Patent Red Sole (₹2,599) delivers sultry confidence, Dual-Tone Cream & Red (₹2,799) refined grace, Pastel Stiletto Green & Pink (₹2,299) soft elegance, Classic Pointed Yellow & Red (₹2,199) playful sophistication. Bonus: 3-3.5 inch mid-height = comfortable all-day wear!",
    "Perfect formal heels lineup: Black Patent Red Sole (₹2,599) for sultry power moves, Dual-Tone Cream & Red (₹2,799) elegantly refined, Pastel Stiletto Green & Pink (₹2,299) softly sophisticated, Classic Pointed Yellow & Red (₹2,199) playfully formal. All feature 3-3.5 inch mid-heels - event-length comfort!"
  ],
  
  "formal wear for men": [
    "Tailored Black Suit with Burgundy Shirt (₹4,350) - weddings/business, Plaid Blazer with Brown Turtleneck (₹5,300) - smart formal, Burgundy Wool Blazer (₹5,466) - autumn sophistication, Black Wool Overcoat (₹6,450) - winter elegance, Beige Silk Shirt (₹4,600) - summer luxury. Pair with Chelsea Boots (₹2,598), Classic Fedora (₹1,190).",
    "Men's formal wardrobe: Tailored Black Suit/Burgundy Shirt (₹4,350) for weddings/business, Plaid Blazer/Brown Turtleneck (₹5,300) smart-formal edge, Burgundy Wool Blazer (₹5,466) autumn refinement, Black Wool Overcoat (₹6,450) winter sophistication, Beige Silk Shirt (₹4,600) summer elegance. Complete with Chelsea Boots (₹2,598), Fedora (₹1,190)!",
    "Men's formal essentials: Tailored Black Suit + Burgundy Shirt (₹4,350) wedding/business ready, Plaid Blazer + Brown Turtleneck (₹5,300) formal smartness, Burgundy Wool Blazer (₹5,466) sophisticated autumn, Black Wool Overcoat (₹6,450) elegant winter, Beige Silk Shirt (₹4,600) luxe summer. Accessories: Chelsea Boots (₹2,598), Fedora (₹1,190)!"
  ],
  
  "evening wear accessories": [
    "Bags: Elegant Leather Handbag with Gold Clasp (₹1,299), Pearl Beaded Handbag (₹1,890), Leather Crossbody Set (₹2,649). Jewelry: Crystal pendants, pearl necklaces. Perfumes: Flame Essence (₹1,450), Lum Eau (₹1,199). Sunglasses: Matte Black Wrap (₹1,399) for outdoor evening events.",
    "Evening accessories collection: Bags - Elegant Leather/Gold Clasp (₹1,299), Pearl Beaded (₹1,890), Leather Crossbody Set (₹2,649). Jewelry - crystal pendants, pearl necklaces. Fragrances - Flame Essence (₹1,450), Lum Eau (₹1,199). Eyewear - Matte Black Wrap (₹1,399) outdoor evening-appropriate!",
    "Complete evening accessories: Handbags - Elegant Leather Gold Clasp (₹1,299), Pearl Beaded statement (₹1,890), Leather Crossbody Set (₹2,649). Jewelry choices - crystal pendants, pearl necklaces. Scents - Flame Essence (₹1,450), Lum Eau (₹1,199). Outdoor evening sunglasses - Matte Black Wrap (₹1,399)!"
  ],
  
  "what to wear to black-tie events": [
    "Women: Beige Blazer Turtleneck Set (₹6,547), Black Oversized Jacket Dress (₹3,977), Elegant heels (₹2,599-₹2,799), Pearl jewelry, Leather handbag (₹1,299). Men: Tailored Black Suit (₹4,350), Printed Suit Blazer (₹8,760), Black Wool Overcoat (₹6,450), Chelsea Boots (₹2,598).",
    "Black-tie dress code: Women - Beige Blazer Turtleneck Set (₹6,547), Black Oversized Jacket Dress (₹3,977), Elegant heels (₹2,599-₹2,799), pearl jewelry accents, Leather handbag (₹1,299). Men - Tailored Black Suit (₹4,350), Printed Suit Blazer (₹8,760), Black Wool Overcoat (₹6,450), Chelsea Boots (₹2,598)!",
    "Black-tie attire guide: Women's selections - Beige Blazer/Turtleneck Set (₹6,547), Black Jacket Dress (₹3,977), Elegant heels range (₹2,599-₹2,799), pearl jewelry, Leather handbag (₹1,299). Men's choices - Tailored Black Suit (₹4,350), Printed Blazer (₹8,760), Black Wool Overcoat (₹6,450), Chelsea Boots (₹2,598)!"
  ],

  // Office & Professional Wear
  "what should i wear to the office": [
    "Women: Rust Ribbed Cotton Top (₹1,450), White V-neck Blouse (₹6,340), Beige Blazer Sets (₹3,240-₹6,547), White Cotton Shirt Set (₹2,899), Formal Pleated Pants (₹1,400-₹1,500), Black Pleated Pants (₹1,500), Pointed Heels (₹2,199-₹2,299), Black Mules (₹1,899), Tan Leather Shoulder Bag (₹998). Men: Yellow Striped Shirt (₹2,977), Corduroy Brown Trousers (₹1,200), Beige Trendy Trousers (₹1,600), Tan Sneakers (₹2,299), Chelsea Boots (₹2,598).",
    "Office wardrobe essentials! Women: Rust Ribbed Cotton Top (₹1,450), White V-neck Blouse (₹6,340), Beige Blazer Sets (₹3,240-₹6,547), White Cotton Shirt Set (₹2,899), Formal Pleated Pants (₹1,400-₹1,500), Black Pleated Pants (₹1,500), Pointed Heels (₹2,199-₹2,299), Black Mules (₹1,899), Tan Leather Bag (₹998). Men: Yellow Striped Shirt (₹2,977), Corduroy/Beige Trousers (₹1,200-₹1,600), Tan Sneakers (₹2,299), Chelsea Boots (₹2,598)!",
    "Professional office looks: Women options - Rust Ribbed Top (₹1,450), White V-neck (₹6,340), Beige Blazers (₹3,240-₹6,547), White Cotton Set (₹2,899), Formal/Black Pleated Pants (₹1,400-₹1,500), Pointed Heels (₹2,199-₹2,299), Black Mules (₹1,899), Tan Leather Bag (₹998). Men's picks - Yellow Striped Shirt (₹2,977), Corduroy/Beige Trousers (₹1,200-₹1,600), Tan Sneakers (₹2,299), Chelsea Boots (₹2,598)!"
  ],
  
  "business casual outfits": [
    "Women: Beige Blazer White Tank (₹3,240), White Cotton Shirt Set (₹2,899), Black Striped Trousers Set (₹1,800), Rust Ribbed Top (₹1,450), Mules (₹1,899), Tan Shoulder Bag (₹998). Men: Plaid Blazer (₹5,300), Beige Silk Shirt (₹4,600), Beige Trendy Trousers (₹1,600), Tan Brown Sneakers (₹2,299), Classic Fedora (₹1,190).",
    "Business casual selections: Women - Beige Blazer/White Tank (₹3,240), White Cotton Shirt Set (₹2,899), Black Striped Trousers Set (₹1,800), Rust Ribbed Top (₹1,450), Mules (₹1,899), Tan Shoulder Bag (₹998). Men - Plaid Blazer (₹5,300), Beige Silk Shirt (₹4,600), Beige Trendy Trousers (₹1,600), Tan Sneakers (₹2,299), Fedora (₹1,190)!",
    "Business casual guide: Women's choices - Beige Blazer + White Tank (₹3,240), White Cotton Set (₹2,899), Black Striped Trousers (₹1,800), Rust Ribbed Top (₹1,450), Mules (₹1,899), Tan Bag (₹998). Men's options - Plaid Blazer (₹5,300), Beige Silk Shirt (₹4,600), Beige Trousers (₹1,600), Tan Sneakers (₹2,299), Fedora (₹1,190)!"
  ],
  
  "professional bags for work": [
    "Tan Leather Shoulder Bag (₹998) - structured everyday office, PU Leather Tote Set (₹999) - spacious laptop-friendly, Classic Canvas Tote (₹799) - professional casual, Leather Crossbody Set (₹2,649) - premium commute, Brown Canvas Tote (₹429) - college/casual workplace. All fit laptops!",
    "Work bag options: Tan Leather Shoulder (₹998) structured office daily, PU Leather Tote Set (₹999) laptop-spacious, Classic Canvas Tote (₹799) professionally casual, Leather Crossbody Set (₹2,649) premium commuting, Brown Canvas Tote (₹429) college/casual offices. Laptop-compatible across the board!",
    "Professional work bags: Tan Leather Shoulder Bag (₹998) for structured daily office, PU Leather Tote Set (₹999) spacious laptop carrier, Classic Canvas Tote (₹799) casual-professional blend, Leather Crossbody Set (₹2,649) premium commuter, Brown Canvas Tote (₹429) casual workplace/college. All accommodate laptops!"
  ],
  
  "office-appropriate perfumes": [
    "Sheer Light (₹1,350) - light citrus white tea, not overpowering, Minimalist Cube (₹580) - clean modern subtle, Square Amber Glow (₹620) - warm professional. Avoid heavy scents - stick to fresh, airy, professional fragrances!",
    "Office-friendly scents: Sheer Light (₹1,350) gentle citrus/white tea non-overpowering, Minimalist Cube (₹580) cleanly modern and subtle, Square Amber Glow (₹620) warmly professional. Skip heavy fragrances - choose fresh, airy, workplace-appropriate options!",
    "Workplace perfume picks: Sheer Light (₹1,350) light citrus-white tea blend (not overpowering!), Minimalist Cube (₹580) clean-modern-subtle notes, Square Amber Glow (₹620) warm professional vibe. Heavy scents? Pass! Fresh, airy, professional fragrances win at work!"
  ],
  
  "comfortable shoes for all-day office wear": [
    "Women: Black Mules (₹1,899) - slip-on ease, Knee-High Boots (₹2,799) - block heels, Pastel Heels (₹2,299) - 3-inch mid-heels. Men: Tan Brown Sneakers (₹2,299) - office-casual sleek, Chelsea Boots (₹2,598) - polished comfortable. All designed for real wear!",
    "All-day office comfort: Women - Black Mules (₹1,899) easy slip-on, Knee-High Boots (₹2,799) stable block heels, Pastel Heels (₹2,299) 3-inch mid-height. Men - Tan Brown Sneakers (₹2,299) sleek office-casual, Chelsea Boots (₹2,598) comfortable polish. Designed for actual wearing!",
    "Office-ready comfortable shoes: Women's options - Black Mules (₹1,899) slip-on convenience, Knee-High Boots (₹2,799) block heel support, Pastel Heels (₹2,299) 3-inch mid-size. Men's selections - Tan Sneakers (₹2,299) casual-office sleekness, Chelsea Boots (₹2,598) polished comfort. Real-wear engineered!"
  ],

  // Parties & Celebrations
  "what should i wear to a party": [
    "Women: Classic Pointed Heels Yellow & Red (₹2,199), Black Patent Red Sole Heels (₹2,599), Black Oversized Jacket Dress (₹3,977), Red Oversized Wool Coat (₹4,200), Statement jewelry (₹1,599-₹2,899), Quilted Green Party Tote (₹749), Elegant Leather Handbag (₹1,299). Men: Printed Suit Blazer (₹8,760), Beige Silk Shirt (₹4,600), Burgundy Wool Blazer (₹5,466), Maroon Sneakers (₹3,456).",
    "Party outfit ideas! Women: Classic Pointed Heels Yellow & Red (₹2,199), Black Patent Red Sole (₹2,599), Black Oversized Jacket Dress (₹3,977), Red Wool Coat (₹4,200), Statement jewelry range (₹1,599-₹2,899), Quilted Green Party Tote (₹749), Elegant Leather Handbag (₹1,299). Men: Printed Suit Blazer (₹8,760), Beige Silk Shirt (₹4,600), Burgundy Wool Blazer (₹5,466), Maroon Sneakers (₹3,456)!",
    "Get party-ready! Women selections: Classic Pointed Heels in Yellow & Red (₹2,199), Black Patent Red Sole (₹2,599), Black Oversized Jacket Dress (₹3,977), Red Wool Coat (₹4,200), Statement jewelry (₹1,599-₹2,899), Quilted Party Tote (₹749), Elegant Leather Handbag (₹1,299). Men options: Printed Suit Blazer (₹8,760), Beige Silk Shirt (₹4,600), Burgundy Blazer (₹5,466), Maroon Sneakers (₹3,456)!"
  ],
  
  "birthday party outfit ideas": [
    "Fun & festive! Women: Floral Tie-Neck Blouse with Skirt (₹1,580), Off-Shoulder Rust Wrap Dress (₹3,000), Pastel Heels (₹2,299), Bold sunglasses (₹1,149-₹1,399), Quilted Green Tote (₹749). Men: Yellow Striped Shirt (₹2,977), Mustard Zip Jacket (₹5,630), Chunky Sneakers (₹1,899-₹2,799). Add playful accessories!",
    "Birthday celebration looks! Women picks: Floral Tie-Neck Blouse + Skirt (₹1,580), Off-Shoulder Rust Wrap Dress (₹3,000), Pastel Heels (₹2,299), Bold sunglasses (₹1,149-₹1,399), Quilted Green Tote (₹749). Men choices: Yellow Striped Shirt (₹2,977), Mustard Zip Jacket (₹5,630), Chunky Sneakers (₹1,899-₹2,799). Playful accessories complete it!",
    "Festive birthday styles: Women - Floral Tie-Neck Blouse/Skirt combo (₹1,580), Off-Shoulder Rust Wrap Dress (₹3,000), Pastel Heels (₹2,299), Bold sunglasses range (₹1,149-₹1,399), Quilted Green Tote (₹749). Men - Yellow Striped Shirt (₹2,977), Mustard Zip Jacket (₹5,630), Chunky Sneakers (₹1,899-₹2,799). Accessories add fun!"
  ],
  
  "night out accessories": [
    "Bags: Pearl Beaded Handbag (₹1,890) - show-stopper, Elegant Leather Handbag (₹1,299) - sultry, White Mini Bag (₹319) - essentials only. Jewelry: Statement Pearl (₹2,899), Gold Chain Crystal Hearts (₹1,599), Shell Bead Choker (₹2,399). Perfumes: Flame Essence (₹1,450) - bold evening, Lum Eau (₹1,199) - warm musk.",
    "Night out essentials: Bags - Pearl Beaded Handbag (₹1,890) makes statements, Elegant Leather (₹1,299) sultry elegance, White Mini Bag (₹319) compact essentials. Jewelry - Statement Pearl (₹2,899), Gold Chain Crystal Hearts (₹1,599), Shell Bead Choker (₹2,399). Scents - Flame Essence (₹1,450) bold, Lum Eau (₹1,199) musky warmth!",
    "Evening out accessories: Handbags - Pearl Beaded (₹1,890) show-stopping, Elegant Leather (₹1,299) sultry chic, White Mini (₹319) essentials carrier. Jewelry picks - Statement Pearl (₹2,899), Gold Crystal Hearts Chain (₹1,599), Shell Bead Choker (₹2,399). Fragrances - Flame Essence (₹1,450) evening boldness, Lum Eau (₹1,199) warm musk!"
  ],
  
  "festival concert outfit ideas": [
    "Sunglasses: Oversized Amber Shield (₹1,149), Octagon Gradient Blue (₹1,399), Yellow Transparent Square (₹1,050), Mint Green Chunky (₹999). Topwear: Beige Co-ord Sweatshirt (₹2,999), Black Oversized Jacket Dress (₹3,977), Tennis Dress (₹3,345). Footwear: Chunky Sneakers (₹1,899-₹2,799). Hats: Printed Bucket Hat (₹699), Abstract Camo Cap (₹599). Bags: Canvas Totes (₹429-₹799).",
    "Festival/concert ready: Sunglasses choices - Oversized Amber Shield (₹1,149), Octagon Gradient Blue (₹1,399), Yellow Transparent Square (₹1,050), Mint Green Chunky (₹999). Topwear options - Beige Co-ord Sweatshirt (₹2,999), Black Jacket Dress (₹3,977), Tennis Dress (₹3,345). Shoes - Chunky Sneakers (₹1,899-₹2,799). Hats - Printed Bucket (₹699), Camo Cap (₹599). Bags - Canvas Totes (₹429-₹799)!",
    "Concert/festival vibes: Eyewear - Oversized Amber Shield (₹1,149), Octagon Gradient Blue (₹1,399), Yellow Transparent Square (₹1,050), Mint Green Chunky (₹999). Tops - Beige Co-ord Sweatshirt (₹2,999), Black Oversized Jacket Dress (₹3,977), Tennis Dress (₹3,345). Footwear - Chunky Sneakers (₹1,899-₹2,799). Headwear - Printed Bucket Hat (₹699), Abstract Camo Cap (₹599). Carry - Canvas Totes (₹429-₹799)!"
  ],
  
  "new years eve outfit": [
    "Glamorous! Women: Black Patent Red Sole Heels (₹2,599), Red Oversized Wool Coat (₹4,200), Black Oversized Jacket Dress (₹3,977), Statement Pearl (₹2,899), Elegant Leather Handbag (₹1,299), Steel Blue Cat-Eye Sunglasses (₹1,249). Men: Printed Suit Blazer (₹8,760), Black Suit (₹4,350), Black Wool Overcoat (₹6,450).",
    "New Year's glam: Women picks - Black Patent Red Sole Heels (₹2,599), Red Wool Coat (₹4,200), Black Jacket Dress (₹3,977), Statement Pearl jewelry (₹2,899), Elegant Leather Handbag (₹1,299), Steel Blue Cat-Eye Sunglasses (₹1,249). Men selections - Printed Suit Blazer (₹8,760), Black Suit (₹4,350), Black Wool Overcoat (₹6,450)!",
    "NYE celebration looks: Women - Black Patent Red Sole Heels (₹2,599), Red Oversized Wool Coat (₹4,200), Black Oversized Jacket Dress (₹3,977), Statement Pearl (₹2,899), Elegant Leather Handbag (₹1,299), Steel Blue Cat-Eye (₹1,249). Men - Printed Suit Blazer (₹8,760), Tailored Black Suit (₹4,350), Black Wool Overcoat (₹6,450)!"
  ],

  // Casual & Everyday Occasions
  "casual weekend outfit ideas": [
    "Women: Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), White V-neck Blouse (₹6,340), Rust Cardigan White Tee (₹3,986), Jeans/trousers, Chunky Pink Sneakers (₹2,365), Black Mules (₹1,899), Brown Canvas Tote (₹429), Cat-eye Sunglasses (₹1,099-₹1,249). Men: Yellow Striped Shirt (₹2,977), White Bomber Jacket (₹3,450), Olive Zip Jacket (₹3,456), Cargo Pants (₹1,200), Sneakers (₹1,899-₹2,799).",
    "Weekend casual: Women options - Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), White V-neck Blouse (₹6,340), Rust Cardigan + Tee (₹3,986), with jeans/trousers, Chunky Pink Sneakers (₹2,365), Black Mules (₹1,899), Brown Canvas Tote (₹429), Cat-eye Sunglasses (₹1,099-₹1,249). Men picks - Yellow Striped Shirt (₹2,977), White Bomber Jacket (₹3,450), Olive Zip Jacket (₹3,456), Cargo Pants (₹1,200), Sneakers (₹1,899-₹2,799)!",
    "Relaxed weekend style: Women - Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), White V-neck Blouse (₹6,340), Rust Cardigan/White Tee (₹3,986), jeans or trousers, Chunky Pink Sneakers (₹2,365), Black Mules (₹1,899), Brown Canvas Tote (₹429), Cat-eye Sunglasses (₹1,099-₹1,249). Men - Yellow Striped Shirt (₹2,977), White Bomber (₹3,450), Olive Zip Jacket (₹3,456), Cargo Pants (₹1,200), Sneakers variety (₹1,899-₹2,799)!"
  ],
  
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
  
  "coffee date outfit": [
    "Casual chic! Women: Rust Ribbed Top (₹1,450), White Linen Shirt (₹5,679), Floral Blouse (₹1,580), Beige Trousers (₹1,600), Black Mules (₹1,899), Tan Shoulder Bag (₹998), Slim Sunglasses (₹975-₹1,125), Pearl & Gold Layered Set (₹990). Men: Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977), Tan Sneakers (₹2,299), Classic Fedora (₹1,190).",
    "Coffee date style: Women picks - Rust Ribbed Top (₹1,450), White Linen Shirt (₹5,679), Floral Blouse (₹1,580), Beige Trousers (₹1,600), Black Mules (₹1,899), Tan Shoulder Bag (₹998), Slim Sunglasses (₹975-₹1,125), Pearl & Gold Layered Set (₹990). Men choices - Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977), Tan Sneakers (₹2,299), Classic Fedora (₹1,190)!",
    "Casual-chic coffee looks: Women - Rust Ribbed Top (₹1,450), White Linen Shirt (₹5,679), Floral Blouse (₹1,580), Beige Trousers (₹1,600), Black Mules (₹1,899), Tan Bag (₹998), Slim Sunglasses (₹975-₹1,125), Pearl & Gold Set (₹990). Men - Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977), Tan Sneakers (₹2,299), Fedora (₹1,190)!"
  ],
  
  "brunch outfit ideas": [
    "Fresh & stylish! Women: Off-Shoulder Rust Wrap Dress (₹3,000), White Cotton Shirt Set (₹2,899), Floral Tie-Neck Blouse (₹1,580), Pastel Heels (₹2,299), Straw Hats (₹799-₹1,049), Canvas Tote (₹799), Oversized Red Round Sunglasses (₹1,199). Men: Beige Silk Shirt (₹4,600), Beige Trendy Trousers (₹1,600), Brown Suede Sneakers (₹2,499).",
    "Brunch-ready styles: Women options - Off-Shoulder Rust Wrap Dress (₹3,000), White Cotton Shirt Set (₹2,899), Floral Tie-Neck Blouse (₹1,580), Pastel Heels (₹2,299), Straw Hats (₹799-₹1,049), Canvas Tote (₹799), Oversized Red Round Sunglasses (₹1,199). Men selections - Beige Silk Shirt (₹4,600), Beige Trendy Trousers (₹1,600), Brown Suede Sneakers (₹2,499)!",
    "Stylish brunch outfits: Women - Off-Shoulder Rust Wrap Dress (₹3,000), White Cotton Set (₹2,899), Floral Tie-Neck Blouse (₹1,580), Pastel Heels (₹2,299), Straw Hats range (₹799-₹1,049), Canvas Tote (₹799), Oversized Red Round Sunglasses (₹1,199). Men - Beige Silk Shirt (₹4,600), Beige Trousers (₹1,600), Brown Suede Sneakers (₹2,499)!"
  ],
  
  "movie night casual hangout": [
    "Comfortable cool! Topwear: Beige Co-ord Sweatshirt (₹2,999), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), White Bomber Jacket (₹3,450). Footwear: All sneakers (₹1,899-₹2,799). Bags: Canvas Totes (₹319-₹799). Sunglasses: Any style! Hats: Bucket Hat (₹699), Camo Cap (₹599).",
    "Casual hangout comfort: Tops - Beige Co-ord Sweatshirt (₹2,999), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), White Bomber Jacket (₹3,450). Shoes - Sneaker collection (₹1,899-₹2,799). Bags - Canvas Totes (₹319-₹799). Eyewear - Any sunglasses! Headwear - Bucket Hat (₹699), Camo Cap (₹599)!",
    "Relaxed movie/hangout: Topwear choices - Beige Co-ord Sweatshirt (₹2,999), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), White Bomber (₹3,450). Footwear options - All sneakers (₹1,899-₹2,799). Carry options - Canvas Totes (₹319-₹799). Accessories - Any sunglasses, Bucket Hat (₹699), Camo Cap (₹599)!"
  ],
  
  "grocery shopping errands outfit": [
    "Effortless essentials! Topwear: Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), simple tees. Bags: Brown Canvas Tote (₹429) - PERFECT for groceries, spacious, washable! Also: Classic Canvas Tote (₹799), Shopping Bag (₹359). Footwear: Sneakers (₹1,899-₹2,799), Mules (₹1,899). Sunglasses: Any!",
    "Errand-ready essentials: Tops - Rust Ribbed Cotton Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), basic tees. Bags - Brown Canvas Tote (₹429) grocery hero (spacious + washable!), Classic Canvas Tote (₹799), Shopping Bag (₹359). Shoes - Sneakers (₹1,899-₹2,799), Mules (₹1,899). Eyewear - Any sunglasses!",
    "Shopping/errands outfit: Topwear - Rust Ribbed Top (₹1,450), Beige Co-ord Sweatshirt (₹2,999), casual tees. Bags - Brown Canvas Tote (₹429) grocery champion (spacious, washable!), Classic Canvas Tote (₹799), Shopping Bag (₹359). Footwear - All sneakers (₹1,899-₹2,799), Mules (₹1,899). Accessories - Any sunglasses!"
  ],
  
  "romantic dinner outfit": [
    "Elegant sophistication! Women: Black Oversized Jacket Dress (₹3,977), Beige Blazer Turtleneck Set (₹6,547), Dual-Tone Heels (₹2,799), Pearl Layered Back Necklace (₹1,350), Elegant Leather Handbag (₹1,299). Men: Black Suit with Burgundy Shirt (₹4,350), Burgundy Wool Blazer (₹5,466), Chelsea Boots (₹2,598). Perfumes: Flame Essence (₹1,450) bold evening!",
    "Romantic dinner elegance: Women picks - Black Oversized Jacket Dress (₹3,977), Beige Blazer Turtleneck Set (₹6,547), Dual-Tone Heels (₹2,799), Pearl Layered Back Necklace (₹1,350), Elegant Leather Handbag (₹1,299). Men selections - Black Suit/Burgundy Shirt (₹4,350), Burgundy Wool Blazer (₹5,466), Chelsea Boots (₹2,598). Scent - Flame Essence (₹1,450) evening boldness!",
    "Sophisticated dinner date: Women - Black Jacket Dress (₹3,977), Beige Blazer/Turtleneck Set (₹6,547), Dual-Tone Heels (₹2,799), Pearl Layered Necklace (₹1,350), Elegant Leather Handbag (₹1,299). Men - Black Suit + Burgundy Shirt (₹4,350), Burgundy Wool Blazer (₹5,466), Chelsea Boots (₹2,598). Fragrance - Flame Essence (₹1,450) for drama!"
  ],
  
  "anniversary celebration outfit": [
    "Special occasion glam! Jewelry: Statement Pearl (₹2,899), Gold Chain Blue Crystal Hearts (₹1,599), Amber Crystal Pendant (₹1,299). Footwear: Black Patent Red Sole Heels (₹2,599), Pastel Stiletto (₹2,299). Bags: Pearl Beaded Handbag (₹1,890), Elegant Leather Handbag (₹1,299). Topwear: Red Wool Coat (₹4,200), Black Jacket Dress (₹3,977).",
    "Anniversary glamour: Jewelry picks - Statement Pearl (₹2,899), Gold Chain Blue Crystal Hearts (₹1,599), Amber Crystal Pendant (₹1,299). Shoes - Black Patent Red Sole Heels (₹2,599), Pastel Stiletto (₹2,299). Handbags - Pearl Beaded (₹1,890), Elegant Leather (₹1,299). Outerwear - Red Wool Coat (₹4,200), Black Jacket Dress (₹3,977)!",
    "Celebrate in style: Jewelry stars - Statement Pearl (₹2,899), Gold Crystal Hearts Chain (₹1,599), Amber Crystal Pendant (₹1,299). Footwear - Black Patent Red Sole Heels (₹2,599), Pastel Stiletto (₹2,299). Bags - Pearl Beaded Handbag (₹1,890), Elegant Leather (₹1,299). Tops - Red Wool Coat (₹4,200), Black Jacket Dress (₹3,977)!"
  ],

  // Summer Products & Recommendations
  "what should i buy for summer": [
    "Topwear: Off-Shoulder Rust Linen Wrap Dress (₹3,000), Tennis Dress Green Accent (₹3,345), Floral Tie-Neck Blouse (₹1,580), White V-neck Blouse (₹6,340), White Linen Shirt (₹5,679), Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977). Footwear: All heels (₹2,199-₹2,799), Mules (₹1,899), Sneakers. Accessories: ALL sunglasses (UV400!), Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes (₹429-₹799). Jewelry: Beach Choker (₹780), Shell Bead Choker (₹2,399). Perfumes: Sunfig Bloom (₹1,250), Citrus Orange (₹670), Sheer Light (₹1,350)!",
    "Summer shopping list: Clothes - Off-Shoulder Rust Linen Wrap Dress (₹3,000), Tennis Dress Green Accent (₹3,345), Floral Tie-Neck Blouse (₹1,580), White V-neck (₹6,340), White Linen Shirt (₹5,679), Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977). Shoes - All heels (₹2,199-₹2,799), Mules (₹1,899), Sneakers. Accessories - ALL sunglasses with UV400!, Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes (₹429-₹799). Jewelry - Beach Choker (₹780), Shell Bead (₹2,399). Scents - Sunfig Bloom (₹1,250), Citrus Orange (₹670), Sheer Light (₹1,350)!",
    "Summer essentials collection: Topwear options - Off-Shoulder Rust Linen Wrap Dress (₹3,000), Tennis Dress (₹3,345), Floral Blouse (₹1,580), White V-neck (₹6,340), White Linen Shirt (₹5,679), Beige Silk Shirt (₹4,600), Yellow Striped Shirt (₹2,977). Footwear range - Heels (₹2,199-₹2,799), Mules (₹1,899), Sneakers. Must-haves - UV400 sunglasses (all styles!), Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes (₹429-₹799). Jewelry - Beach Choker (₹780), Shell Bead (₹2,399). Fragrances - Sunfig Bloom (₹1,250), Citrus Orange (₹670), Sheer Light (₹1,350)!"
  ],

  "best summer dresses": [
    "Off-Shoulder Rust Linen Wrap Dress (₹3,000) - breathable linen, breezy, sun-kissed elegance! Tennis Dress Green Accent (₹3,345) - sporty, breathable, built-in shorts! Floral Tie-Neck Blouse with Vintage Skirt (₹1,580) - cheerful vintage spring/summer! All lightweight, breathable, perfect for hot days!",
    "Summer dress champions: Off-Shoulder Rust Linen Wrap Dress (₹3,000) breathable linen breezy elegance! Tennis Dress Green Accent (₹3,345) sporty breathable with built-in shorts! Floral Tie-Neck Blouse + Vintage Skirt (₹1,580) cheerful vintage vibes! All lightweight, breathable, heat-beating perfection!",
    "Top summer dresses: Off-Shoulder Rust Linen Wrap (₹3,000) - breathable linen fabric, breezy sun-kissed style! Tennis Dress with Green Accent (₹3,345) - sporty breathable design, built-in shorts! Floral Tie-Neck Blouse/Vintage Skirt (₹1,580) - cheerful vintage spring-summer charm! Lightweight, breathable, hot-day ready!"
  ],

  "summer shoes": [
    "Women: Pointed Toe Black Mules (₹1,899) - slip-on ease!, Classic Pointed Heels (₹2,199-₹2,299) - elegant summer events, Pastel Heels (₹2,299) - brunch-ready! Men: Tan Brown Sneakers (₹2,299), Olive Green Chunky Sneakers (₹1,899), Brown Suede Sneakers (₹2,499). Avoid boots - too hot! Open/breathable styles best!",
    "Summer footwear: Women picks - Pointed Toe Black Mules (₹1,899) easy slip-on!, Classic Pointed Heels (₹2,199-₹2,299) summer event elegance, Pastel Heels (₹2,299) brunch perfect! Men options - Tan Brown Sneakers (₹2,299), Olive Chunky Sneakers (₹1,899), Brown Suede Sneakers (₹2,499). Skip boots (too warm!) - breathable styles win!",
    "Hot weather shoes: Women - Pointed Toe Black Mules (₹1,899) slip-on convenience!, Classic Pointed Heels (₹2,199-₹2,299) elegant events, Pastel Heels (₹2,299) brunch-ready! Men - Tan Brown Sneakers (₹2,299), Olive Chunky Sneakers (₹1,899), Brown Suede Sneakers (₹2,499). Boot warning - too hot! Choose open/breathable!"
  ],

  "summer accessories": [
    "Sunglasses - ESSENTIAL! All 17 styles have UV400 protection (₹899-₹1,399). Hats: Straw Sun Hat (₹1,049) - max sun protection, Straw Boho Hat (₹799), Bucket Hat (₹699). Bags: Canvas Totes (₹429-₹799) - breathable, casual. Jewelry: Beach Choker (₹780) - perfect for beach!, Shell Bead Choker (₹2,399) - ocean vibes!",
    "Summer accessory essentials: Sunglasses mandatory - all 17 styles UV400 protected (₹899-₹1,399)! Hats needed - Straw Sun Hat (₹1,049) maximum protection, Straw Boho (₹799), Bucket Hat (₹699). Bags perfect - Canvas Totes (₹429-₹799) breathable casual. Jewelry ideal - Beach Choker (₹780) beach-designed!, Shell Bead Choker (₹2,399) ocean-inspired!",
    "Accessorize for summer: Sunglasses critical - 17 styles, all UV400 (₹899-₹1,399)! Hats for protection - Straw Sun Hat (₹1,049) max coverage, Straw Boho (₹799), Bucket Hat (₹699). Bags for ease - Canvas Totes (₹429-₹799) breathable + casual. Jewelry for beach - Beach Choker (₹780) perfect match!, Shell Bead Choker (₹2,399) oceanic!"
  ],

  "what colors for summer": [
    "Bright & Light: White, beige, yellow, rust/orange, pastel pink, pastel green, light blue, mint green! Our summer picks: Yellow Striped Shirt (₹2,977), Rust Linen Wrap Dress (₹3,000), White tops (₹2,899-₹6,340), Beige items (₹2,999-₹4,600), Pastel Heels (₹2,299), Mint Green Sunglasses (₹999), Yellow Sunglasses (₹1,050)!",
    "Summer color palette: Bright & Light shades - White, beige, yellow, rust/orange, pastel pink, pastel green, light blue, mint green! Featured picks: Yellow Striped Shirt (₹2,977), Rust Linen Wrap Dress (₹3,000), White top collection (₹2,899-₹6,340), Beige range (₹2,999-₹4,600), Pastel Heels (₹2,299), Mint Green Sunglasses (₹999), Yellow Sunglasses (₹1,050)!",
    "Colors for hot weather: Go Bright & Light - White, beige, yellow, rust/orange, pastels (pink, green), light blue, mint green! Summer stars: Yellow Striped Shirt (₹2,977), Rust Linen Wrap Dress (₹3,000), White tops variety (₹2,899-₹6,340), Beige pieces (₹2,999-₹4,600), Pastel Heels (₹2,299), Mint Green Sunglasses (₹999), Yellow Sunglasses (₹1,050)!"
  ],

  "summer perfumes": [
    "Tropical Floral Sunfig Bloom (₹1,250) - fig, jasmine, neroli - summer garden! Citrus Orange (₹670) - zesty fresh energy! Sheer Light (₹1,350) - light citrus white tea! Wave Eau (₹1,799) - aquatic sea salt! Avoid heavy woody scents - go fresh, fruity, floral, aquatic!",
    "Summer scent selection: Tropical Floral Sunfig Bloom (₹1,250) fig-jasmine-neroli garden bloom! Citrus Orange (₹670) zesty energy burst! Sheer Light (₹1,350) light citrus-white tea! Wave Eau (₹1,799) aquatic sea salt freshness! Skip heavy woods - choose fresh, fruity, floral, aquatic!",
    "Hot weather fragrances: Tropical Floral Sunfig Bloom (₹1,250) - fig, jasmine, neroli summer garden! Citrus Orange (₹670) - zesty fresh zing! Sheer Light (₹1,350) - light citrus-white tea blend! Wave Eau (₹1,799) - aquatic sea salt! Heavy woody scents? No! Pick fresh, fruity, floral, aquatic!"
  ],

  "beach vacation essentials": [
    "Jewelry: Freshwater Pearl Beach Choker (₹780) - DESIGNED for beach!, Shell Bead Choker (₹2,399). Sunglasses: ALL styles - UV protection essential! Hats: Straw Sun Hat (₹1,049), Straw Boho Hat (₹799), Bucket Hat (₹699). Dresses: Rust Linen Wrap (₹3,000), Tennis Dress (₹3,345). Bags: Canvas Totes (₹429-₹799), Pearl Handbag (₹1,890). Perfumes: Sunfig Bloom (₹1,250), Wave Eau (₹1,799), Citrus Orange (₹670)!",
    "Beach vacation packing: Jewelry must-haves - Freshwater Pearl Beach Choker (₹780) beach-specific design!, Shell Bead Choker (₹2,399). Sunglasses critical - ALL styles offer UV protection! Hats required - Straw Sun Hat (₹1,049), Straw Boho (₹799), Bucket Hat (₹699). Dresses perfect - Rust Linen Wrap (₹3,000), Tennis Dress (₹3,345). Bags ideal - Canvas Totes (₹429-₹799), Pearl Handbag (₹1,890). Scents refreshing - Sunfig Bloom (₹1,250), Wave Eau (₹1,799), Citrus Orange (₹670)!",
    "Beach trip essentials: Jewelry for shore - Freshwater Pearl Beach Choker (₹780) designed for beach!, Shell Bead Choker (₹2,399). Sunglasses vital - ALL styles UV-protected! Hats necessary - Straw Sun Hat (₹1,049), Straw Boho (₹799), Bucket Hat (₹699). Dresses breezy - Rust Linen Wrap (₹3,000), Tennis Dress (₹3,345). Bags practical - Canvas Totes (₹429-₹799), Pearl Handbag (₹1,890). Fragrances tropical - Sunfig Bloom (₹1,250), Wave Eau (₹1,799), Citrus Orange (₹670)!"
  ],

  "breathable fabrics for hot weather": [
    "Linen: Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) - most breathable! Cotton: Rust Ribbed Cotton Top (₹1,450), Yellow Striped Cotton Shirt (₹2,977), White Cotton Shirt Set (₹2,899). Silk: Beige Silk Shirt (₹4,600) - temperature-regulating! Canvas: All tote bags (₹319-₹799). Avoid wool, heavy knits!",
    "Best hot-weather fabrics: Linen wins - Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) most breathable! Cotton rocks - Rust Ribbed Cotton Top (₹1,450), Yellow Striped Cotton (₹2,977), White Cotton Set (₹2,899). Silk surprises - Beige Silk Shirt (₹4,600) temperature-regulating! Canvas works - All totes (₹319-₹799). Avoid - wool, heavy knits!",
    "Cooling fabric choices: Linen #1 breathable - Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679)! Cotton comfortable - Rust Ribbed Cotton Top (₹1,450), Yellow Striped Cotton Shirt (₹2,977), White Cotton Set (₹2,899). Silk smart - Beige Silk Shirt (₹4,600) regulates temperature! Canvas practical - Tote bags (₹319-₹799). Skip wool and heavy knits!"
  ],

  // Winter Products & Recommendations
  "what should i buy for winter": [
    "Topwear: Red Oversized Wool Coat (₹4,200), Black Wool Overcoat (₹6,450), Olive Trench Coat (₹6,879), Rust Textured Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), Burgundy Wool Blazer (₹5,466), Plaid Blazer Turtleneck (₹5,300), Striped Sweater (₹4,567). Footwear: Knee-High Leather Boots (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499). Accessories: Wide Brim Felt Hat (₹1,349), Fedora (₹1,190), Leather bags (₹998-₹2,649) - weather-resistant!",
    "Winter wardrobe essentials: Outerwear - Red Oversized Wool Coat (₹4,200), Black Wool Overcoat (₹6,450), Olive Trench Coat (₹6,879), Rust Textured Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), Burgundy Wool Blazer (₹5,466), Plaid Blazer/Turtleneck (₹5,300), Striped Sweater (₹4,567). Shoes - Knee-High Leather Boots (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499). Accessories - Wide Brim Felt Hat (₹1,349), Fedora (₹1,190), Leather bags weather-resistant (₹998-₹2,649)!",
    "Cold weather shopping list: Tops/coats - Red Wool Coat (₹4,200), Black Wool Overcoat (₹6,450), Olive Trench (₹6,879), Rust Knit Sweater (₹3,500), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Rust Cardigan (₹3,986), Green Turtleneck (₹3,489), Burgundy Wool Blazer (₹5,466), Plaid Blazer + Turtleneck (₹5,300), Striped Sweater (₹4,567). Boots - Knee-High Leather (₹2,799), Chelsea (₹2,598), Combat (₹2,499). Extras - Wide Brim Felt Hat (₹1,349), Fedora (₹1,190), Weather-resistant leather bags (₹998-₹2,649)!"
  ],

  "best winter coats": [
    "#1: Red Oversized Wool Coat (₹4,200) - bold statement, premium wool blend warmth, broad lapels, plush texture! #2: Black Wool Overcoat (₹6,450) - classic investment, structured, timeless elegance! #3: Olive Green Trench Coat (₹6,879) - sophisticated knee-length, versatile layering! All designed for maximum warmth + style!",
    "Top winter coat trio: #1 Red Oversized Wool Coat (₹4,200) bold statement premium wool warmth, lapels + texture! #2 Black Wool Overcoat (₹6,450) classic investment structured timeless! #3 Olive Green Trench Coat (₹6,879) sophisticated knee-length versatile! Maximum warmth meets style!",
    "Winter coat winners: #1 position - Red Oversized Wool Coat (₹4,200) bold statement with premium wool blend, broad lapels, plush feel! #2 spot - Black Wool Overcoat (₹6,450) classic investment piece, structured elegance! #3 choice - Olive Green Trench Coat (₹6,879) sophisticated layering, knee-length! Warmth + style guaranteed!"
  ],

  "winter boots": [
    "Women's Knee-High Leather Block Heel Boots (₹2,799) - BESTSELLER! Chic, structured, warm coverage, block heels for stability! Men's Glossy Black Chelsea Boots (₹2,598) - sleek slip-on, formal winter style! Men's Black Suede Combat Boots (₹2,499) - rugged, insulated, outdoor-ready! All leather for durability + warmth!",
    "Winter boot lineup: Women Knee-High Leather Block Heel Boots (₹2,799) bestseller - chic structured warm, block heel stable! Men Glossy Black Chelsea Boots (₹2,598) sleek slip-on formal winter! Men Black Suede Combat Boots (₹2,499) rugged insulated outdoor! Leather construction = durability + warmth!",
    "Cold weather boots: Women's Knee-High Leather Block Heel (₹2,799) TOP SELLER - chic, structured, warm, stable block heels! Men's Glossy Black Chelsea (₹2,598) sleek slip-on winter formal! Men's Black Suede Combat (₹2,499) rugged, insulated, outdoor tough! All leather for lasting warmth!"
  ],

  "warmest items": [
    "Coats: Red Wool Coat (₹4,200), Black Wool Overcoat (₹6,450) - wool = maximum warmth! Sweaters: Black Turtleneck (₹5,775), Green Turtleneck (₹3,489), Rust Knit Sweater (₹3,500), Blue Floral Knit (₹5,490) - thick knits! Layering: Rust Cardigan (₹3,986) over turtlenecks! Boots: All boots (₹2,499-₹2,799) keep feet warm!",
    "Maximum warmth items: Coats lead - Red Wool Coat (₹4,200), Black Wool Overcoat (₹6,450) wool equals warmth! Sweaters follow - Black Turtleneck (₹5,775), Green Turtleneck (₹3,489), Rust Knit (₹3,500), Blue Floral Knit (₹5,490) thick knit heat! Layering adds - Rust Cardigan (₹3,986) over turtlenecks! Boots protect - All styles (₹2,499-₹2,799) warm feet!",
    "Heat-retaining heroes: Coats dominate - Red Wool Coat (₹4,200), Black Wool Overcoat (₹6,450) wool warmth wins! Sweaters excel - Black Turtleneck (₹5,775), Green Turtleneck (₹3,489), Rust Knit Sweater (₹3,500), Blue Floral Knit (₹5,490) thick knit insulation! Layer smart - Rust Cardigan (₹3,986) over turtlenecks! Boots insulate - All options (₹2,499-₹2,799) feet warmth!"
  ],

  "winter colors": [
    "Deep & Rich: Black, burgundy, rust, olive green, navy, brown, grey, deep red! Our winter picks: Black Wool Overcoat (₹6,450), Red Wool Coat (₹4,200), Burgundy Wool Blazer (₹5,466), Olive Trench Coat (₹6,879), Rust Knit Sweater (₹3,500), Green Turtleneck (₹3,489), Black Turtleneck (₹5,775), Corduroy Brown Trousers (₹1,200)!",
    "Winter color palette - Deep & Rich shades: Black, burgundy, rust, olive green, navy, brown, grey, deep red! Featured pieces: Black Wool Overcoat (₹6,450), Red Wool Coat (₹4,200), Burgundy Wool Blazer (₹5,466), Olive Trench Coat (₹6,879), Rust Knit Sweater (₹3,500), Green Turtleneck (₹3,489), Black Turtleneck (₹5,775), Corduroy Brown Trousers (₹1,200)!",
    "Cold weather colors: Go Deep & Rich - Black, burgundy, rust, olive green, navy, brown, grey, deep red! Winter selection: Black Wool Overcoat (₹6,450), Red Wool Coat (₹4,200), Burgundy Wool Blazer (₹5,466), Olive Trench (₹6,879), Rust Knit Sweater (₹3,500), Green Turtleneck (₹3,489), Black Turtleneck (₹5,775), Corduroy Brown Trousers (₹1,200)!"
  ],

  "layering pieces for winter": [
    "Base layer: Turtleneck sweaters (₹3,489-₹5,775) - Black, Green. Mid layer: Cardigans (₹3,986), Knit Sweaters (₹3,500-₹5,490), Blazers (₹5,300-₹5,466). Outer layer: Wool Coats (₹4,200-₹6,450), Trench Coat (₹6,879). Bottomwear: Corduroy Trousers (₹1,200), Pleated Pants (₹1,400-₹1,500). Layer for warmth + style!",
    "Layering system: Base - Turtleneck sweaters (₹3,489-₹5,775) Black/Green. Middle - Cardigans (₹3,986), Knit Sweaters (₹3,500-₹5,490), Blazers (₹5,300-₹5,466). Outer - Wool Coats (₹4,200-₹6,450), Trench Coat (₹6,879). Bottom - Corduroy Trousers (₹1,200), Pleated Pants (₹1,400-₹1,500). Warmth meets style!",
    "Winter layering strategy: Foundation - Turtlenecks (₹3,489-₹5,775) in Black/Green. Mid layer - Cardigans (₹3,986), Knit Sweaters (₹3,500-₹5,490), Blazers (₹5,300-₹5,466). Top layer - Wool Coats (₹4,200-₹6,450), Trench (₹6,879). Pants - Corduroy Trousers (₹1,200), Pleated (₹1,400-₹1,500). Layer smart for warmth + elegance!"
  ],

  "winter accessories": [
    "Hats: Wide Brim Felt Hat (₹1,349) - elegant + warm, Fedora (₹1,190) - classic. Bags: Leather bags (₹998-₹2,649) - weather-resistant, structured. Jewelry: Layer necklaces under coats - Pearl & Gold Set (₹990)! Perfumes: Flame Essence (₹1,450) - warm woods, Lum Eau (₹1,199) - amber musk, cozy scents!",
    "Winter accessory essentials: Hats perfect - Wide Brim Felt Hat (₹1,349) elegant warmth, Fedora (₹1,190) classic style. Bags sturdy - Leather collection (₹998-₹2,649) weather-resistant structure. Jewelry layered - Pearl & Gold Set (₹990) under coats! Fragrances cozy - Flame Essence (₹1,450) warm woods, Lum Eau (₹1,199) amber musk!",
    "Accessorize for cold: Hats needed - Wide Brim Felt (₹1,349) elegant + warm, Fedora (₹1,190) timeless. Bags ideal - Leather range (₹998-₹2,649) weather-resistant, structured. Jewelry smart - Pearl & Gold Set (₹990) layers under coats! Scents warming - Flame Essence (₹1,450) woody warmth, Lum Eau (₹1,199) amber musk coziness!"
  ],

  "cold weather shoes": [
    "Boots ONLY! Knee-High Leather Boots (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499) - insulated, warm, weatherproof! Avoid: Mules, heels, canvas sneakers. Leather/suede with socks = warmth. Boots protect from cold, wet, snow!",
    "Cold weather footwear = Boots exclusively! Knee-High Leather (₹2,799), Chelsea Boots (₹2,598), Combat Boots (₹2,499) - insulation, warmth, weather protection! Skip: Mules, heels, canvas sneakers. Leather/suede + socks = warm feet. Boots shield from cold, moisture, snow!",
    "Winter shoes? Boots required! Knee-High Leather Boots (₹2,799), Chelsea (₹2,598), Combat (₹2,499) - insulated warm weatherproof! Don't wear: Mules, heels, canvas sneakers. Formula = Leather/suede boots + socks for warmth. Protection from cold, wet, snowy conditions!"
  ],

  // Fall/Autumn Products & Recommendations
  "what should i buy for fall": [
    "Topwear: Rust Cardigan White Tee (₹3,986), Rust Textured Knit Sweater (₹3,500), Burgundy Wool Blazer (₹5,466), Plaid Blazer Brown Turtleneck (₹5,300), Rust Collared Ribbed Top (₹1,450), Striped Sweater (₹4,567), Olive Zip Jacket (₹3,456). Bottomwear: Corduroy Brown Trousers (₹1,200), Wide-Leg Pants (₹2,658). Accessories: Fedora (₹1,190), Canvas/Leather bags. Colors: Rust, burgundy, olive, brown, beige!",
    "Fall shopping essentials: Tops - Rust Cardigan/White Tee (₹3,986), Rust Knit Sweater (₹3,500), Burgundy Wool Blazer (₹5,466), Plaid Blazer/Brown Turtleneck (₹5,300), Rust Collared Ribbed Top (₹1,450), Striped Sweater (₹4,567), Olive Zip Jacket (₹3,456). Bottoms - Corduroy Brown Trousers (₹1,200), Wide-Leg Pants (₹2,658). Extras - Fedora (₹1,190), Canvas/Leather bags. Color focus: Rust, burgundy, olive, brown, beige!",
    "Autumn wardrobe picks: Topwear variety - Rust Cardigan + White Tee (₹3,986), Rust Textured Knit (₹3,500), Burgundy Wool Blazer (₹5,466), Plaid Blazer + Brown Turtleneck (₹5,300), Rust Ribbed Top (₹1,450), Striped Sweater (₹4,567), Olive Zip Jacket (₹3,456). Pants options - Corduroy Brown Trousers (₹1,200), Wide-Leg (₹2,658). Accessories - Fedora (₹1,190), Bags in canvas/leather. Palette: Rust, burgundy, olive, brown, beige!"
  ],

  "best fall colors": [
    "Rust/Orange tones DOMINATE fall! Rust Collared Ribbed Top (₹1,450), Rust Linen Wrap Dress (₹3,000), Rust Textured Knit Sweater (₹3,500), Rust Cardigan (₹3,986), Rust Knit Wide-Leg Pants (₹2,658). Also: Burgundy Wool Blazer (₹5,466), Olive Green items (₹3,456-₹6,879), Brown Corduroy Trousers (₹1,200), Beige pieces. Fall = warm earthy tones!",
    "Fall color champions - Rust/Orange dominate! Rust Collared Ribbed Top (₹1,450), Rust Linen Wrap Dress (₹3,000), Rust Textured Knit Sweater (₹3,500), Rust Cardigan (₹3,986), Rust Knit Wide-Leg Pants (₹2,658). Supporting: Burgundy Wool Blazer (₹5,466), Olive Green range (₹3,456-₹6,879), Brown Corduroy Trousers (₹1,200), Beige options. Autumn = warm earthy palette!",
    "Autumn's finest colors: Rust/Orange reign supreme! Rust Collared Ribbed Top (₹1,450), Rust Linen Wrap (₹3,000), Rust Textured Knit (₹3,500), Rust Cardigan (₹3,986), Rust Knit Wide-Leg (₹2,658). Plus: Burgundy Wool Blazer (₹5,466), Olive Green pieces (₹3,456-₹6,879), Brown Corduroy Trousers (₹1,200), Beige selections. Fall equals warm earth tones!"
  ],

  "transitional clothing for fall": [
    "Light Layers: Cardigans (₹3,986) - easy on/off!, Zip Jackets (₹3,450-₹5,630) - versatile, Blazers (₹5,300-₹5,466) - professional layering. Medium weight: Knit Sweaters (₹3,500-₹5,490) - not too heavy. Versatile bottoms: Corduroy Trousers (₹1,200), Beige Trendy Trousers (₹1,600). Footwear: Sneakers (₹1,899-₹2,799), Chelsea Boots (₹2,598) - transition to boots!",
    "Transitional fall layers: Light options - Cardigans (₹3,986) easy removal!, Zip Jackets (₹3,450-₹5,630) versatile, Blazers (₹5,300-₹5,466) professional layers. Medium pieces - Knit Sweaters (₹3,500-₹5,490) not-too-heavy. Bottoms flexible - Corduroy Trousers (₹1,200), Beige Trendy Trousers (₹1,600). Shoes bridging - Sneakers (₹1,899-₹2,799), Chelsea Boots (₹2,598) boot transition!",
    "Fall transitional pieces: Lightweight layers - Cardigans (₹3,986) on/off ease!, Zip Jackets (₹3,450-₹5,630) versatility, Blazers (₹5,300-₹5,466) professional layering. Middleweight - Knit Sweaters (₹3,500-₹5,490) balanced warmth. Adaptable pants - Corduroy Trousers (₹1,200), Beige Trendy Trousers (₹1,600). Footwear shift - Sneakers (₹1,899-₹2,799), Chelsea Boots (₹2,598) starting boot season!"
  ],

  "fall accessories": [
    "Hats: Classic Fedora (₹1,190) - autumn staple!, Bucket Hat (₹699). Bags: Tan Leather Shoulder Bag (₹998), Brown Canvas Tote (₹429) - earthy tones! Sunglasses: Amber Shield (₹1,149) - warm amber tones perfect for fall! Jewelry: Amber Crystal Pendant (₹1,299) - warm autumn glow!",
    "Autumn accessory picks: Hats ideal - Classic Fedora (₹1,190) autumn staple!, Bucket Hat (₹699). Bags earthy - Tan Leather Shoulder Bag (₹998), Brown Canvas Tote (₹429) earth tones! Eyewear perfect - Amber Shield (₹1,149) warm amber fall-ready! Jewelry glowing - Amber Crystal Pendant (₹1,299) warm autumn radiance!",
    "Fall accessory essentials: Headwear stars - Classic Fedora (₹1,190) quintessential autumn!, Bucket Hat (₹699). Bag choices - Tan Leather Shoulder (₹998), Brown Canvas Tote (₹429) earthy harmony! Sunglasses match - Amber Shield (₹1,149) warm amber autumn-perfect! Jewelry warmth - Amber Crystal Pendant (₹1,299) glowing autumn beauty!"
  ],

  "autumn jackets": [
    "Light-Medium weight: Olive Green Zip Jacket (₹3,456), Mustard Yellow Zip Jacket (₹5,630), White Bomber Jacket (₹3,450) - transitional! Heavier: Burgundy Wool Blazer (₹5,466), Plaid Blazer (₹5,300) - structured warmth. Save heavy coats (₹4,200-₹6,879) for deep winter. Fall = layerable jackets!",
    "Autumn jacket lineup: Light-Medium options - Olive Green Zip Jacket (₹3,456), Mustard Yellow Zip Jacket (₹5,630), White Bomber (₹3,450) transitional! Heavier choices - Burgundy Wool Blazer (₹5,466), Plaid Blazer (₹5,300) structured warmth. Reserve heavy coats (₹4,200-₹6,879) for winter depths. Fall means layerable!",
    "Fall jacket selection: Light-Medium range - Olive Green Zip (₹3,456), Mustard Yellow Zip (₹5,630), White Bomber (₹3,450) transitional weather! Heavier picks - Burgundy Wool Blazer (₹5,466), Plaid Blazer (₹5,300) structured warmth. Save heavy coats (₹4,200-₹6,879) for winter peak. Autumn = layering-friendly jackets!"
  ],

  // Spring Products & Recommendations
  "what should i buy for spring": [
    "Topwear: Floral Tie-Neck Blouse Vintage Skirt (₹1,580), White Cotton Shirt Set (₹2,899), White V-neck Blouse (₹6,340), White Linen Shirt (₹5,679), Rust Collared Ribbed Top (₹1,450). Footwear: Pastel Stiletto Heels Green & Pink (₹2,299), Mules (₹1,899), Chunky Pink Sneakers (₹2,365). Accessories: Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes. Colors: Pastels, florals, white, beige!",
    "Spring shopping list: Tops - Floral Tie-Neck Blouse/Vintage Skirt (₹1,580), White Cotton Shirt Set (₹2,899), White V-neck Blouse (₹6,340), White Linen Shirt (₹5,679), Rust Collared Ribbed Top (₹1,450). Shoes - Pastel Stiletto Heels Green & Pink (₹2,299), Mules (₹1,899), Chunky Pink Sneakers (₹2,365). Extras - Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes. Palette: Pastels, florals, white, beige!",
    "Spring essentials guide: Topwear choices - Floral Tie-Neck Blouse + Vintage Skirt (₹1,580), White Cotton Shirt Set (₹2,899), White V-neck Blouse (₹6,340), White Linen Shirt (₹5,679), Rust Collared Ribbed Top (₹1,450). Footwear picks - Pastel Stiletto Heels Green/Pink (₹2,299), Mules (₹1,899), Chunky Pink Sneakers (₹2,365). Accessories - Straw Hats (₹799-₹1,049), Bucket Hat (₹699), Canvas Totes. Colors: Pastels, florals, white, beige!"
  ],

  "spring dresses": [
    "Floral Tie-Neck Blouse with Vintage Skirt (₹1,580) - cheerful vintage spring/summer garden party vibes! Off-Shoulder Rust Linen Wrap Dress (₹3,000) - breezy spring elegance! White Cotton Shirt and Skirt Set (₹2,899) - fresh minimalist! Tennis Dress (₹3,345) - sporty spring activities! Light, breathable, cheerful!",
    "Spring dress collection: Floral Tie-Neck Blouse + Vintage Skirt (₹1,580) cheerful vintage garden party spring/summer! Off-Shoulder Rust Linen Wrap Dress (₹3,000) breezy elegant spring! White Cotton Shirt/Skirt Set (₹2,899) fresh minimal! Tennis Dress (₹3,345) sporty spring fun! All light, breathable, cheerful!",
    "Dresses for spring: Floral Tie-Neck Blouse with Vintage Skirt (₹1,580) - vintage garden party cheerfulness spring/summer! Off-Shoulder Rust Linen Wrap (₹3,000) - breezy spring sophistication! White Cotton Shirt + Skirt Set (₹2,899) - minimal freshness! Tennis Dress (₹3,345) - sporty spring vibes! Lightweight, breathable, cheerful designs!"
  ],

  "pastel items for spring": [
    "Footwear: Pastel Stiletto Heels Green & Pink (₹2,299) - PERFECT spring colors!, Chunky Pink Sneakers (₹2,365). Bags: Pastel Summer Carryall (₹429) - light pastel tones! Bottomwear: White Pleated Skirt (₹1,300) - soft feminine. Topwear: White Cotton items (₹2,899-₹6,340), Beige Co-ord (₹2,999). Spring = soft colors!",
    "Spring pastel picks: Shoes - Pastel Stiletto Heels Green & Pink (₹2,299) PERFECT spring shades!, Chunky Pink Sneakers (₹2,365). Bags - Pastel Summer Carryall (₹429) light pastel tones! Skirts - White Pleated Skirt (₹1,300) soft femininity. Tops - White Cotton range (₹2,899-₹6,340), Beige Co-ord (₹2,999). Spring equals soft color palette!",
    "Pastel spring collection: Footwear stars - Pastel Stiletto Heels Green/Pink (₹2,299) ideal spring colors!, Chunky Pink Sneakers (₹2,365). Carry options - Pastel Summer Carryall (₹429) light pastel vibes! Bottoms - White Pleated Skirt (₹1,300) soft feminine feel. Topwear - White Cotton selection (₹2,899-₹6,340), Beige Co-ord (₹2,999). Spring means softness!"
  ],

  "light jackets for spring": [
    "White Bomber Jacket (₹3,450) - lightweight layering! Olive Green Zip Jacket (₹3,456) - transitional weather! Rust Cardigan (₹3,986) - easy breezy! Beige Blazer (₹3,240) - professional spring! Avoid heavy wool coats - too warm. Spring = light layers you can remove!",
    "Spring jacket selection: White Bomber Jacket (₹3,450) lightweight layer! Olive Green Zip Jacket (₹3,456) transitional weather perfect! Rust Cardigan (₹3,986) breezy easy! Beige Blazer (₹3,240) professional spring style! Skip heavy wool coats (too warm). Spring needs removable light layers!",
    "Light spring jackets: White Bomber (₹3,450) - lightweight layering ease! Olive Green Zip (₹3,456) - transitional weather ready! Rust Cardigan (₹3,986) - breezy simplicity! Beige Blazer (₹3,240) - spring professionalism! Don't wear heavy wool coats - overheating risk. Spring = easily removable light layers!"
  ],

  "spring colors": [
    "Soft & Fresh: White, beige, pastel pink, pastel green, light blue, yellow, floral prints! Our spring picks: White tops (₹2,899-₹6,340), Beige pieces (₹2,999-₹4,600), Pastel Heels (₹2,299), Yellow Striped Shirt (₹2,977), Pink Sneakers (₹2,365), Floral Blouse (₹1,580), Mint Green Sunglasses (₹999)!",
    "Spring color palette - Soft & Fresh: White, beige, pastel pink, pastel green, light blue, yellow, floral prints! Featured: White top collection (₹2,899-₹6,340), Beige range (₹2,999-₹4,600), Pastel Heels (₹2,299), Yellow Striped Shirt (₹2,977), Pink Sneakers (₹2,365), Floral Blouse (₹1,580), Mint Green Sunglasses (₹999)!",
    "Colors for spring: Go Soft & Fresh - White, beige, pastel pink, pastel green, light blue, yellow, floral patterns! Spring stars: White tops variety (₹2,899-₹6,340), Beige pieces selection (₹2,999-₹4,600), Pastel Heels (₹2,299), Yellow Striped Shirt (₹2,977), Pink Sneakers (₹2,365), Floral Blouse (₹1,580), Mint Green Sunglasses (₹999)!"
  ],

  "spring accessories": [
    "Hats: Straw Hats (₹799-₹1,049) - sun protection begins!, Bucket Hat (₹699). Bags: Canvas Totes (₹429-₹799) - light casual, Pastel Carryall (₹429). Sunglasses: ALL styles - UV protection as sun strengthens! Jewelry: Beach Choker (₹780), Pearl & Gold Layered Set (₹990) - delicate spring jewelry!",
    "Spring accessory essentials: Hats starting - Straw Hats (₹799-₹1,049) sun protection begins!, Bucket Hat (₹699). Bags casual - Canvas Totes (₹429-₹799) light breezy, Pastel Carryall (₹429). Sunglasses critical - ALL styles UV protection sun strengthens! Jewelry delicate - Beach Choker (₹780), Pearl & Gold Layered Set (₹990) spring refinement!",
    "Accessorize for spring: Headwear protection - Straw Hats (₹799-₹1,049) sun protection kickoff!, Bucket Hat (₹699). Carry light - Canvas Totes (₹429-₹799) casual ease, Pastel Carryall (₹429). Eyewear vital - ALL styles offer UV protection (sun intensifying)! Jewelry refined - Beach Choker (₹780), Pearl & Gold Layered Set (₹990) delicate spring!"
  ],

  // Rainy Season Products & Recommendations
  "what to wear in rain": [
    "Topwear: Olive Green Trench Coat (₹6,879) - classic rain coat!, Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630) - water-resistant. Footwear: Combat Boots (₹2,499) - rugged waterproof!, Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) - coverage! Bags: Leather bags (₹998-₹2,649) - hold up better than canvas. Avoid: Canvas bags, suede, delicate fabrics!",
    "Rainy day outfit: Outerwear - Olive Green Trench Coat (₹6,879) classic rain protection!, Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630) water-resistant. Shoes - Combat Boots (₹2,499) rugged waterproof!, Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) full coverage! Carry - Leather bags (₹998-₹2,649) outlast canvas. Skip: Canvas bags, suede, delicate materials!",
    "Rain wear recommendations: Tops - Olive Green Trench Coat (₹6,879) rain coat classic!, Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630) water-resistance. Footwear - Combat Boots (₹2,499) rugged + waterproof!, Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) protective coverage! Bags - Leather options (₹998-₹2,649) beat canvas durability. Avoid: Canvas bags, suede, delicate fabrics!"
  ],

  "waterproof items": [
    "Coats: Olive Trench Coat (₹6,879) - designed for rain! Apply waterproof spray to: Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630). Boots: Leather/suede boots (₹2,499-₹2,799) - treat with waterproof spray before wearing! Bags: Leather bags (₹998-₹2,649) more water-resistant than canvas. Note: NO items are fully waterproof - treat and protect!",
    "Water-resistant products: Coats - Olive Trench Coat (₹6,879) rain-designed! Spray-treat: Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630). Boots - Leather/suede boots (₹2,499-₹2,799) pre-treat with waterproof spray! Bags - Leather range (₹998-₹2,649) beats canvas water-resistance. Important: NO items fully waterproof - treatment required!",
    "Waterproofing guide: Coats naturally - Olive Trench Coat (₹6,879) rain-purpose built! Need spray treatment: Black Wool Overcoat (₹6,450), Zip Jackets (₹3,450-₹5,630). Boots treatment - Leather/suede boots (₹2,499-₹2,799) waterproof spray before first wear! Bags comparison - Leather bags (₹998-₹2,649) superior water-resistance vs canvas. Disclaimer: NOTHING fully waterproof - protect all items!"
  ],

  "rain boots": [
    "Our Combat Boots (₹2,499) work well - rugged sole, higher ankle! Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) offer coverage. Treat with waterproof spray before monsoon! Avoid mules, heels, canvas sneakers - slip hazards + water damage!",
    "Rain-ready boots: Combat Boots (₹2,499) excel - rugged sole, higher ankle protection! Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) provide coverage. Pre-monsoon waterproof spray treatment essential! Skip mules, heels, canvas sneakers - slipping risk + water harm!",
    "Boots for rain: Combat Boots (₹2,499) perform great - rugged soles, elevated ankles! Chelsea Boots (₹2,598), Knee-High Boots (₹2,799) give good coverage. Must treat with waterproof spray before monsoon season! Don't wear mules, heels, canvas sneakers - dangerous slipping + water damage!"
  ],

  "monsoon accessories": [
    "Bags: Leather bags (₹998-₹2,649) - wipeable, water-resistant! Avoid canvas (absorbs water). Hats: Felt hats CAN get wet but dry carefully. Jewelry: Remove before rain - water damages! Sunglasses: Keep handy for sudden sunshine! Umbrellas: Not sold but recommended!",
    "Monsoon accessory tips: Bags smart - Leather bags (₹998-₹2,649) wipeable water-resistant! Skip canvas (water absorption). Hats careful - Felt hats tolerate wetness but need careful drying. Jewelry protect - Remove pre-rain (water causes damage)! Sunglasses ready - Keep available for sudden sun! Umbrellas advised - Not in our inventory but recommended!",
    "Rainy season accessories: Bags ideal - Leather bags (₹998-₹2,649) wipe-clean + water-resistant! Avoid canvas (soaks water). Hats manageable - Felt hats handle rain but dry with care. Jewelry caution - Take off before rain (water harms)! Sunglasses standby - Have ready for surprise sunshine! Umbrellas needed - We don't stock but suggest purchasing!"
  ],

  "colors for rainy season": [
    "Dark tones hide splashes: Black (coats, boots, pants), Olive Green (Trench Coat ₹6,879, Zip Jacket ₹3,456), Brown (boots, bags), Grey. Avoid: White, beige, pastels - show stains! Rainy season = practical dark colors!",
    "Monsoon color choices: Dark shades conceal splashes - Black (coats, boots, pants), Olive Green (Trench Coat ₹6,879, Zip Jacket ₹3,456), Brown (boots, bags), Grey. Skip: White, beige, pastels (stain magnets)! Rainy season means practical darkness!",
    "Rain-ready colors: Go dark to hide splashes - Black (coats, boots, pants), Olive Green (Trench ₹6,879, Zip Jacket ₹3,456), Brown (boots, bags), Grey. Don't wear: White, beige, pastels (stain central)! Monsoon = smart dark palette!"
  ],

  // Hot Weather Specifics
  "cooling clothes for extreme heat": [
    "Linen: Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) - MOST breathable fabric! Loose silhouettes: Oversized styles allow air flow. Light colors: White, beige reflect heat. Minimal layers: Single-layer tops, dresses. Open footwear: Mules (₹1,899), open-toe heels. Cotton: Rust Ribbed Cotton Top (₹1,450), Cotton shirts (₹2,977-₹2,899). Stay cool!",
    "Extreme heat survival: Linen wins - Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) MOST breathable! Loose fits - Oversized styles for air circulation. Light shades - White, beige heat reflection. Minimal layering - Single-layer tops/dresses. Open shoes - Mules (₹1,899), open-toe heels. Cotton helps - Rust Ribbed Cotton Top (₹1,450), Cotton shirts (₹2,977-₹2,899). Beat the heat!",
    "Cooling clothing guide: Linen #1 - Rust Linen Wrap Dress (₹3,000), White Linen Shirt (₹5,679) ultimate breathability! Loose cut - Oversized pieces promote airflow. Reflective colors - White, beige bounce heat. Layer-free - Single-layer tops, dresses only. Breathable feet - Mules (₹1,899), open-toe heels. Cotton support - Rust Ribbed Top (₹1,450), Cotton shirts (₹2,977-₹2,899). Cool down!"
  ],

  "sun protection items": [
    "Sunglasses: ALL 17 styles have UV400 protection (₹899-₹1,399) - ESSENTIAL eye protection! Hats: Straw Sun Hat (₹1,049) - MAXIMUM sun coverage wide brim!, Straw Boho Hat (₹799), Bucket Hat (₹699), any wide brim hat (₹1,349-₹1,499). Light long sleeves: White Linen Shirt (₹5,679) protects arms. Perfumes: Apply sunscreen before perfume!",
    "Sun protection essentials: Sunglasses critical - ALL 17 styles UV400 protected (₹899-₹1,399) ESSENTIAL eye defense! Hats vital - Straw Sun Hat (₹1,049) MAXIMUM wide brim coverage!, Straw Boho (₹799), Bucket Hat (₹699), any wide brim (₹1,349-₹1,499). Long sleeves smart - White Linen Shirt (₹5,679) arm protection. Fragrance tip: Sunscreen first, then perfume!",
    "Defend from sun: Sunglasses mandatory - 17 styles all UV400 (₹899-₹1,399) ESSENTIAL for eyes! Hats necessary - Straw Sun Hat (₹1,049) MAXIMUM wide brim shield!, Straw Boho (₹799), Bucket Hat (₹699), wide brims (₹1,349-₹1,499). Cover arms - White Linen Shirt (₹5,679) sleeve protection. Perfume note: Sunscreen application before fragrance!"
  ],

  "best fabrics for hot weather": [
    "#1: Linen - most breathable (Rust Wrap Dress ₹3,000, White Linen Shirt ₹5,679). #2: Cotton - natural, breathable (Rust Ribbed Top ₹1,450, Cotton shirts ₹2,899-₹2,977). #3: Silk - temperature-regulating (Beige Silk Shirt ₹4,600). #4: Canvas - for bags (₹319-₹799). AVOID: Wool, heavy knits, polyester, leather clothing (bags OK)!",
    "Hot weather fabric ranking: #1 position - Linen, most breathable (Rust Wrap Dress ₹3,000, White Linen Shirt ₹5,679). #2 spot - Cotton, natural breathability (Rust Ribbed Top ₹1,450, Cotton shirts ₹2,899-₹2,977). #3 place - Silk, temperature regulation (Beige Silk Shirt ₹4,600). #4 option - Canvas for bags (₹319-₹799). SKIP: Wool, heavy knits, polyester, leather clothes (bags fine)!",
    "Fabric heat champions: #1 winner - Linen breathes best (Rust Wrap Dress ₹3,000, White Linen Shirt ₹5,679). #2 runner-up - Cotton naturally breathes (Rust Ribbed Top ₹1,450, Cotton shirts ₹2,899-₹2,977). #3 performer - Silk regulates temperature (Beige Silk Shirt ₹4,600). #4 bags only - Canvas (₹319-₹799). AVOID: Wool, heavy knits, polyester, leather clothing (bags acceptable)!"
  ],

  // Cold Weather Specifics
  "warmest coat": [
    "Red Oversized Wool Coat (₹4,200) and Black Wool Overcoat (₹6,450) - WOOL = warmest! Premium wool blend, structured, designed for extreme cold. Olive Trench Coat (₹6,879) good but less insulated. For maximum warmth: wool coats + layer sweaters underneath!",
    "Looking for ultimate warmth? Our Red Oversized Wool Coat (₹4,200) and Black Wool Overcoat (₹6,450) lead the pack! Premium wool blend construction makes them perfect for extreme cold. While the Olive Trench Coat (₹6,879) is stylish, it's less insulated. After comparing our entire collection, these wool options deliver the best cold-weather protection!",
    "Top warmth champions: Red Oversized Wool Coat (₹4,200) and Black Wool Overcoat (₹6,450)! Both feature premium wool blend - nature's best insulator for extreme cold. The Olive Trench (₹6,879) is gorgeous but offers less warmth. Our analysis shows these wool coats outperform all others, especially when layered with sweaters underneath!"
  ],

  "insulated items": [
    "Wool coats (₹4,200-₹6,450) - natural insulation! Thick knit sweaters (₹3,500-₹5,775) - Rust Knit, Black Turtleneck, Blue Floral Knit. Wool blazers (₹5,466) - Burgundy Wool. Layering strategy: Turtleneck + Cardigan + Wool Coat = maximum insulation! Boots (₹2,499-₹2,799) keep feet insulated!",
    "Insulation champions: Wool coats (₹4,200-₹6,450) natural insulating power! Thick knit sweaters (₹3,500-₹5,775) - Rust Knit, Black Turtleneck, Blue Floral Knit. Wool blazers (₹5,466) - Burgundy Wool. Smart layering: Turtleneck + Cardigan + Wool Coat = insulation maximum! Boots (₹2,499-₹2,799) insulate feet!",
    "Best insulation: Wool coats (₹4,200-₹6,450) - nature's insulator! Thick knits (₹3,500-₹5,775) - Rust Knit, Black Turtleneck, Blue Floral Knit. Wool blazers (₹5,466) - Burgundy Wool. Layering formula: Turtleneck + Cardigan + Wool Coat = peak insulation! Boots (₹2,499-₹2,799) foot insulation!"
  ],

  "best layering combinations": [
    "Ultra Cold: Green Turtleneck (₹3,489) + Rust Cardigan (₹3,986) + Black Wool Overcoat (₹6,450) + Corduroy Trousers (₹1,200) + Chelsea Boots (₹2,598)! Moderately Cold: White tee + Rust Knit Sweater (₹3,500) + Burgundy Blazer (₹5,466) + Black Pleated Pants (₹1,500)! Professional Cold: Shirt + Plaid Blazer Turtleneck (₹5,300) + Wool Overcoat! Layer = warmth!",
    "Layering combos: Ultra Cold weather - Green Turtleneck (₹3,489) + Rust Cardigan (₹3,986) + Black Wool Overcoat (₹6,450) + Corduroy Trousers (₹1,200) + Chelsea Boots (₹2,598)! Moderate Cold - White tee + Rust Knit Sweater (₹3,500) + Burgundy Blazer (₹5,466) + Black Pleated Pants (₹1,500)! Professional Cold - Shirt + Plaid Blazer Turtleneck (₹5,300) + Wool Overcoat! Layers equal warmth!",
    "Perfect layer combinations: Extreme Cold - Green Turtleneck (₹3,489) + Rust Cardigan (₹3,986) + Black Wool Overcoat (₹6,450) + Corduroy Trousers (₹1,200) + Chelsea Boots (₹2,598)! Medium Cold - White tee + Rust Knit Sweater (₹3,500) + Burgundy Blazer (₹5,466) + Black Pleated Pants (₹1,500)! Work Cold - Shirt + Plaid Blazer Turtleneck (₹5,300) + Wool Overcoat! Layering creates warmth!"
  ],

  // Year-Round & Versatile Items
  "what works all year": [
    "Topwear: Rust Collared Ribbed Cotton Top (₹1,450) - layer or alone!, White V-neck Blouse (₹6,340), Beige Blazer (₹3,240-₹6,547) - layer over anything! Footwear: Chelsea Boots (₹2,598) - formal year-round, Sneakers (₹1,899-₹2,799), Black Mules (₹1,899). Bags: ALL bags work year-round! Sunglasses: ALL - sun protection always needed! Jewelry: ALL!",
    "Year-round essentials: Topwear flexible - Rust Collared Ribbed Cotton Top (₹1,450) layer/solo!, White V-neck Blouse (₹6,340), Beige Blazer (₹3,240-₹6,547) layers over everything! Footwear versatile - Chelsea Boots (₹2,598) formal all seasons, Sneakers (₹1,899-₹2,799), Black Mules (₹1,899). Bags - ALL work year-round! Sunglasses - ALL needed always! Jewelry - ALL seasons!",
    "All-season picks: Topwear adaptable - Rust Collared Ribbed Cotton Top (₹1,450) layered/standalone!, White V-neck Blouse (₹6,340), Beige Blazer (₹3,240-₹6,547) universal layering! Footwear timeless - Chelsea Boots (₹2,598) formal anywhere, Sneakers (₹1,899-₹2,799), Black Mules (₹1,899). Bags - ALL functional annually! Sunglasses - ALL seasons require protection! Jewelry - ALL year appropriate!"
  ],

  "versatile colors for all seasons": [
    "Black - EVERYTHING black works year-round! White - fresh all seasons! Beige/Tan/Brown - neutral timeless! Rust/Orange - surprisingly versatile fall-summer! Olive Green - earthy year-round! Grey - professional always! Our neutral collection (₹429-₹8,765) works 365 days!",
    "All-season color palette: Black - EVERYTHING black works annually! White - fresh every season! Beige/Tan/Brown - timeless neutrality! Rust/Orange - surprisingly versatile fall-summer transition! Olive Green - earthy all year! Grey - eternally professional! Neutral collection (₹429-₹8,765) 365-day functionality!",
    "Colors that never quit: Black - EVERYTHING works 12 months! White - freshness year-round! Beige/Tan/Brown - neutral forever! Rust/Orange - unexpected all-season (fall-summer)! Olive Green - earthy perpetual! Grey - professional constantly! Our neutrals (₹429-₹8,765) function 365 days!"
  ],

  "transitional season must-haves": [
    "Layerable pieces: Cardigans (₹3,986), Blazers (₹3,240-₹8,760), Zip Jackets (₹3,450-₹5,630) - add/remove as temperature changes! Medium-weight sweaters (₹3,500-₹5,490). Versatile footwear: Chelsea Boots (₹2,598), Sneakers. Neutral colors: Beige, black, olive, rust. Transition = layers + neutral!",
    "Transitional essentials: Layer-friendly - Cardigans (₹3,986), Blazers (₹3,240-₹8,760), Zip Jackets (₹3,450-₹5,630) add/remove with temps! Medium sweaters (₹3,500-₹5,490). Adaptable shoes - Chelsea Boots (₹2,598), Sneakers. Neutral palette - Beige, black, olive, rust. Transition formula = layering + neutrals!",
    "Transition must-owns: Layering heroes - Cardigans (₹3,986), Blazers (₹3,240-₹8,760), Zip Jackets (₹3,450-₹5,630) flexible temperature response! Medium-weight sweaters (₹3,500-₹5,490). Flexible footwear - Chelsea Boots (₹2,598), Sneakers. Neutral shades - Beige, black, olive, rust. Transitional success = layers + neutrals!"
  ],

  // Category & Browsing Questions - Main Categories
  "what products do you sell": [
    "We have 8 amazing categories! Jewelry (pearl necklaces, chokers, crystal pendants), Perfumes (unisex/women's fragrances), Topwear (blazers, sweaters, coats, dresses), Footwear (sneakers, boots, heels), Sunglasses (cat-eye, oversized, geometric), Bottomwear (trousers, skirts, pants), Bags (totes, crossbody, clutches), Hats (wide brim, fedoras, bucket hats). Over 120 products!",
    "Our collection spans 8 fantastic categories! Jewelry - pearl necklaces, chokers, crystal pendants. Perfumes - unisex/women's scents. Topwear - blazers, sweaters, coats, dresses. Footwear - sneakers, boots, heels. Sunglasses - cat-eye, oversized, geometric styles. Bottomwear - trousers, skirts, pants. Bags - totes, crossbody, clutches. Hats - wide brim, fedoras, bucket hats. 120+ products total!",
    "Browse through 8 incredible categories! Jewelry options (pearl necklaces, chokers, crystal pendants), Perfume range (unisex/women's fragrances), Topwear variety (blazers, sweaters, coats, dresses), Footwear selection (sneakers, boots, heels), Sunglasses styles (cat-eye, oversized, geometric), Bottomwear choices (trousers, skirts, pants), Bag collection (totes, crossbody, clutches), Hat assortment (wide brim, fedoras, bucket hats). Over 120 products!"
  ],
  
  "show me all women products": [
    "We have 70+ women's items! Jewelry (pearl necklaces, chokers, crystal pendants), Perfumes (Sheer Light, Sunfig Bloom, floral scents), Topwear (blazers, sweaters, dresses, blouses, coats), Footwear (heels, boots, mules, sneakers), Sunglasses (cat-eye, oval, oversized), Bottomwear (pleated pants, skirts, trousers), Bags (totes, crossbody, clutches), Hats (wide brim, straw hats, bucket hats).",
    "Women's collection features 70+ pieces! Jewelry range - pearl necklaces, chokers, crystal pendants. Perfume selection - Sheer Light, Sunfig Bloom, florals. Topwear options - blazers, sweaters, dresses, blouses, coats. Footwear variety - heels, boots, mules, sneakers. Sunglasses styles - cat-eye, oval, oversized. Bottomwear choices - pleated pants, skirts, trousers. Bag assortment - totes, crossbody, clutches. Hat collection - wide brim, straw, bucket hats.",
    "Our women's lineup includes 70+ gorgeous items! Jewelry - pearl necklaces, chokers, crystal pendants. Perfumes - Sheer Light, Sunfig Bloom, floral fragrances. Topwear - blazers, sweaters, dresses, blouses, coats. Footwear - heels, boots, mules, sneakers. Sunglasses - cat-eye, oval, oversized designs. Bottomwear - pleated pants, skirts, trousers. Bags - totes, crossbody, clutches. Hats - wide brim, straw hats, bucket styles!"
  ],
  
  "what do you have for men": [
    "30+ men's items! Topwear (blazers, suits, bomber jackets, overcoats, turtleneck sweaters, silk/cotton shirts), Footwear (sneakers, Chelsea boots, combat boots), Sunglasses (classic dark rectangle), Bottomwear (corduroy trousers, beige trendy pants, cargo pants, shorts), Hats (classic fedora, camo cap).",
    "Men's collection boasts 30+ pieces! Topwear selection - blazers, suits, bomber jackets, overcoats, turtleneck sweaters, silk/cotton shirts. Footwear range - sneakers, Chelsea boots, combat boots. Sunglasses option - classic dark rectangle. Bottomwear variety - corduroy trousers, beige trendy pants, cargo pants, shorts. Hat choices - classic fedora, camo cap.",
    "For men, we stock 30+ quality items! Tops include - blazers, suits, bomber jackets, overcoats, turtleneck sweaters, silk/cotton shirts. Shoes feature - sneakers, Chelsea boots, combat boots. Eyewear offers - classic dark rectangle sunglasses. Pants encompass - corduroy trousers, beige trendy pants, cargo pants, shorts. Headwear provides - classic fedora, camo cap!"
  ],
  
  "do you have unisex products": [
    "Yes! Perfumes (Flame Essence, Wave Eau, Lum Eau, Citrus Orange), Sunglasses (Octagon Blue, Black & Gold Geometric, Mint Green Chunky, Amber Shield, White Cat-Eye Statement, Yellow Square, Ice Blue Matte, Clear Frame), Footwear (Brown Suede Sneakers, Glossy Black Chelsea Boots), Bags (Light Shopping Bag, Brown Printed Canvas Tote), Bottomwear (Neutral Beige Trousers).",
    "Absolutely! Unisex perfumes - Flame Essence, Wave Eau, Lum Eau, Citrus Orange. Unisex sunglasses - Octagon Blue, Black & Gold Geometric, Mint Green Chunky, Amber Shield, White Cat-Eye Statement, Yellow Square, Ice Blue Matte, Clear Frame. Unisex footwear - Brown Suede Sneakers, Glossy Black Chelsea Boots. Unisex bags - Light Shopping Bag, Brown Printed Canvas Tote. Unisex bottomwear - Neutral Beige Trousers!",
    "Yes, we have unisex options! Fragrance line - Flame Essence, Wave Eau, Lum Eau, Citrus Orange perfumes. Eyewear range - Octagon Blue, Black & Gold Geometric, Mint Green Chunky, Amber Shield, White Cat-Eye Statement, Yellow Square, Ice Blue Matte, Clear Frame sunglasses. Shoe selection - Brown Suede Sneakers, Glossy Black Chelsea Boots. Bag choices - Light Shopping Bag, Brown Printed Canvas Tote. Pants option - Neutral Beige Trousers!"
  ],
  
  "what is your bestselling category": [
    "Sunglasses and Jewelry are flying off shelves! Also popular: Footwear (heels, boots) and Topwear (blazers, coats). Check out our bestsellers section!",
    "Top sellers: Sunglasses and Jewelry dominating sales! Also hot items: Footwear category (heels, boots) and Topwear pieces (blazers, coats). Browse our bestsellers section!",
    "Customer favorites: Sunglasses and Jewelry leading the pack! Strong performers: Footwear options (heels, boots) and Topwear styles (blazers, coats). Explore our bestsellers section!"
  ],

  // Price-Based Questions - Overall
  "whats cheapest": [
    "Women White Mini Stylish Bag at ₹319! Perfect for carrying essentials. We also have the Light Everyday Shopping Bag at ₹359 and Women Brown Canvas Tote Bag at ₹429.",
    "Lowest price: Women White Mini Stylish Bag ₹319! Great for essentials. Also budget-friendly: Light Everyday Shopping Bag ₹359 and Women Brown Canvas Tote ₹429.",
    "Most affordable: Women White Mini Stylish Bag (₹319)! Carries essentials perfectly. Other cheap options: Light Everyday Shopping Bag (₹359) and Women Brown Canvas Tote Bag (₹429)!"
  ],
  
  "whats the most expensive item": [
    "Men White Knitted Sweater Vest at ₹8,765! Also Men Printed Suit Blazer (₹8,760) - bold patterned, tailored for parties and fashion events.",
    "Top price: Men White Knitted Sweater Vest ₹8,765! Runner-up: Men Printed Suit Blazer (₹8,760) - bold patterns, tailored for parties/fashion events.",
    "Highest priced: Men White Knitted Sweater Vest (₹8,765)! Close second: Men Printed Suit Blazer ₹8,760 - bold patterned tailoring for parties and fashion events!"
  ],
  
  "show me products under 500": [
    "Women White Mini Bag (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469).",
    "Budget picks under ₹500: Women White Mini Bag (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469)!",
    "Under ₹500 options: Women White Mini Bag (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469)!"
  ],
  
  "what can i get between 1000-2000": [
    "Tons of options! Sunglasses (₹975-₹1,399), Jewelry (₹780-₹1,599), Perfumes (₹1,199-₹1,799), Sneakers (₹1,899-₹1,999), Bags (₹1,299-₹1,890), Hats (₹1,049-₹1,499), and more!",
    "Loads in ₹1000-2000 range! Sunglasses (₹975-₹1,399), Jewelry (₹780-₹1,599), Perfumes (₹1,199-₹1,799), Sneakers (₹1,899-₹1,999), Bags (₹1,299-₹1,890), Hats (₹1,049-₹1,499), plus more!",
    "Plenty between ₹1000-2000! Sunglasses range (₹975-₹1,399), Jewelry pieces (₹780-₹1,599), Perfume selection (₹1,199-₹1,799), Sneaker options (₹1,899-₹1,999), Bag variety (₹1,299-₹1,890), Hat choices (₹1,049-₹1,499), and beyond!"
  ],
  
  // BAGS - PRICE QUERIES
  "cheapest bag": [
    "Women White Mini Stylish Bag at ₹319! Cute mini tote for essentials – wallet, phone, keys. Lightweight and adorable!",
    "Lowest bag price: Women White Mini Stylish Bag ₹319! Cute mini tote for wallet, phone, keys. Lightweight adorableness!",
    "Most affordable bag: Women White Mini Stylish Bag (₹319)! Adorable mini tote holding essentials - wallet, phone, keys. Super lightweight!"
  ],

  "bags under 500": [
    "Women White Mini Bag (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469).",
    "Budget bags under ₹500: Women White Mini (₹319), Light Everyday Shopping Bag (₹359), Women Black Canvas (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Women Brown Printed Canvas Tote (₹469)!",
    "Bags below ₹500: Women White Mini Bag (₹319), Light Everyday Shopping (₹359), Women Black Canvas Bag (₹359), Women Brown Canvas Tote (₹429), Pastel Summer Carryall (₹429), Brown Printed Canvas Tote (₹469)!"
  ],

  "most expensive bag": [
    "Women Leather Crossbody Bag Set - Tan & Beige at ₹2,649! Premium structured set with angular silhouette – modern elegance at its finest.",
    "Top bag price: Women Leather Crossbody Bag Set - Tan & Beige ₹2,649! Premium structured angular silhouette - modern elegance perfected.",
    "Highest bag cost: Women Leather Crossbody Set - Tan & Beige (₹2,649)! Premium structured design with angular silhouette – ultimate modern elegance!"
  ],

  "bags between 700-1000": [
    "Quilted Style Party Tote (₹749), Women Classic Canvas Tote (₹799), Women Tan Leather Shoulder Bag (₹998), Women PU Leather Tote Set (₹999).",
    "₹700-1000 bag range: Quilted Style Party Tote (₹749), Women Classic Canvas Tote (₹799), Women Tan Leather Shoulder Bag (₹998), Women PU Leather Tote Set (₹999)!",
    "Bags in ₹700-1000: Quilted Style Party Tote (₹749), Women Classic Canvas Tote (₹799), Women Tan Leather Shoulder (₹998), Women PU Leather Tote Set (₹999)!"
  ],

  "leather bags between 1000-2000": [
    "Elegant Leather Handbag with Gold Clasp (₹1,299), Women Beaded Pearl Handbag (₹1,890).",
    "Leather bags ₹1000-2000: Elegant Leather Handbag with Gold Clasp (₹1,299), Women Beaded Pearl Handbag (₹1,890)!",
    "₹1000-2000 leather options: Elegant Leather Handbag/Gold Clasp (₹1,299), Women Beaded Pearl Handbag (₹1,890)!"
  ],

  // HATS - PRICE QUERIES
  "cheapest hat": [
    "Men Abstract Camouflage Cap at ₹599! Bold red-beige pattern, perfect for streetwear.",
    "Lowest hat price: Men Abstract Camouflage Cap ₹599! Bold red-beige pattern streetwear perfection.",
    "Most affordable hat: Men Abstract Camo Cap (₹599)! Bold red-beige pattern ideal for streetwear!"
  ],

  "hats under 800": [
    "Men Abstract Camo Cap (₹599), Women Printed Bucket Hat (₹699), Women Straw Hat Summer Boho (₹799).",
    "Budget hats under ₹800: Men Abstract Camo Cap (₹599), Women Printed Bucket Hat (₹699), Women Straw Hat Summer Boho (₹799)!",
    "Hats below ₹800: Men Abstract Camo Cap (₹599), Women Printed Bucket Hat (₹699), Women Straw Hat Summer Boho (₹799)!"
  ],

  "most expensive hat": [
    "Women Textured Brim Hat - Evening Black at ₹1,499! Bold, wide brim, perfect for formal evening wear.",
    "Top hat price: Women Textured Brim Hat - Evening Black ₹1,499! Bold wide brim formal evening perfection.",
    "Highest hat cost: Women Textured Brim Hat - Evening Black (₹1,499)! Bold, wide brim, formal evening ideal!"
  ],

  "womens hats between 1000-1500": [
    "Women Straw Sun Hat (₹1,049), Men Classic Fedora (₹1,190), Women Wide Brim Felt Hat (₹1,349), Women Textured Brim Hat (₹1,499).",
    "Women's ₹1000-1500 hats: Women Straw Sun Hat (₹1,049), Men Classic Fedora (₹1,190), Women Wide Brim Felt (₹1,349), Women Textured Brim (₹1,499)!",
    "₹1000-1500 women's hat range: Women Straw Sun Hat (₹1,049), Men Classic Fedora (₹1,190), Women Wide Brim Felt Hat (₹1,349), Women Textured Brim Hat (₹1,499)!"
  ],

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
  "compare womens blazer vs mens blazer": [
    "Women's (Beige Blazer ₹6,547, Beige with Tank ₹3,240) are tailored, chic, office-ready. Men's (Plaid ₹5,300, Burgundy Wool ₹5,466, Printed ₹8,760) are structured, bold, fashion statements. Both offer power dressing!",
    "Blazer comparison: Women's options (Beige Blazer ₹6,547, Beige/Tank ₹3,240) tailored chic office-ready. Men's choices (Plaid ₹5,300, Burgundy Wool ₹5,466, Printed ₹8,760) structured bold fashion statements. Both deliver power dressing!",
    "Women vs Men blazers: Women's (Beige Blazer ₹6,547, Beige with Tank ₹3,240) - tailored, chic, office perfection. Men's (Plaid ₹5,300, Burgundy Wool ₹5,466, Printed ₹8,760) - structured, bold, statement-making. Power dressing both ways!"
  ],
  
  "co-ord set vs separate pieces – which is better value": [
    "Co-ord Sets (Beige Sweatshirt ₹2,999, Rust Knit Wide-Leg Pants ₹2,658) give you complete outfits instantly – effortless styling! Separates offer mix-and-match flexibility. Co-ords = convenience, Separates = versatility!",
    "Value comparison: Co-ord Sets (Beige Sweatshirt ₹2,999, Rust Knit Wide-Leg ₹2,658) instant complete outfits - effortless styling! Separates provide mix-match flexibility. Co-ords equal convenience, Separates equal versatility!",
    "Co-ord vs Separates: Co-ord Sets (Beige Sweatshirt ₹2,999, Rust Knit Wide-Leg Pants ₹2,658) - instant outfits, effortless! Separates - flexible mixing/matching. Co-ords = convenience win, Separates = versatility win!"
  ],
  
  "wool coat vs bomber jacket – which is warmer": [
    "Wool Coat (Red Oversized ₹4,200, Black Overcoat ₹6,450) are premium warm, structured – winter essentials! Bomber Jacket (White ₹3,450) is lighter, casual – spring/fall layering. Wool = maximum warmth, Bomber = transitional!",
    "Warmth battle: Wool Coat (Red Oversized ₹4,200, Black Overcoat ₹6,450) premium warm structured - winter must-haves! Bomber Jacket (White ₹3,450) lighter casual - spring/fall layers. Wool equals max warmth, Bomber equals transition!",
    "Coat vs Jacket warmth: Wool Coats (Red Oversized ₹4,200, Black Overcoat ₹6,450) - premium warmth, structured, winter essential! Bomber Jacket (White ₹3,450) - lighter, casual, spring/fall perfect. Wool = warmest, Bomber = transitional!"
  ],
  
  "floral blouse vs white blouse – which is more versatile": [
    "White Blouses (V-neck ₹6,340, Cotton Shirt Set ₹2,899) are timeless, pair with everything – ultimate versatile! Floral Tie-Neck (₹1,580) is cheerful, vintage, statement – spring/summer charm. White = wardrobe staple, Floral = personality!",
    "Versatility check: White Blouses (V-neck ₹6,340, Cotton Shirt Set ₹2,899) timeless pairs-with-all - ultimate versatile! Floral Tie-Neck (₹1,580) cheerful vintage statement - spring/summer charmer. White equals staple, Floral equals personality!",
    "Blouse comparison: White options (V-neck ₹6,340, Cotton Shirt Set ₹2,899) - timeless, matches everything, ultimate versatility! Floral Tie-Neck (₹1,580) - cheerful, vintage, statement spring/summer. White = essential, Floral = character!"
  ],
  
  "mens silk shirt vs cotton shirt – which is better for summer": [
    "Silk Shirt (Beige ₹4,600) is luxurious, smooth, party-ready – evening elegance! Cotton Shirt (Yellow Striped ₹2,977) is breathable, casual, everyday – practical comfort. Silk = luxury, Cotton = daily wear!",
    "Summer shirt battle: Silk Shirt (Beige ₹4,600) luxurious smooth party-ready - evening elegance! Cotton Shirt (Yellow Striped ₹2,977) breathable casual everyday - practical comfort. Silk equals luxury, Cotton equals daily!",
    "Men's summer shirts: Silk option (Beige ₹4,600) - luxurious, smooth, party-perfect, evening elegance! Cotton choice (Yellow Striped ₹2,977) - breathable, casual, everyday practical comfort. Silk = luxury wear, Cotton = daily comfort!"
  ],
  
  "tennis dress vs wrap dress – which is more comfortable": [
    "Tennis Dress (₹3,345) is sporty, breathable, activewear – athletic comfort! Wrap Dress (Rust Linen ₹3,000) is breezy, flattering, summer elegant – elevated comfort. Tennis = athletic, Wrap = elegant ease!",
    "Comfort comparison: Tennis Dress (₹3,345) sporty breathable activewear - athletic comfort! Wrap Dress (Rust Linen ₹3,000) breezy flattering summer elegance - elevated comfort. Tennis equals athletic, Wrap equals elegant!",
    "Dress comfort: Tennis Dress (₹3,345) - sporty, breathable, activewear athletic comfort! Wrap Dress (Rust Linen ₹3,000) - breezy, flattering, summer elegance, elevated comfort. Tennis = sporty, Wrap = elegant!"
  ],
  
  "oversized sweater vs fitted sweater – which looks better": [
    "Oversized (Blue Floral Knit ₹5,490, Rust Textured ₹3,500) are cozy, relaxed, trendy – casual chic! Fitted (Black Turtleneck ₹5,775) are sleek, polished, classic – sophisticated. Oversized = comfort trend, Fitted = timeless elegance!",
    "Sweater style: Oversized options (Blue Floral Knit ₹5,490, Rust Textured ₹3,500) cozy relaxed trendy - casual chic! Fitted choice (Black Turtleneck ₹5,775) sleek polished classic - sophisticated. Oversized equals comfort-trend, Fitted equals timeless!",
    "Sweater showdown: Oversized picks (Blue Floral Knit ₹5,490, Rust Textured ₹3,500) - cozy, relaxed, trendy casual chic! Fitted option (Black Turtleneck ₹5,775) - sleek, polished, classic sophistication. Oversized = trendy comfort, Fitted = timeless elegance!"
  ],

  // BOTTOMWEAR COMPARISONS
  "corduroy trousers vs beige trendy trousers – which is more formal": [
    "Corduroy Brown (₹1,200) is tailored, textured, formal/semi-formal perfect – office meetings! Beige Trendy (₹1,600) is modern, fashion-forward – creative workplaces, smart casual. Corduroy = traditional formal, Beige = modern formal!",
    "Formality comparison: Corduroy Brown (₹1,200) tailored textured formal/semi-formal - office meeting ideal! Beige Trendy (₹1,600) modern fashion-forward - creative workplace smart casual. Corduroy equals traditional-formal, Beige equals modern-formal!",
    "Trouser formality: Corduroy Brown (₹1,200) - tailored, textured, formal/semi-formal office meetings! Beige Trendy (₹1,600) - modern, fashion-forward creative spaces, smart casual. Corduroy = classic formal, Beige = contemporary formal!"
  ],

  "pleated skirt vs maxi skirt – which is more elegant": [
    "Both elegant! Pleated Skirt (White ₹1,300) is feminine, flowy, semi-formal – versatile chic! Maxi Skirt (Black Urban ₹1,600, Black Pleated ₹1,600) is sophisticated, floor-length – elevated elegance. Pleated = playful, Maxi = dramatic!",
    "Elegance face-off: Both elegant! Pleated Skirt (White ₹1,300) feminine flowy semi-formal - versatile chic! Maxi Skirt (Black Urban ₹1,600, Black Pleated ₹1,600) sophisticated floor-length - elevated elegance. Pleated equals playful, Maxi equals dramatic!",
    "Skirt elegance: Both win! Pleated Skirt (White ₹1,300) - feminine, flowy, semi-formal versatile chic! Maxi Skirt (Black Urban ₹1,600, Black Pleated ₹1,600) - sophisticated, floor-length elevated elegance. Pleated = playful elegance, Maxi = dramatic elegance!"
  ],

  "wide-leg pants vs fitted pants – which is trendier": [
    "Wide-Leg (Rust Knit Top Set ₹2,658) are modern, structured, street-style edge – very trendy! Fitted (Black Pleated ₹1,500) are classic, sleek, timeless – always stylish. Wide-leg = fashion-forward, Fitted = timeless!",
    "Trend check: Wide-Leg (Rust Knit Top Set ₹2,658) modern structured street-style edge - very trendy! Fitted (Black Pleated ₹1,500) classic sleek timeless - always stylish. Wide-leg equals fashion-forward, Fitted equals timeless!",
    "Pants trend: Wide-Leg option (Rust Knit Top Set ₹2,658) - modern, structured, street-style edge, very trendy! Fitted choice (Black Pleated ₹1,500) - classic, sleek, timeless always stylish. Wide-leg = trendy now, Fitted = eternally stylish!"
  ],

  "shorts vs trousers for summer – which is better": [
    "Shorts (Men White Pleated ₹1,100) are cool, casual, perfect for hot days – maximum comfort! Trousers (Beige Trendy ₹1,600) are polished, versatile, office-appropriate – more formal. Shorts = casual summer, Trousers = smart summer!",
    "Summer bottoms: Shorts (Men White Pleated ₹1,100) cool casual perfect hot days - maximum comfort! Trousers (Beige Trendy ₹1,600) polished versatile office-appropriate - more formal. Shorts equal casual-summer, Trousers equal smart-summer!",
    "Summer choice: Shorts (Men White Pleated ₹1,100) - cool, casual, hot day perfection, maximum comfort! Trousers (Beige Trendy ₹1,600) - polished, versatile, office-ready, more formal. Shorts = casual heat, Trousers = smart heat!"
  ],

  "pinstriped pants vs solid black pants – which is more professional": [
    "Both professional! Pinstriped (Women Striped Trousers Set ₹1,800, Grey Knit Cardigan Set ₹1,300) are sharp, traditional, business formal – classic power! Solid Black (Black Pleated ₹1,500, Grey Cardigan Set ₹1,400) are versatile, modern, easier to style. Pinstriped = corporate, Black = versatile pro!",
    "Professional comparison: Both pro! Pinstriped (Women Striped Trousers Set ₹1,800, Grey Knit Cardigan Set ₹1,300) sharp traditional business-formal - classic power! Solid Black (Black Pleated ₹1,500, Grey Cardigan Set ₹1,400) versatile modern easy-styling. Pinstriped equals corporate, Black equals versatile-professional!",
    "Professionalism test: Both work! Pinstriped options (Women Striped Trousers Set ₹1,800, Grey Knit Cardigan Set ₹1,300) - sharp, traditional, business formal classic power! Solid Black choices (Black Pleated ₹1,500, Grey Cardigan Set ₹1,400) - versatile, modern, easier styling. Pinstriped = traditional pro, Black = flexible pro!"
  ],

  // BAGS COMPARISONS
  "canvas tote vs leather bag – which is more durable": [
    "Leather (Crossbody Set ₹2,649, Tan Shoulder Bag ₹998, Elegant Handbag ₹1,299) is premium, long-lasting, ages beautifully – investment pieces! Canvas (Brown Tote ₹429, Classic Tote ₹799) is sturdy, washable, casual – great value! Leather = luxury durability, Canvas = practical durability!",
    "Durability battle: Leather (Crossbody Set ₹2,649, Tan Shoulder ₹998, Elegant Handbag ₹1,299) premium long-lasting ages-beautifully - investment! Canvas (Brown Tote ₹429, Classic Tote ₹799) sturdy washable casual - great value! Leather equals luxury-durability, Canvas equals practical-durability!",
    "Bag durability: Leather options (Crossbody Set ₹2,649, Tan Shoulder Bag ₹998, Elegant Handbag ₹1,299) - premium, long-lasting, ages beautifully, investment worthy! Canvas picks (Brown Tote ₹429, Classic Tote ₹799) - sturdy, washable, casual great value! Leather = luxe durability, Canvas = practical durability!"
  ],

  "tote bag vs crossbody bag – which is better for daily use": [
    "Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) are spacious, shoulder-carry, fit laptops – everyday workhorse! Crossbody (Leather Set ₹2,649) is hands-free, compact, secure – travel-friendly! Tote = capacity, Crossbody = convenience!",
    "Daily use comparison: Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) spacious shoulder-carry fit-laptops - everyday workhorse! Crossbody (Leather Set ₹2,649) hands-free compact secure - travel-friendly! Tote equals capacity, Crossbody equals convenience!",
    "Daily bag choice: Tote options (Brown Canvas ₹429, Classic Canvas ₹799) - spacious, shoulder-carry, laptop-friendly everyday workhorse! Crossbody pick (Leather Set ₹2,649) - hands-free, compact, secure travel-ready! Tote = space winner, Crossbody = convenience winner!"
  ],

  "mini bag vs large tote – which should I buy": [
    "Mini Bag (White Stylish ₹319) is cute, essentials only (phone, wallet, keys) – nights out, minimal days! Large Tote (Canvas ₹799, PU Leather Set ₹999) fits laptop, books, groceries – work, college, errands! Mini = light travel, Large = daily needs!",
    "Size decision: Mini Bag (White Stylish ₹319) cute essentials-only (phone wallet keys) - nights-out minimal-days! Large Tote (Canvas ₹799, PU Leather Set ₹999) fits laptop-books-groceries - work college errands! Mini equals light-travel, Large equals daily-needs!",
    "Bag size guide: Mini option (White Stylish ₹319) - cute, essentials only (phone, wallet, keys), nights out, minimal days! Large Tote choices (Canvas ₹799, PU Leather Set ₹999) - laptop, books, groceries fit, work, college, errands! Mini = minimalist, Large = maximalist!"
  ],

  "brown canvas tote vs black canvas bag – which is more versatile": [
    "Both versatile! Brown Canvas (₹429) is warm, pairs with earth tones, casual chic – boho vibes! Black Canvas (₹359) is sleek, minimalist, pairs with everything – modern edge. Brown = warm casual, Black = cool minimal!",
    "Canvas versatility: Both versatile! Brown Canvas (₹429) warm pairs-earth-tones casual-chic - boho vibes! Black Canvas (₹359) sleek minimalist pairs-everything - modern edge. Brown equals warm-casual, Black equals cool-minimal!",
    "Color versatility: Both work everywhere! Brown Canvas (₹429) - warm, earth tone pairing, casual chic boho vibes! Black Canvas (₹359) - sleek, minimalist, everything pairing modern edge. Brown = warm aesthetic, Black = cool aesthetic!"
  ],

  "PU leather vs genuine leather – what's the difference": [
    "PU Leather (Tote Set ₹999) is vegan, affordable, easy maintenance – great value! Genuine Leather (Crossbody Set ₹2,649, Elegant Handbag ₹1,299) is premium, ages beautifully, long-lasting – investment! PU = budget-friendly, Genuine = luxury!",
    "Leather types: PU Leather (Tote Set ₹999) vegan affordable easy-maintenance - great value! Genuine Leather (Crossbody Set ₹2,649, Elegant Handbag ₹1,299) premium ages-beautifully long-lasting - investment! PU equals budget-friendly, Genuine equals luxury!",
    "Leather comparison: PU option (Tote Set ₹999) - vegan, affordable, easy maintenance, excellent value! Genuine choice (Crossbody Set ₹2,649, Elegant Handbag ₹1,299) - premium, ages beautifully, long-lasting investment! PU = wallet-friendly, Genuine = luxury pick!"
  ],

  "pearl handbag vs leather handbag – which is better for parties": [
    "Pearl Beaded (₹1,890) is bold, luminous, statement-making – weddings, summer parties, unique! Leather Handbag with Gold Clasp (₹1,299) is chic, sophisticated, elegant – formal evening events! Pearl = show-stopper, Leather = refined elegance!",
    "Party bag battle: Pearl Beaded (₹1,890) bold luminous statement-making - weddings summer-parties unique! Leather Handbag/Gold Clasp (₹1,299) chic sophisticated elegant - formal evening events! Pearl equals show-stopper, Leather equals refined-elegance!",
    "Party handbag choice: Pearl Beaded (₹1,890) - bold, luminous, statement wedding/summer party unique! Leather Handbag with Gold Clasp (₹1,299) - chic, sophisticated, elegant formal evenings! Pearl = attention-grabber, Leather = refined elegance!"
  ],

  "shopping bag vs tote bag – what's the difference": [
    "They're similar! Shopping Bags (Light Everyday ₹359) are lightweight, casual, grocery runs. Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) are sturdier, structured, fit more – work, college, daily carry. Both great for everyday!",
    "Bag difference: Similar types! Shopping Bags (Light Everyday ₹359) lightweight casual grocery-runs. Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) sturdier structured fit-more - work college daily-carry. Both everyday excellent!",
    "Shopping vs Tote: Very similar! Shopping Bags (Light Everyday ₹359) - lightweight, casual, grocery perfect. Tote Bags (Brown Canvas ₹429, Classic Canvas ₹799) - sturdier, structured, holds more, work/college/daily use. Both everyday winners!"
  ],

  // HATS COMPARISONS
  "wide brim hat vs fedora – which is more formal": [
    "Wide Brim (Women Felt ₹1,349, Textured Evening ₹1,499) are elegant, dramatic, formal events – sophistication! Fedora (Men Classic ₹1,190) is polished, structured, smart-casual – refined but versatile. Wide Brim = formal elegance, Fedora = smart casual!",
    "Hat formality: Wide Brim (Women Felt ₹1,349, Textured Evening ₹1,499) elegant dramatic formal-events - sophistication! Fedora (Men Classic ₹1,190) polished structured smart-casual - refined versatile. Wide Brim equals formal-elegance, Fedora equals smart-casual!",
    "Formal hat comparison: Wide Brim options (Women Felt ₹1,349, Textured Evening ₹1,499) - elegant, dramatic, formal event sophistication! Fedora choice (Men Classic ₹1,190) - polished, structured, smart-casual refined versatility. Wide Brim = formal, Fedora = casual-refined!"
  ],

  "straw hat vs felt hat – which is better for summer": [
    "Straw Hat (Beach Wide Brim ₹1,049, Summer Boho ₹799) is breathable, lightweight, sun protection – summer essential! Felt Hat (Black Wide Brim ₹1,349) is heavier, structured – autumn/winter elegance. Straw = summer, Felt = cool weather!",
    "Summer hat winner: Straw Hat (Beach Wide Brim ₹1,049, Summer Boho ₹799) breathable lightweight sun-protection - summer essential! Felt Hat (Black Wide Brim ₹1,349) heavier structured - autumn/winter elegance. Straw equals summer, Felt equals cool-weather!",
    "Summer hat choice: Straw options (Beach Wide Brim ₹1,049, Summer Boho ₹799) - breathable, lightweight, sun protection summer essential! Felt pick (Black Wide Brim ₹1,349) - heavier, structured autumn/winter elegance. Straw = hot weather, Felt = cold weather!"
  ],

  "bucket hat vs baseball cap – which is trendier": [
    "Bucket Hat (Animal Print Beige ₹699) is Y2K revival, festival fashion, unisex – very trendy! Baseball Cap (Abstract Camo ₹599) is classic streetwear, sporty, everyday – timeless cool. Bucket = fashion trend, Cap = street staple!",
    "Trend check: Bucket Hat (Animal Print Beige ₹699) Y2K-revival festival-fashion unisex - very trendy! Baseball Cap (Abstract Camo ₹599) classic streetwear sporty everyday - timeless cool. Bucket equals fashion-trend, Cap equals street-staple!",
    "Hat trend: Bucket Hat (Animal Print Beige ₹699) - Y2K revival, festival fashion, unisex very trendy! Baseball Cap (Abstract Camo ₹599) - classic streetwear, sporty, everyday timeless cool. Bucket = trending now, Cap = forever classic!"
  ],

  "mens hat vs womens hat – can I wear both": [
    "Absolutely! Men's (Fedora ₹1,190, Abstract Cap ₹599) are classic, structured. Women's (Wide Brim ₹1,349, Straw Hat ₹1,049) are elegant, sun-protective. Unisex (Printed Bucket ₹699) works for everyone! Hats are for ALL!",
    "Gender-free hats: Absolutely yes! Men's (Fedora ₹1,190, Abstract Cap ₹599) classic structured. Women's (Wide Brim ₹1,349, Straw Hat ₹1,049) elegant sun-protective. Unisex (Printed Bucket ₹699) everyone-friendly! Hats for ALL people!",
    "Wear both? Absolutely! Men's options (Fedora ₹1,190, Abstract Cap ₹599) - classic, structured. Women's choices (Wide Brim ₹1,349, Straw Hat ₹1,049) - elegant, sun protection. Unisex pick (Printed Bucket ₹699) - universal fit! Hats belong to EVERYONE!"
  ],

  "black hat vs beige hat – which is more versatile": [
    "Black Hats (Wide Brim ₹1,349, Textured Brim ₹1,499) are dramatic, formal, pair with everything – sophisticated edge! Beige/Natural (Fedora ₹1,190, Straw Hats ₹799-₹1,049) are soft, casual, summery – warm vibes. Black = formal versatile, Beige = casual versatile!",
    "Hat color versatility: Black Hats (Wide Brim ₹1,349, Textured Brim ₹1,499) dramatic formal pairs-everything - sophisticated edge! Beige/Natural (Fedora ₹1,190, Straw Hats ₹799-₹1,049) soft casual summery - warm vibes. Black equals formal-versatile, Beige equals casual-versatile!",
    "Color comparison: Black options (Wide Brim ₹1,349, Textured Brim ₹1,499) - dramatic, formal, universal pairing sophisticated edge! Beige/Natural picks (Fedora ₹1,190, Straw Hats ₹799-₹1,049) - soft, casual, summery warm vibes. Black = formal flex, Beige = casual flex!"
  ],

  // Product Comparisons - Accessories
  "hat vs bag": [
    "Hats (Wide Brim ₹1,349, Fedora ₹1,190, Bucket Hat ₹699) add dramatic flair and sun protection! Bags (Canvas Totes ₹319-₹799, Leather ₹999-₹2,649) offer practical style. Consider occasion and needs!",
    "Accessories choice: Hats (Wide Brim ₹1,349, Fedora ₹1,190, Bucket Hat ₹699) dramatic-flair sun-protection! Bags (Canvas Totes ₹319-₹799, Leather ₹999-₹2,649) practical-style. Think occasion and needs!",
    "Hat or Bag: Hats options (Wide Brim ₹1,349, Fedora ₹1,190, Bucket Hat ₹699) - dramatic flair + sun protection! Bag choices (Canvas Totes ₹319-₹799, Leather ₹999-₹2,649) - practical + stylish. Decide by occasion and needs!"
  ],

  // Jewelry Comparisons  
  "pearl necklace vs gold necklace": [
    "Depends on your style! Pearl Layered Back Necklace (₹1,350) is elegant and dramatic for backless dresses. Gold Chain with Blue Crystal Hearts (₹1,599) is romantic and versatile for necklines. Pearls = classic formal, Gold = everyday charm!",
    "Necklace styles: Your preference! Pearl Layered Back Necklace (₹1,350) elegant dramatic backless-dresses. Gold Chain/Blue Crystal Hearts (₹1,599) romantic versatile necklines. Pearls equal classic-formal, Gold equals everyday-charm!",
    "Pearl vs Gold: Style dependent! Pearl Layered Back Necklace (₹1,350) - elegant, dramatic for backless dresses. Gold Chain with Blue Crystal Hearts (₹1,599) - romantic, versatile for all necklines. Pearls = formal classic, Gold = daily charm!"
  ],
  
  "freshwater pearl beach choker vs chunky shell bead choker": [
    "Beach Choker (₹780) is delicate, handcrafted, perfect for boho beach vibes. Shell Bead Choker (₹2,399) is bold, statement-making with gold detailing – more luxe! Beach = casual chic, Shell = bold glam.",
    "Choker comparison: Beach Choker (₹780) delicate handcrafted boho-beach vibes. Shell Bead Choker (₹2,399) bold statement-making gold-detailing - more luxe! Beach equals casual-chic, Shell equals bold-glam.",
    "Choker styles: Beach Choker (₹780) - delicate, handcrafted, boho beach perfection. Shell Bead Choker (₹2,399) - bold, statement gold details, more luxurious! Beach = casual chic, Shell = glamorous bold!"
  ],
  
  "pearl jewelry vs crystal jewelry": [
    "Pearls (Beach Choker ₹780, Layered Back ₹1,350) offer timeless elegance and natural beauty – perfect for formal events. Crystal (Gold Chain Blue Hearts ₹1,599, Amber Pendant ₹1,299) adds sparkle and color – great for romantic or evening looks!",
    "Jewelry types: Pearls (Beach Choker ₹780, Layered Back ₹1,350) timeless elegance natural-beauty - formal events perfect. Crystal (Gold Chain Blue Hearts ₹1,599, Amber Pendant ₹1,299) sparkle-color - romantic/evening looks great!",
    "Pearl vs Crystal: Pearls (Beach Choker ₹780, Layered Back ₹1,350) - timeless elegance, natural beauty, formal event perfection. Crystal options (Gold Chain Blue Hearts ₹1,599, Amber Pendant ₹1,299) - sparkle, color, romantic/evening excellence!"
  ],
  
  "necklace for weddings": [
    "Pearl Layered Back Necklace (₹1,350) is PERFECT for backless bridal gowns! Also great: Amber Crystal Pendant (₹1,299) for warm-toned evening elegance.",
    "Wedding necklace: Pearl Layered Back Necklace (₹1,350) PERFECT backless-bridal gowns! Also excellent: Amber Crystal Pendant (₹1,299) warm-toned evening elegance.",
    "Bridal jewelry: Pearl Layered Back Necklace (₹1,350) - PERFECT for backless gowns! Alternative: Amber Crystal Pendant (₹1,299) - warm-toned evening elegance!"
  ],
  
  // Perfume Comparisons
  "flame essence vs wave eau": [
    "Flame Essence (₹1,450) is bold, smoky spice with warm woods – evening statement scent. Wave Eau (₹1,799) is clean, aquatic with sea salt and white amber – daily freshness. Flame = drama, Wave = serenity!",
    "Perfume duel: Flame Essence (₹1,450) bold smoky-spice warm-woods - evening statement scent. Wave Eau (₹1,799) clean aquatic sea-salt white-amber - daily freshness. Flame equals drama, Wave equals serenity!",
    "Fragrance comparison: Flame Essence (₹1,450) - bold, smoky spice, warm woods evening statement! Wave Eau (₹1,799) - clean, aquatic, sea salt/white amber daily freshness. Flame = dramatic, Wave = serene!"
  ],
  
  "womens perfume vs unisex perfume": [
    "Women's (Sheer Light ₹1,350, Sunfig Bloom ₹1,250) are softer, floral, citrus – delicate and feminine. Unisex (Flame Essence ₹1,450, Lum Eau ₹1,199) are bold, warm, versatile – anyone can rock them! Women's = gentle, Unisex = statement.",
    "Perfume categories: Women's (Sheer Light ₹1,350, Sunfig Bloom ₹1,250) softer floral citrus - delicate feminine. Unisex (Flame Essence ₹1,450, Lum Eau ₹1,199) bold warm versatile - anyone wears! Women's equals gentle, Unisex equals statement.",
    "Gender fragrance: Women's options (Sheer Light ₹1,350, Sunfig Bloom ₹1,250) - softer, floral, citrus delicate feminine. Unisex choices (Flame Essence ₹1,450, Lum Eau ₹1,199) - bold, warm, versatile for everyone! Women's = gentle, Unisex = bold!"
  ],
  
  "tropical sunfig bloom vs subtle glow sheer light": [
    "Sunfig Bloom (₹1,250) is vibrant, exotic with fig and jasmine – beach vacation energy! Sheer Light (₹1,350) is airy, light with citrus and white tea – everyday office-friendly. Sunfig = bold summer, Sheer = subtle elegance!",
    "Scent comparison: Sunfig Bloom (₹1,250) vibrant exotic fig-jasmine - beach vacation energy! Sheer Light (₹1,350) airy light citrus-white-tea - everyday office-friendly. Sunfig equals bold-summer, Sheer equals subtle-elegance!",
    "Women's fragrances: Sunfig Bloom (₹1,250) - vibrant, exotic fig/jasmine beach vacation energy! Sheer Light (₹1,350) - airy, light citrus/white tea everyday office perfect. Sunfig = bold summer, Sheer = subtle elegance!"
  ],
  
  "luxury blue glass perfume vs premium glass set": [
    "Blue Glass (₹890) is single designer bottle – luxe and affordable. Premium Set (₹1,299) gives you THREE bottles for gifting or variety! Set = better value, Blue = statement piece.",
    "Perfume value: Blue Glass (₹890) single designer bottle - luxe affordable. Premium Set (₹1,299) THREE bottles gifting-variety! Set equals better-value, Blue equals statement-piece.",
    "Bottle comparison: Blue Glass (₹890) - single designer bottle, luxe + affordable. Premium Set (₹1,299) - THREE bottles for gifts/variety! Set = value winner, Blue = statement winner!"
  ],
  
  "citrus orange vs amber perfumes": [
    "Both are Eau de Parfum (8-12 hours)! Citrus Orange (₹670) is fresh, zesty – energizing. Amber bottles (Square ₹620, Flame Essence ₹1,450) are warm, deeper – sophisticated. Citrus = daytime, Amber = all-day richness!",
    "Scent profiles: Both Eau de Parfum (8-12hrs)! Citrus Orange (₹670) fresh zesty - energizing. Amber bottles (Square ₹620, Flame Essence ₹1,450) warm deeper - sophisticated. Citrus equals daytime, Amber equals all-day-richness!",
    "Perfume types: Both Eau de Parfum lasting 8-12 hours! Citrus Orange (₹670) - fresh, zesty energizing. Amber options (Square ₹620, Flame Essence ₹1,450) - warm, deeper sophisticated. Citrus = day energy, Amber = all-day depth!"
  ],
  
  // Footwear Comparisons
  "yellow heels vs red heels": [
    "Lemon Yellow (Classic Pointed ₹2,199) is playful, bold, pairs with neutrals and denim. Red (Classic Pointed ₹2,199) is classic power, works with black, white, beige. Yellow = fun statement, Red = timeless elegance! Both versatile!",
    "Heel color battle: Lemon Yellow (Classic Pointed ₹2,199) playful bold pairs-neutrals-denim. Red (Classic Pointed ₹2,199) classic power works-black-white-beige. Yellow equals fun-statement, Red equals timeless-elegance! Both versatile!",
    "Colored heels: Lemon Yellow (Classic Pointed ₹2,199) - playful, bold, neutral/denim pairing. Red (Classic Pointed ₹2,199) - classic power, black/white/beige matching. Yellow = fun statement, Red = timeless elegance! Both work everywhere!"
  ],
  
  "stiletto heels vs block heel boots": [
    "Stiletto Heels (Pastel ₹2,299) are elegant, dressy, 3-3.5 inch – formal events, parties. Block Heel Boots (Knee-High ₹2,799) are comfortable, structured – winter fashion, office wear. Stiletto = glamour, Block = all-day comfort!",
    "Heel type comparison: Stiletto Heels (Pastel ₹2,299) elegant dressy 3-3.5inch - formal-events parties. Block Heel Boots (Knee-High ₹2,799) comfortable structured - winter-fashion office-wear. Stiletto equals glamour, Block equals all-day-comfort!",
    "Heel styles: Stiletto Heels (Pastel ₹2,299) - elegant, dressy, 3-3.5 inch height, formal events/parties. Block Heel Boots (Knee-High ₹2,799) - comfortable, structured winter fashion, office ready. Stiletto = glamorous, Block = comfortable!"
  ],
  
  "sneakers vs boots winter": [
    "Boots (Knee-High Leather ₹2,799, Chelsea ₹2,598, Combat ₹2,499) offer warmth, coverage, style – winter essentials! Sneakers (Chunky Blue ₹2,799) are sporty, casual but less warm. Boots = winter winner!",
    "Winter footwear: Boots (Knee-High Leather ₹2,799, Chelsea ₹2,598, Combat ₹2,499) warmth coverage style - winter essentials! Sneakers (Chunky Blue ₹2,799) sporty casual less-warm. Boots equal winter-winner!",
    "Cold weather shoes: Boots options (Knee-High Leather ₹2,799, Chelsea ₹2,598, Combat ₹2,499) - warmth, coverage, style winter essentials! Sneakers choice (Chunky Blue ₹2,799) - sporty, casual but lacking warmth. Boots = winter champions!"
  ],
  
  "mens tan sneakers vs maroon sneakers": [
    "Tan Brown Sneakers (₹2,299) are sleek, minimal, neutral – office-casual versatile. Maroon Low Top (₹3,456) adds refined color pop – fashion-forward! Tan = everyday, Maroon = standout style!",
    "Men's sneaker colors: Tan Brown Sneakers (₹2,299) sleek minimal neutral - office-casual versatile. Maroon Low Top (₹3,456) refined color-pop - fashion-forward! Tan equals everyday, Maroon equals standout-style!",
    "Sneaker comparison: Tan Brown (₹2,299) - sleek, minimal, neutral office-casual versatility. Maroon Low Top (₹3,456) - refined color pop, fashion-forward! Tan = daily wear, Maroon = statement style!"
  ],
  
  "chelsea boots vs combat boots": [
    "Chelsea Boots (Glossy Black ₹2,598) are sleek, slip-on – formal and semi-formal perfect! Combat Boots (Black Suede ₹2,499) are rugged, masculine – casual outdoor vibes. Chelsea = dress up, Combat = dress down!",
    "Boot styles: Chelsea Boots (Glossy Black ₹2,598) sleek slip-on - formal/semi-formal perfect! Combat Boots (Black Suede ₹2,499) rugged masculine - casual outdoor vibes. Chelsea equals dress-up, Combat equals dress-down!",
    "Boot comparison: Chelsea (Glossy Black ₹2,598) - sleek, slip-on, formal/semi-formal perfection! Combat (Black Suede ₹2,499) - rugged, masculine, casual outdoor style. Chelsea = formal, Combat = casual!"
  ],
  
  "mules vs heels": [
    "Mules (Black Pointed ₹1,899) are slip-on, flat/low – everyday office comfort! Heels (₹2,199-₹2,799) are elevated, 3-3.5 inch – glamorous but less comfy. Mules = comfort, Heels = elegance!",
    "Footwear comfort: Mules (Black Pointed ₹1,899) slip-on flat/low - everyday office comfort! Heels (₹2,199-₹2,799) elevated 3-3.5inch - glamorous less-comfy. Mules equal comfort, Heels equal elegance!",
    "Shoe choice: Mules (Black Pointed ₹1,899) - slip-on, flat/low height, everyday office comfort! Heels range (₹2,199-₹2,799) - elevated 3-3.5 inches, glamorous but less comfortable. Mules = comfort win, Heels = elegance win!"
  ],
  
  "pink sneakers vs olive green sneakers": [
    "Pink Chunky Sneakers (₹2,365) are bold, elevated street style – fashion statement! Olive Green Chunky (₹1,899) are versatile, sporty – everyday cool. Pink = trendsetter, Olive = versatile cool!",
    "Sneaker colors: Pink Chunky Sneakers (₹2,365) bold elevated street-style - fashion statement! Olive Green Chunky (₹1,899) versatile sporty - everyday cool. Pink equals trendsetter, Olive equals versatile-cool!",
    "Colorful sneakers: Pink Chunky (₹2,365) - bold, elevated street style fashion statement! Olive Green Chunky (₹1,899) - versatile, sporty everyday cool. Pink = trend leader, Olive = reliable cool!"
  ],
  
  // Sunglasses Comparisons
  "cat eye vs round sunglasses": [
    "Cat-eye (White ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) are sharp, retro, suit angular faces – bold statement! Round (Red Oversized ₹1,199, Black & Gold Geometric ₹1,299) are softer, vintage, suit square faces – playful! Try both styles!",
    "Sunglasses shapes: Cat-eye (White ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) sharp retro angular-faces - bold statement! Round (Red Oversized ₹1,199, Black & Gold Geometric ₹1,299) softer vintage square-faces - playful! Try both!",
    "Frame styles: Cat-eye options (White ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) - sharp, retro, angular face flattering, bold statement! Round choices (Red Oversized ₹1,199, Black & Gold Geometric ₹1,299) - softer, vintage, square face suits, playful! Test both styles!"
  ],
  
  "white cat eye vs black cat eye": [
    "White Frame (₹1,099) is futuristic, slim, daytime cool. Sharp Black (₹1,199) is dramatic, powerful, dark – evening edge. White = modern minimal, Black = bold power!",
    "Cat-eye colors: White Frame (₹1,099) futuristic slim daytime-cool. Sharp Black (₹1,199) dramatic powerful dark - evening edge. White equals modern-minimal, Black equals bold-power!",
    "Color comparison: White Frame (₹1,099) - futuristic, slim, daytime cool vibes. Sharp Black (₹1,199) - dramatic, powerful, dark evening edge. White = minimal modern, Black = powerful bold!"
  ],
  
  "oversized amber shield vs octagon gradient blue": [
    "Both are PERFECT! Amber Shield (₹1,149) is sporty, futuristic, unisex – high-impact. Octagon Blue (₹1,399) is playful, golden frame, gradient – retro twist. Amber = sporty, Octagon = retro!",
    "Style showdown: Both PERFECT! Amber Shield (₹1,149) sporty futuristic unisex - high-impact. Octagon Blue (₹1,399) playful golden-frame gradient - retro twist. Amber equals sporty, Octagon equals retro!",
    "Both winners: Amber Shield (₹1,149) - sporty, futuristic, unisex high-impact! Octagon Blue (₹1,399) - playful, golden frame, gradient retro twist! Amber = athletic style, Octagon = vintage style!"
  ],
  
  "mens sunglasses vs womens sunglasses": [
    "Absolutely! Men's (Dark Rectangle ₹1,050) are classic, sharp, timeless. Women's (Cat-eye, Oval styles) are bold, fashion-forward. Unisex options (Amber Shield ₹1,149, Octagon Blue ₹1,399, Mint Green ₹999) work for EVERYONE! Style has no gender!",
    "Gender-free sunglasses: Absolutely! Men's (Dark Rectangle ₹1,050) classic sharp timeless. Women's (Cat-eye Oval) bold fashion-forward. Unisex (Amber Shield ₹1,149, Octagon Blue ₹1,399, Mint Green ₹999) EVERYONE wears! Style genderless!",
    "Anyone can wear: Absolutely! Men's option (Dark Rectangle ₹1,050) - classic, sharp, timeless. Women's range (Cat-eye, Oval styles) - bold, fashion-forward. Unisex choices (Amber Shield ₹1,149, Octagon Blue ₹1,399, Mint Green ₹999) - work for ALL! No gender in style!"
  ],
  
  "transparent vs solid frames": [
    "Transparent (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) are bold, playful, Y2K vibes – super trendy! Solid (Black Cat-Eye ₹1,199, White Frame ₹1,099) are classic, versatile – timeless. Transparent = fashion-forward, Solid = always chic!",
    "Frame types: Transparent (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) bold playful Y2K-vibes - super trendy! Solid (Black Cat-Eye ₹1,199, White Frame ₹1,099) classic versatile - timeless. Transparent equals fashion-forward, Solid equals always-chic!",
    "Frame style: Transparent options (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) - bold, playful, Y2K vibes super trendy! Solid picks (Black Cat-Eye ₹1,199, White Frame ₹1,099) - classic, versatile, timeless. Transparent = trendy now, Solid = forever chic!"
  ],
  
  "sunglasses uv protection": [
    "YES! Every single pair has 100% UV400 protection. All come with protective case and cleaning cloth. Style AND safety guaranteed!",
    "UV protection confirmed: YES! Every pair 100% UV400 protected. All include protective case + cleaning cloth. Style AND safety both guaranteed!",
    "Protection guaranteed: YES! All pairs feature 100% UV400 protection. Every purchase includes protective case and cleaning cloth. Style meets safety!"
  ],
  
  "frosted steel blue cat eye vs slim green oval": [
    "Steel Blue (₹1,249) is icy, sharp, futuristic – unforgettable statement! Green Oval (₹975) is sleek, moss-toned, minimalist – modern taste. Steel = avant-garde, Green = understated cool!",
    "Sunglasses styles: Steel Blue (₹1,249) icy sharp futuristic - unforgettable statement! Green Oval (₹975) sleek moss-toned minimalist - modern taste. Steel equals avant-garde, Green equals understated-cool!",
    "Style comparison: Steel Blue (₹1,249) - icy, sharp, futuristic unforgettable statement! Green Oval (₹975) - sleek, moss-toned, minimalist modern taste. Steel = avant-garde bold, Green = understated cool!"
  ],
  
  // Category Browsing - Jewelry
  "what jewelry do you have": [
    "9 stunning pieces! Pearl necklaces (Layered Back ₹1,350, Beach Choker ₹780, Gold Layered Set ₹990, Pearl Layered ₹2,699, Statement Pearl ₹2,899), Crystal jewelry (Gold Chain Blue & Crystal Hearts ₹1,599, Amber Crystal Pendant ₹1,299), Statement pieces (Chunky Shell Bead Choker ₹2,399). All handcrafted!",
    "Our jewelry collection features 9 stunning pieces! Pearl options - Layered Back ₹1,350, Beach Choker ₹780, Gold Layered Set ₹990, Pearl Layered ₹2,699, Statement Pearl ₹2,899. Crystal selections - Gold Chain Blue/Crystal Hearts ₹1,599, Amber Crystal Pendant ₹1,299. Statement choice - Chunky Shell Bead Choker ₹2,399. Everything handcrafted!",
    "9 gorgeous jewelry pieces await! Pearls include - Layered Back (₹1,350), Beach Choker (₹780), Gold Layered Set (₹990), Pearl Layered (₹2,699), Statement Pearl (₹2,899). Crystals feature - Gold Chain Blue & Crystal Hearts (₹1,599), Amber Crystal Pendant (₹1,299). Statement piece - Chunky Shell Bead Choker (₹2,399). All handcrafted quality!"
  ],
  
  "do you have pearl jewelry": [
    "Yes! 6 pearl pieces: Layered Back Necklace (₹1,350) - perfect for backless dresses, Freshwater Beach Choker (₹780) - boho vibes, Pearl & Gold Layered Set (₹990) - everyday elegance, Pearl Layered Necklace (₹2,699) - resort glamour, Statement Pearl (₹2,899) - artistic bold. All genuine freshwater pearls!",
    "Absolutely! 6 pearl options: Layered Back Necklace (₹1,350) backless-dress perfection, Freshwater Beach Choker (₹780) boho-vibes, Pearl & Gold Layered Set (₹990) everyday-elegance, Pearl Layered Necklace (₹2,699) resort-glamour, Statement Pearl (₹2,899) artistic-bold. All genuine freshwater!",
    "Yes, 6 pearl pieces available! Layered Back Necklace (₹1,350) - backless dress ideal, Freshwater Beach Choker (₹780) - bohemian style, Pearl & Gold Layered Set (₹990) - daily elegance, Pearl Layered Necklace (₹2,699) - resort chic, Statement Pearl (₹2,899) - bold artistry. Genuine freshwater pearls throughout!"
  ],
  
  "show me necklaces": [
    "All 9 jewelry items are necklaces! From chokers (Beach Choker ₹780, Shell Bead ₹2,399) to layered pieces (Back Necklace ₹1,350, Gold Layered Set ₹990) to pendants (Amber Crystal ₹1,299, Gold Chain Hearts ₹1,599).",
    "Every jewelry piece is a necklace - 9 total! Choker styles - Beach Choker ₹780, Shell Bead ₹2,399. Layered designs - Back Necklace ₹1,350, Gold Layered Set ₹990. Pendant options - Amber Crystal ₹1,299, Gold Chain Hearts ₹1,599!",
    "Our entire jewelry collection of 9 items consists of necklaces! Chokers include - Beach Choker (₹780), Shell Bead (₹2,399). Layered pieces feature - Back Necklace (₹1,350), Gold Layered Set (₹990). Pendants showcase - Amber Crystal (₹1,299), Gold Chain Hearts (₹1,599)!"
  ],
  
  "do you have accessories": [
    "Yes! Jewelry (9 necklaces ₹780-₹2,899), Sunglasses (17 styles ₹899-₹1,399), Bags (13 styles ₹319-₹2,649), Hats (8 styles ₹599-₹1,499). Complete your look!",
    "Absolutely! Accessories galore - Jewelry (9 necklaces ₹780-₹2,899), Sunglasses (17 styles ₹899-₹1,399), Bags (13 styles ₹319-₹2,649), Hats (8 styles ₹599-₹1,499). Look completion guaranteed!",
    "Yes, full accessory range! Jewelry collection - 9 necklaces (₹780-₹2,899), Sunglasses variety - 17 styles (₹899-₹1,399), Bag selection - 13 styles (₹319-₹2,649), Hat assortment - 8 styles (₹599-₹1,499). Perfect your outfit!"
  ],
  
  "women jewelry only": [
    "All 9 jewelry pieces are for women! Pearl necklaces, crystal pendants, chokers, statement pieces. Prices ₹780-₹2,899.",
    "Every jewelry piece designed for women - 9 total! Pearl necklaces, crystal pendants, chokers, statement designs. Price range ₹780-₹2,899!",
    "Complete women's jewelry collection - all 9 pieces! Includes pearl necklaces, crystal pendants, chokers, statement items. Priced ₹780-₹2,899!"
  ],

  // Category Browsing - Perfumes
  "what perfumes do you sell": [
    "12 premium fragrances! Unisex (Flame Essence ₹1,450, Lum Eau ₹1,199, Wave Eau ₹1,799, Citrus Orange ₹670, Minimalist Cube ₹580), Women's (Sheer Light ₹1,350, Sunfig Bloom ₹1,250, Round Bottle ₹450, Blue Glass ₹890, Square Amber ₹620, Soft Teardrop ₹720), Sets (Premium Glass Set ₹1,299). All Eau de Parfum!",
    "Premium fragrance collection of 12! Unisex options - Flame Essence ₹1,450, Lum Eau ₹1,199, Wave Eau ₹1,799, Citrus Orange ₹670, Minimalist Cube ₹580. Women's selections - Sheer Light ₹1,350, Sunfig Bloom ₹1,250, Round Bottle ₹450, Blue Glass ₹890, Square Amber ₹620, Soft Teardrop ₹720. Gift set - Premium Glass Set ₹1,299. All Eau de Parfum concentration!",
    "12 premium scents available! Unisex range - Flame Essence (₹1,450), Lum Eau (₹1,199), Wave Eau (₹1,799), Citrus Orange (₹670), Minimalist Cube (₹580). Women's line - Sheer Light (₹1,350), Sunfig Bloom (₹1,250), Round Bottle (₹450), Blue Glass (₹890), Square Amber (₹620), Soft Teardrop (₹720). Set option - Premium Glass Set (₹1,299). Eau de Parfum quality throughout!"
  ],
  
  "do you have womens perfumes": [
    "7 women's fragrances! Sheer Light (₹1,350) - citrus & white tea, daily wear, Sunfig Bloom (₹1,250) - tropical floral, summer garden, Blue Glass Perfume (₹890) - luxury designer bottle, Square Amber Glow (₹620) - classic warm floral, Elegant Round Bottle (₹450) - minimalist gift, Soft Teardrop (₹720) - earthy musky, Premium Glass Set (₹1,299) - trio for gifting!",
    "Women's perfume collection of 7! Sheer Light (₹1,350) citrus-white-tea daily-wear, Sunfig Bloom (₹1,250) tropical-floral summer-garden, Blue Glass Perfume (₹890) luxury-designer bottle, Square Amber Glow (₹620) classic-warm floral, Elegant Round Bottle (₹450) minimalist-gift, Soft Teardrop (₹720) earthy-musky, Premium Glass Set (₹1,299) trio-gifting!",
    "7 fragrances for women available! Sheer Light (₹1,350) - citrus/white tea daily scent, Sunfig Bloom (₹1,250) - tropical floral summer vibe, Blue Glass Perfume (₹890) - designer luxury bottle, Square Amber Glow (₹620) - warm floral classic, Elegant Round Bottle (₹450) - minimal gift perfect, Soft Teardrop (₹720) - earthy musk notes, Premium Glass Set (₹1,299) - gifting trio!"
  ],
  
  "show me unisex fragrances": [
    "5 unisex perfumes! Flame Essence (₹1,450) - smoky spice & warm woods, Lum Eau (₹1,199) - amber, vetiver & musk, Wave Eau (₹1,799) - sea salt & white amber, Citrus Orange (₹670) - zesty fresh energy, Minimalist Cube (₹580) - clean modern scent!",
    "Unisex scent collection of 5! Flame Essence (₹1,450) smoky-spice warm-woods, Lum Eau (₹1,199) amber-vetiver-musk, Wave Eau (₹1,799) sea-salt white-amber, Citrus Orange (₹670) zesty-fresh energy, Minimalist Cube (₹580) clean-modern scent!",
    "5 unisex perfume options! Flame Essence (₹1,450) - smoky spice/warm woods blend, Lum Eau (₹1,199) - amber/vetiver/musk mix, Wave Eau (₹1,799) - sea salt/white amber aquatic, Citrus Orange (₹670) - zesty fresh energizing, Minimalist Cube (₹580) - clean modern fragrance!"
  ],
  
  "do you have perfume gift sets": [
    "Yes! Premium Glass Perfume Set (₹1,299) - luxury trio of bottles, beautifully packaged, perfect for gifting! All individual perfumes also come gift-ready.",
    "Absolutely! Premium Glass Perfume Set (₹1,299) luxury-trio bottles, beautiful-packaging, gifting-perfection! All individual perfumes gift-ready too!",
    "Yes, gift set available! Premium Glass Perfume Set (₹1,299) - luxurious trio bottles, beautifully packaged for gifts! Plus all individual perfumes come gift-ready!"
  ],
  
  "long lasting perfumes": [
    "ALL our perfumes are Eau de Parfum concentration - 8-12 hour wear! Top picks: Flame Essence (₹1,450), Wave Eau (₹1,799), Lum Eau (₹1,199).",
    "Every perfume is Eau de Parfum - 8-12 hour longevity! Best choices: Flame Essence (₹1,450), Wave Eau (₹1,799), Lum Eau (₹1,199)!",
    "All fragrances Eau de Parfum concentration - lasting 8-12 hours! Top recommendations: Flame Essence (₹1,450), Wave Eau (₹1,799), Lum Eau (₹1,199)!"
  ],

  // Category Browsing - Footwear
  "what shoes do you have": [
    "15 styles! Men's (sneakers ₹1,899-₹3,456, Chelsea boots ₹2,598, combat boots ₹2,499), Women's (heels ₹2,199-₹2,799, knee-high boots ₹2,799, mules ₹1,899, chunky sneakers ₹2,365), Unisex (brown suede sneakers ₹2,499, black Chelsea boots ₹2,598).",
    "Footwear collection of 15! Men's options - sneakers (₹1,899-₹3,456), Chelsea boots (₹2,598), combat boots (₹2,499). Women's selections - heels (₹2,199-₹2,799), knee-high boots (₹2,799), mules (₹1,899), chunky sneakers (₹2,365). Unisex choices - brown suede sneakers (₹2,499), black Chelsea boots (₹2,598)!",
    "15 shoe styles available! Men's range - sneaker variety (₹1,899-₹3,456), Chelsea boots (₹2,598), combat boots (₹2,499). Women's lineup - heel collection (₹2,199-₹2,799), knee-high boots (₹2,799), mules (₹1,899), chunky sneakers (₹2,365). Unisex options - brown suede sneakers (₹2,499), black Chelsea boots (₹2,598)!"
  ],
  
  "womens topwear": [
    "21 styles! Casual (Rust Ribbed Cotton Top ₹1,450, Floral Tie-Neck Blouse ₹1,580, Beige Co-ord Sweatshirt ₹2,999, White V-neck ₹6,340), Formal (White Cotton Shirt Set ₹2,899, Beige Blazer Sets ₹3,240-₹6,547), Dresses (Rust Linen Wrap ₹3,000, Black Jacket Dress ₹3,977, Tennis Dress ₹3,345), Winter (Rust Knit Sweater ₹3,500, Red Wool Coat ₹4,200, Black Turtleneck ₹5,775, Blue Floral Knit ₹5,490, Cardigans ₹3,986-₹5,679).",
    "Women's top collection - 21 pieces! Casual range - Rust Ribbed Cotton Top (₹1,450), Floral Tie-Neck Blouse (₹1,580), Beige Co-ord Sweatshirt (₹2,999), White V-neck (₹6,340). Formal options - White Cotton Shirt Set (₹2,899), Beige Blazer Sets (₹3,240-₹6,547). Dress selection - Rust Linen Wrap (₹3,000), Black Jacket Dress (₹3,977), Tennis Dress (₹3,345). Winter wear - Rust Knit Sweater (₹3,500), Red Wool Coat (₹4,200), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Cardigans (₹3,986-₹5,679)!",
    "21 women's topwear styles! Casual picks - Rust Ribbed Cotton Top (₹1,450), Floral Tie-Neck Blouse (₹1,580), Beige Co-ord Sweatshirt (₹2,999), White V-neck (₹6,340). Formal choices - White Cotton Shirt Set (₹2,899), Beige Blazer Sets (₹3,240-₹6,547). Dress lineup - Rust Linen Wrap (₹3,000), Black Jacket Dress (₹3,977), Tennis Dress (₹3,345). Winter collection - Rust Knit Sweater (₹3,500), Red Wool Coat (₹4,200), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Cardigans (₹3,986-₹5,679)!"
  ],
  
  "mens topwear": [
    "12 styles! Shirts (Yellow Striped Cotton ₹2,977, Beige Silk ₹4,600), Blazers (Plaid with Turtleneck ₹5,300, Burgundy Wool ₹5,466, Printed Suit ₹8,760), Suits (Black with Burgundy Shirt ₹4,350), Jackets (White Bomber ₹3,450, Mustard Yellow Zip ₹5,630, Olive Green Zip ₹3,456), Winter (Black Wool Overcoat ₹6,450, Green Turtleneck ₹3,489, White Knitted Vest ₹8,765).",
    "Men's topwear - 12 pieces! Shirt options - Yellow Striped Cotton (₹2,977), Beige Silk (₹4,600). Blazer range - Plaid/Turtleneck (₹5,300), Burgundy Wool (₹5,466), Printed Suit (₹8,760). Suit choice - Black/Burgundy Shirt (₹4,350). Jacket selection - White Bomber (₹3,450), Mustard Yellow Zip (₹5,630), Olive Green Zip (₹3,456). Winter items - Black Wool Overcoat (₹6,450), Green Turtleneck (₹3,489), White Knitted Vest (₹8,765)!",
    "12 men's top styles! Shirts available - Yellow Striped Cotton (₹2,977), Beige Silk (₹4,600). Blazers featured - Plaid with Turtleneck (₹5,300), Burgundy Wool (₹5,466), Printed Suit (₹8,760). Suit offering - Black with Burgundy Shirt (₹4,350). Jackets included - White Bomber (₹3,450), Mustard Yellow Zip (₹5,630), Olive Green Zip (₹3,456). Winter lineup - Black Wool Overcoat (₹6,450), Green Turtleneck (₹3,489), White Knitted Vest (₹8,765)!"
  ],
  
  "womens hats": [
    "5 styles! Wide Brim Felt Hat (₹1,349) - elegant black formal, Textured Brim Hat (₹1,499) - evening black dramatic, Straw Sun Hat (₹1,049) - beach wide brim, Straw Hat Summer Boho (₹799) - woven natural, Textured Teal Wide Brim (₹899) - bold fashion statement!",
    "Women's hat collection - 5 pieces! Wide Brim Felt Hat (₹1,349) elegant-black formal, Textured Brim Hat (₹1,499) evening-black dramatic, Straw Sun Hat (₹1,049) beach-wide-brim, Straw Hat Summer Boho (₹799) woven-natural, Textured Teal Wide Brim (₹899) bold-fashion statement!",
    "5 women's hat styles! Wide Brim Felt (₹1,349) - elegant black formal wear, Textured Brim (₹1,499) - evening black drama, Straw Sun Hat (₹1,049) - beach wide brim protection, Straw Hat Summer Boho (₹799) - woven natural style, Textured Teal Wide Brim (₹899) - bold fashion declaration!"
  ],
  
  "mens hats": [
    "2 styles! Classic Fedora Beige & Brown Band (₹1,190) - polished smart-casual, Abstract Camouflage Cap (₹599) - red-beige streetwear! Plus unisex Printed Bucket Hat works great for men!",
    "Men's hat options - 2 pieces! Classic Fedora Beige/Brown Band (₹1,190) polished smart-casual, Abstract Camouflage Cap (₹599) red-beige streetwear! Bonus: unisex Printed Bucket Hat perfect for men!",
    "2 men's hat styles! Classic Fedora with Beige & Brown Band (₹1,190) - polished smart-casual look, Abstract Camouflage Cap (₹599) - red-beige streetwear edge! Plus unisex Printed Bucket Hat ideal for men too!"
  ],
  
  "show me womens footwear": [
    "8 women's styles! Heels (Classic Pointed Yellow & Red ₹2,199, Pastel Stiletto Green & Pink ₹2,299, Dual-Tone Cream & Red ₹2,799, Black Patent Red Sole ₹2,599), Boots (Knee-High Leather Block Heel ₹2,799), Mules (Pointed Toe Black ₹1,899), Sneakers (Chunky Pink ₹2,365).",
    "Women's footwear collection - 8 pieces! Heels range - Classic Pointed Yellow/Red (₹2,199), Pastel Stiletto Green/Pink (₹2,299), Dual-Tone Cream/Red (₹2,799), Black Patent Red Sole (₹2,599). Boots option - Knee-High Leather Block Heel (₹2,799). Mules choice - Pointed Toe Black (₹1,899). Sneakers pick - Chunky Pink (₹2,365)!",
    "8 women's shoe styles! Heel selection - Classic Pointed Yellow & Red (₹2,199), Pastel Stiletto Green & Pink (₹2,299), Dual-Tone Cream & Red (₹2,799), Black Patent Red Sole (₹2,599). Boot offering - Knee-High Leather Block Heel (₹2,799). Mules available - Pointed Toe Black (₹1,899). Sneaker feature - Chunky Pink (₹2,365)!"
  ],
  
  "mens shoes": [
    "7 men's styles! Sneakers (Retro Striped ₹1,999, Tan Brown ₹2,299, Brown Suede ₹2,499, Blue Chunky Sports ₹2,799, Olive Chunky ₹1,899, Maroon Low Top ₹3,456), Boots (Glossy Black Chelsea ₹2,598, Black Suede Combat ₹2,499).",
    "Men's shoe lineup - 7 pieces! Sneaker range - Retro Striped (₹1,999), Tan Brown (₹2,299), Brown Suede (₹2,499), Blue Chunky Sports (₹2,799), Olive Chunky (₹1,899), Maroon Low Top (₹3,456). Boot options - Glossy Black Chelsea (₹2,598), Black Suede Combat (₹2,499)!",
    "7 men's footwear styles! Sneakers featured - Retro Striped (₹1,999), Tan Brown (₹2,299), Brown Suede (₹2,499), Blue Chunky Sports (₹2,799), Olive Chunky (₹1,899), Maroon Low Top (₹3,456). Boots included - Glossy Black Chelsea (₹2,598), Black Suede Combat (₹2,499)!"
  ],
  
  "do you have heels": [
    "Yes! 5 stunning styles: Classic Pointed Yellow & Red (₹2,199) - retro playful, Pastel Stiletto Green & Pink (₹2,299) - elegant brunch-ready, Black Patent Red Sole (₹2,599) - sultry night-out, Dual-Tone Cream & Red (₹2,799) - formal chic. All 3-3.5 inch mid-heels!",
    "Absolutely! 5 heel styles: Classic Pointed Yellow/Red (₹2,199) retro-playful, Pastel Stiletto Green/Pink (₹2,299) elegant brunch-ready, Black Patent Red Sole (₹2,599) sultry night-out, Dual-Tone Cream/Red (₹2,799) formal-chic. All 3-3.5inch mid-heels!",
    "Yes, 5 gorgeous heel options! Classic Pointed Yellow & Red (₹2,199) - retro playful style, Pastel Stiletto Green & Pink (₹2,299) - elegant brunch perfect, Black Patent Red Sole (₹2,599) - sultry night vibes, Dual-Tone Cream & Red (₹2,799) - formal chic elegance. All feature 3-3.5 inch mid-heels!"
  ],
  
  "show me boots": [
    "3 boot styles! Women's Knee-High Leather Block Heel (₹2,799) - chic winter fashion, Men's Glossy Black Chelsea (₹2,598) - formal sleek, Men's Black Suede Combat (₹2,499) - rugged outdoor. Plus unisex Chelsea boots!",
    "Boot collection - 3 pieces! Women's Knee-High Leather Block Heel (₹2,799) chic-winter fashion, Men's Glossy Black Chelsea (₹2,598) formal-sleek, Men's Black Suede Combat (₹2,499) rugged-outdoor. Bonus: unisex Chelsea boots!",
    "3 boot options available! Women's Knee-High Leather Block Heel (₹2,799) - chic winter styling, Men's Glossy Black Chelsea (₹2,598) - formal sleek look, Men's Black Suede Combat (₹2,499) - rugged outdoor feel. Plus unisex Chelsea boots offered!"
  ],
  
  "casual shoes": [
    "Sneakers - Men's Retro (₹1,999), Tan Brown (₹2,299), Olive Chunky (₹1,899), Women's Pink Chunky (₹2,365), Unisex Brown Suede (₹2,499). Mules - Women's Black Pointed (₹1,899). All comfortable daily wear!",
    "Casual footwear: Sneakers include - Men's Retro (₹1,999), Tan Brown (₹2,299), Olive Chunky (₹1,899), Women's Pink Chunky (₹2,365), Unisex Brown Suede (₹2,499). Mules feature - Women's Black Pointed (₹1,899). All comfy-daily wear!",
    "Casual shoe selection: Sneaker options - Men's Retro (₹1,999), Tan Brown (₹2,299), Olive Chunky (₹1,899), Women's Pink Chunky (₹2,365), Unisex Brown Suede (₹2,499). Mules available - Women's Black Pointed (₹1,899). Every pair comfortable for daily wearing!"
  ],
  
  "formal footwear": [
    "Women's Heels (₹2,199-₹2,799) - all styles work for formal events, Men's Chelsea Boots (₹2,598) - polished formal, Women's Knee-High Boots (₹2,799) - structured elegance.",
    "Formal shoe options: Women's Heels (₹2,199-₹2,799) all-styles formal-events, Men's Chelsea Boots (₹2,598) polished-formal, Women's Knee-High Boots (₹2,799) structured-elegance!",
    "Formal footwear choices: Women's Heel collection (₹2,199-₹2,799) - all styles formal event ready, Men's Chelsea Boots (₹2,598) - polished formal style, Women's Knee-High Boots (₹2,799) - structured elegant look!"
  ],
  
  // Category Browsing - Topwear
  "what tops do you have": [
    "33 pieces! Women's (21 styles ₹1,450-₹6,879), Men's (12 styles ₹2,977-₹8,765). Includes blouses, blazers, sweaters, coats, dresses, cardigans, turtlenecks, shirts, jackets!",
    "Topwear collection - 33 pieces! Women's range - 21 styles (₹1,450-₹6,879), Men's lineup - 12 styles (₹2,977-₹8,765). Features blouses, blazers, sweaters, coats, dresses, cardigans, turtlenecks, shirts, jackets!",
    "33-piece top collection! Women's selection - 21 styles priced ₹1,450-₹6,879, Men's offerings - 12 styles priced ₹2,977-₹8,765. Includes full range: blouses, blazers, sweaters, coats, dresses, cardigans, turtlenecks, shirts, jackets!"
  ],
  
  "womens topwear": "21 styles! Casual (Rust Ribbed Cotton Top ₹1,450, Floral Tie-Neck Blouse ₹1,580, Beige Co-ord Sweatshirt ₹2,999, White V-neck ₹6,340), Formal (White Cotton Shirt Set ₹2,899, Beige Blazer Sets ₹3,240-₹6,547), Dresses (Rust Linen Wrap ₹3,000, Black Jacket Dress ₹3,977, Tennis Dress ₹3,345), Winter (Rust Knit Sweater ₹3,500, Red Wool Coat ₹4,200, Black Turtleneck ₹5,775, Blue Floral Knit ₹5,490, Cardigans ₹3,986-₹5,679).",
  
  "mens topwear": "12 styles! Shirts (Yellow Striped Cotton ₹2,977, Beige Silk ₹4,600), Blazers (Plaid with Turtleneck ₹5,300, Burgundy Wool ₹5,466, Printed Suit ₹8,760), Suits (Black with Burgundy Shirt ₹4,350), Jackets (White Bomber ₹3,450, Mustard Yellow Zip ₹5,630, Olive Green Zip ₹3,456), Winter (Black Wool Overcoat ₹6,450, Green Turtleneck ₹3,489, White Knitted Vest ₹8,765).",
  
  "do you have blazers": [
    "Yes! Women's (Beige Blazer Turtleneck Set ₹6,547, Beige Blazer White Tank ₹3,240, Black Jacket Dress ₹3,977), Men's (Plaid Blazer Brown Turtleneck ₹5,300, Burgundy Wool Blazer ₹5,466, Printed Suit Blazer ₹8,760, Black Suit ₹4,350).",
    "Absolutely! Women's options - Beige Blazer Turtleneck Set (₹6,547), Beige Blazer White Tank (₹3,240), Black Jacket Dress (₹3,977). Men's choices - Plaid Blazer Brown Turtleneck (₹5,300), Burgundy Wool Blazer (₹5,466), Printed Suit Blazer (₹8,760), Black Suit (₹4,350)!",
    "Yes, blazer collection! Women's range - Beige Blazer Turtleneck Set (₹6,547), Beige Blazer White Tank (₹3,240), Black Jacket Dress (₹3,977). Men's lineup - Plaid Blazer Brown Turtleneck (₹5,300), Burgundy Wool Blazer (₹5,466), Printed Suit Blazer (₹8,760), Black Suit (₹4,350)!"
  ],
  
  "show me dresses": [
    "3 women's dresses! Off-Shoulder Rust Linen Wrap Dress (₹3,000) - summer elegance, Black Oversized Jacket Dress (₹3,977) - streetwear charm, Tennis Dress with Green Accent (₹3,345) - sporty chic!",
    "Dress collection - 3 women's styles! Off-Shoulder Rust Linen Wrap Dress (₹3,000) summer-elegance, Black Oversized Jacket Dress (₹3,977) streetwear-charm, Tennis Dress with Green Accent (₹3,345) sporty-chic!",
    "3 gorgeous dresses! Off-Shoulder Rust Linen Wrap Dress (₹3,000) - brings summer elegance, Black Oversized Jacket Dress (₹3,977) - delivers streetwear charm, Tennis Dress with Green Accent (₹3,345) - offers sporty chic style!"
  ],
  
  "winter wear": [
    "Women's (Rust Textured Knit Sweater ₹3,500, Red Oversized Wool Coat ₹4,200, Rust Cardigan ₹3,986, Black Turtleneck ₹5,775, Blue Floral Knit ₹5,490, Olive Trench Coat ₹6,879, Striped Sweater ₹4,567), Men's (Black Wool Overcoat ₹6,450, Green Turtleneck ₹3,489, White Knitted Vest ₹8,765, Burgundy Wool Blazer ₹5,466).",
    "Winter collection! Women's options - Rust Textured Knit Sweater (₹3,500), Red Oversized Wool Coat (₹4,200), Rust Cardigan (₹3,986), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Olive Trench Coat (₹6,879), Striped Sweater (₹4,567). Men's choices - Black Wool Overcoat (₹6,450), Green Turtleneck (₹3,489), White Knitted Vest (₹8,765), Burgundy Wool Blazer (₹5,466)!",
    "Winter wear available! Women's lineup - Rust Textured Knit Sweater (₹3,500), Red Oversized Wool Coat (₹4,200), Rust Cardigan (₹3,986), Black Turtleneck (₹5,775), Blue Floral Knit (₹5,490), Olive Trench Coat (₹6,879), Striped Sweater (₹4,567). Men's selection - Black Wool Overcoat (₹6,450), Green Turtleneck (₹3,489), White Knitted Vest (₹8,765), Burgundy Wool Blazer (₹5,466)!"
  ],
  
  "casual tops": [
    "Women's (Rust Ribbed Cotton ₹1,450, Floral Tie-Neck ₹1,580, Beige Co-ord Sweatshirt ₹2,999, White V-neck ₹6,340, White Linen Shirt ₹5,679), Men's (Yellow Striped Shirt ₹2,977, White Bomber Jacket ₹3,450).",
    "Casual top options! Women's picks - Rust Ribbed Cotton (₹1,450), Floral Tie-Neck (₹1,580), Beige Co-ord Sweatshirt (₹2,999), White V-neck (₹6,340), White Linen Shirt (₹5,679). Men's choices - Yellow Striped Shirt (₹2,977), White Bomber Jacket (₹3,450)!",
    "Casual topwear! Women's range - Rust Ribbed Cotton (₹1,450), Floral Tie-Neck (₹1,580), Beige Co-ord Sweatshirt (₹2,999), White V-neck (₹6,340), White Linen Shirt (₹5,679). Men's lineup - Yellow Striped Shirt (₹2,977), White Bomber Jacket (₹3,450)!"
  ],

  // Category Browsing - Bottomwear
  "what bottomwear do you have": [
    "14 styles! Men's (trousers, pants, shorts, cargo pants), Women's (pleated pants, skirts, trousers, wide-leg pants). Prices ₹1,100-₹1,800.",
    "Bottomwear collection - 14 pieces! Men's options - trousers, pants, shorts, cargo pants. Women's choices - pleated pants, skirts, trousers, wide-leg pants. Priced ₹1,100-₹1,800!",
    "14 bottomwear styles! Men's lineup covers trousers, pants, shorts, cargo pants. Women's range includes pleated pants, skirts, trousers, wide-leg pants. All ₹1,100-₹1,800!"
  ],
  
  "show me trousers": [
    "Men's (Corduroy Brown ₹1,200, Beige Trendy ₹1,600, Beige Cargo Pants ₹1,200), Women's (White Formal Pleated Pants ₹1,400, Black Pleated Pants ₹1,500, Black Striped Trousers Set ₹1,800, Light Gray Pants ₹1,500), Unisex (Neutral Beige Trousers ₹1,500).",
    "Trouser collection! Men's options - Corduroy Brown (₹1,200), Beige Trendy (₹1,600), Beige Cargo Pants (₹1,200). Women's picks - White Formal Pleated Pants (₹1,400), Black Pleated Pants (₹1,500), Black Striped Trousers Set (₹1,800), Light Gray Pants (₹1,500). Unisex choice - Neutral Beige Trousers (₹1,500)!",
    "Trousers available! Men's selection - Corduroy Brown (₹1,200), Beige Trendy (₹1,600), Beige Cargo Pants (₹1,200). Women's range - White Formal Pleated Pants (₹1,400), Black Pleated Pants (₹1,500), Black Striped Trousers Set (₹1,800), Light Gray Pants (₹1,500). Unisex offering - Neutral Beige Trousers (₹1,500)!"
  ],
  
  "womens bottomwear": [
    "9 styles! Pants (White Formal Pleated ₹1,400, Black Pleated ₹1,500, Light Gray Formal ₹1,500, Rust Knit Wide-Leg ₹2,658, Grey Knit Pinstriped ₹1,300), Skirts (White Pleated ₹1,300, Black Urban Maxi ₹1,600, Black Maxi Pleated ₹1,600), Sets (Black Striped Trousers with Blazer ₹1,800).",
    "Women's bottomwear - 9 pieces! Pants range - White Formal Pleated (₹1,400), Black Pleated (₹1,500), Light Gray Formal (₹1,500), Rust Knit Wide-Leg (₹2,658), Grey Knit Pinstriped (₹1,300). Skirt options - White Pleated (₹1,300), Black Urban Maxi (₹1,600), Black Maxi Pleated (₹1,600). Set featured - Black Striped Trousers with Blazer (₹1,800)!",
    "9 women's bottom styles! Pants selection - White Formal Pleated (₹1,400), Black Pleated (₹1,500), Light Gray Formal (₹1,500), Rust Knit Wide-Leg (₹2,658), Grey Knit Pinstriped (₹1,300). Skirt lineup - White Pleated (₹1,300), Black Urban Maxi (₹1,600), Black Maxi Pleated (₹1,600). Set available - Black Striped Trousers with Blazer (₹1,800)!"
  ],
  
  "mens trousers": [
    "5 styles! Corduroy Brown Trousers (₹1,200) - formal/semi-formal, Beige Trendy Trousers (₹1,600) - modern fashion, Grey Cardigan with Black Pants (₹1,400), Beige Cargo Pants (₹1,200) - street style, White Pleated Shorts (₹1,100) - summer casual!",
    "Men's trouser collection - 5 pieces! Corduroy Brown Trousers (₹1,200) formal/semi-formal, Beige Trendy Trousers (₹1,600) modern-fashion, Grey Cardigan with Black Pants (₹1,400), Beige Cargo Pants (₹1,200) street-style, White Pleated Shorts (₹1,100) summer-casual!",
    "5 men's trouser options! Corduroy Brown Trousers (₹1,200) - formal & semi-formal ready, Beige Trendy Trousers (₹1,600) - modern fashion forward, Grey Cardigan with Black Pants (₹1,400), Beige Cargo Pants (₹1,200) - street style edge, White Pleated Shorts (₹1,100) - summer casual vibes!"
  ],
  
  "do you have skirts": [
    "3 women's skirts! White Pleated Skirt (₹1,300) - chic feminine, Black Urban Maxi Skirt (₹1,600) - elegant timeless, Black Maxi Pleated Skirt (₹1,600) - sophisticated floor-length!",
    "Absolutely! 3 women's skirt styles: White Pleated Skirt (₹1,300) chic-feminine, Black Urban Maxi Skirt (₹1,600) elegant-timeless, Black Maxi Pleated Skirt (₹1,600) sophisticated floor-length!",
    "Yes, 3 skirt options! White Pleated Skirt (₹1,300) - chic feminine style, Black Urban Maxi Skirt (₹1,600) - elegant timeless piece, Black Maxi Pleated Skirt (₹1,600) - sophisticated floor-length design!"
  ],
  
  "formal pants": [
    "Men's (Corduroy Brown ₹1,200, Beige Trendy ₹1,600), Women's (White Formal Pleated ₹1,400, Black Pleated ₹1,500, Light Gray Formal ₹1,500, Black Striped Set ₹1,800).",
    "Formal pant options! Men's choices - Corduroy Brown (₹1,200), Beige Trendy (₹1,600). Women's picks - White Formal Pleated (₹1,400), Black Pleated (₹1,500), Light Gray Formal (₹1,500), Black Striped Set (₹1,800)!",
    "Formal pants available! Men's lineup - Corduroy Brown (₹1,200), Beige Trendy (₹1,600). Women's range - White Formal Pleated (₹1,400), Black Pleated (₹1,500), Light Gray Formal (₹1,500), Black Striped Set (₹1,800)!"
  ],

  // Category Browsing - Bags
  "what bags do you sell": [
    "13 styles! Tote bags (canvas ₹319-₹799, leather ₹999-₹2,649), Crossbody (leather ₹2,649), Shoulder bags (leather ₹998-₹1,299), Clutches (pearl handbag ₹1,890), Shopping bags (₹359-₹469). Something for everyone!",
    "Bag collection - 13 pieces! Tote bags available - canvas (₹319-₹799), leather (₹999-₹2,649). Crossbody option - leather (₹2,649). Shoulder bags featured - leather (₹998-₹1,299). Clutches include - pearl handbag (₹1,890). Shopping bags range - ₹359-₹469. Something for everyone!",
    "13 bag styles! Tote bags offered - canvas ₹319-₹799, leather ₹999-₹2,649. Crossbody available - leather ₹2,649. Shoulder bags selection - leather ₹998-₹1,299. Clutches featured - pearl handbag ₹1,890. Shopping bags priced - ₹359-₹469. Everyone finds something!"
  ],
  
  "womens bags": [
    "11 styles! Canvas Totes (Brown ₹429, Classic ₹799, Black ₹359, Printed ₹469, Pastel Summer ₹429, White Mini ₹319), Leather (Crossbody Set ₹2,649, Tan Shoulder Bag ₹998, PU Tote Set ₹999, Elegant Handbag ₹1,299, Pearl Handbag ₹1,890), Party (Quilted Green ₹749).",
    "Women's bag collection - 11 pieces! Canvas Totes range - Brown (₹429), Classic (₹799), Black (₹359), Printed (₹469), Pastel Summer (₹429), White Mini (₹319). Leather options - Crossbody Set (₹2,649), Tan Shoulder Bag (₹998), PU Tote Set (₹999), Elegant Handbag (₹1,299), Pearl Handbag (₹1,890). Party pick - Quilted Green (₹749)!",
    "11 women's bag styles! Canvas Totes include - Brown (₹429), Classic (₹799), Black (₹359), Printed (₹469), Pastel Summer (₹429), White Mini (₹319). Leather selection - Crossbody Set (₹2,649), Tan Shoulder Bag (₹998), PU Tote Set (₹999), Elegant Handbag (₹1,299), Pearl Handbag (₹1,890). Party choice - Quilted Green (₹749)!"
  ],
  
  "show me tote bags": [
    "8 tote styles! Canvas (Brown ₹429 - bestseller!, Classic ₹799, Black ₹359, Printed ₹469, Pastel Summer ₹429, White Mini ₹319, Light Shopping ₹359), Leather (PU Tote Set ₹999 - 3 colors!).",
    "Tote bag lineup - 8 pieces! Canvas options - Brown (₹429) bestseller!, Classic (₹799), Black (₹359), Printed (₹469), Pastel Summer (₹429), White Mini (₹319), Light Shopping (₹359). Leather choice - PU Tote Set (₹999) in 3 colors!",
    "8 tote bag options! Canvas range - Brown ₹429 (bestseller!), Classic ₹799, Black ₹359, Printed ₹469, Pastel Summer ₹429, White Mini ₹319, Light Shopping ₹359. Leather featured - PU Tote Set ₹999 (3 colors!)."
  ],
  
  "do you have leather bags": [
    "5 leather styles! Crossbody Set Tan & Beige (₹2,649) - premium structured, Tan Shoulder Bag (₹998) - everyday office, PU Leather Tote Set (₹999) - 3 classic shades, Elegant Handbag with Gold Clasp (₹1,299) - party-ready, Pearl Beaded Handbag (₹1,890) - wedding statement!",
    "Absolutely! 5 leather bag styles: Crossbody Set Tan & Beige (₹2,649) premium-structured, Tan Shoulder Bag (₹998) everyday-office, PU Leather Tote Set (₹999) 3-classic-shades, Elegant Handbag with Gold Clasp (₹1,299) party-ready, Pearl Beaded Handbag (₹1,890) wedding-statement!",
    "Yes, 5 leather options! Crossbody Set in Tan & Beige (₹2,649) - premium structured style, Tan Shoulder Bag (₹998) - everyday office carry, PU Leather Tote Set (₹999) - 3 classic shade choices, Elegant Handbag with Gold Clasp (₹1,299) - party-ready design, Pearl Beaded Handbag (₹1,890) - wedding statement piece!"
  ],
  
  "everyday bags": [
    "Canvas Totes (Brown ₹429, Classic ₹799, Black ₹359) - spacious, washable, laptop-friendly! Tan Leather Shoulder Bag (₹998) - structured daily carry. Perfect for work, college, errands!",
    "Everyday bag options! Canvas Totes available - Brown (₹429), Classic (₹799), Black (₹359) - spacious, washable, laptop-friendly! Tan Leather Shoulder Bag (₹998) - structured-daily-carry. Perfect work, college, errands!",
    "Daily carry bags! Canvas Totes - Brown ₹429, Classic ₹799, Black ₹359 (spacious, washable, laptop-friendly!). Tan Leather Shoulder Bag ₹998 - structured daily carrying. Perfect for work, college, and errands!"
  ],
  
  "party bags": [
    "Quilted Style Party Tote (₹749) - glossy green trendy, Elegant Leather Handbag with Gold Clasp (₹1,299) - wine red sophisticated, Pearl Beaded Handbag (₹1,890) - luminous statement for weddings!",
    "Party bag collection! Quilted Style Party Tote (₹749) glossy-green trendy, Elegant Leather Handbag with Gold Clasp (₹1,299) wine-red sophisticated, Pearl Beaded Handbag (₹1,890) luminous-statement weddings!",
    "Party-ready bags! Quilted Style Party Tote (₹749) - trendy glossy green, Elegant Leather Handbag with Gold Clasp (₹1,299) - sophisticated wine red, Pearl Beaded Handbag (₹1,890) - luminous wedding statement!"
  ],

  // Category Browsing - Hats
  "what hats do you have": [
    "8 styles! Women's (5 styles ₹699-₹1,499), Men's (2 styles ₹599-₹1,190), Unisex (1 style ₹699). Wide brim, fedoras, bucket hats, sun hats, caps!",
    "Hat collection - 8 pieces! Women's range - 5 styles (₹699-₹1,499). Men's options - 2 styles (₹599-₹1,190). Unisex choice - 1 style (₹699). Includes wide brim, fedoras, bucket hats, sun hats, caps!",
    "8 hat styles! Women's lineup - 5 styles priced ₹699-₹1,499. Men's selection - 2 styles priced ₹599-₹1,190. Unisex offering - 1 style at ₹699. Features wide brim, fedoras, bucket hats, sun hats, caps!"
  ],
  
  "womens hats": "5 styles! Wide Brim Felt Hat (₹1,349) - elegant black formal, Textured Brim Hat (₹1,499) - evening black dramatic, Straw Sun Hat (₹1,049) - beach wide brim, Straw Hat Summer Boho (₹799) - woven natural, Textured Teal Wide Brim (₹899) - bold fashion statement!",
  
  "mens hats": "2 styles! Classic Fedora Beige & Brown Band (₹1,190) - polished smart-casual, Abstract Camouflage Cap (₹599) - red-beige streetwear! Plus unisex Printed Bucket Hat works great for men!",
  
  "do you have sun hats": [
    "3 styles! Women's Straw Sun Hat Beach Wide Brim (₹1,049) - max sun protection tropical, Women's Straw Hat Summer Boho (₹799) - woven natural beige, Unisex Printed Bucket Hat (₹699) - animal print casual!",
    "Sun hat collection - 3 pieces! Women's Straw Sun Hat Beach Wide Brim (₹1,049) max-sun-protection tropical, Women's Straw Hat Summer Boho (₹799) woven-natural beige, Unisex Printed Bucket Hat (₹699) animal-print casual!",
    "3 sun hat options! Women's Straw Sun Hat Beach Wide Brim (₹1,049) - tropical max sun protection, Women's Straw Hat Summer Boho (₹799) - beige woven natural style, Unisex Printed Bucket Hat (₹699) - casual animal print!"
  ],
  
  "wide brim hats": [
    "4 styles! Women's Elegant Black Felt (₹1,349), Women's Textured Evening Black (₹1,499), Women's Straw Beach (₹1,049), Women's Textured Teal (₹899). All dramatic, sun-protective, statement-making!",
    "Wide brim collection - 4 pieces! Women's Elegant Black Felt (₹1,349), Women's Textured Evening Black (₹1,499), Women's Straw Beach (₹1,049), Women's Textured Teal (₹899). All dramatic, sun-protective, statement-making!",
    "4 wide brim options! Women's Elegant Black Felt (₹1,349), Women's Textured Evening Black (₹1,499), Women's Straw Beach (₹1,049), Women's Textured Teal (₹899). Every one dramatic, sun-protective, and statement-making!"
  ],
  
  "casual hats": [
    "Printed Bucket Hat (₹699) - animal print beige, Abstract Camo Cap (₹599) - red-beige streetwear, Straw Hats (₹799-₹1,049) - summer boho!",
    "Casual hat options! Printed Bucket Hat (₹699) animal-print beige, Abstract Camo Cap (₹599) red-beige streetwear, Straw Hats (₹799-₹1,049) summer-boho!",
    "Casual hat selection! Printed Bucket Hat (₹699) - beige animal print, Abstract Camo Cap (₹599) - streetwear red-beige, Straw Hats (₹799-₹1,049) - boho summer styles!"
  ],

  // Material and Quality
  "cotton products": [
    "All our cotton products:\n- Women Round Neck Cotton Top\n- Men Round Neck Pure Cotton T-shirt\n- Girls Round Neck Cotton Top\nAll made with high-quality cotton fabric.",
    "Cotton product lineup! Women Round Neck Cotton Top, Men Round Neck Pure Cotton T-shirt, Girls Round Neck Cotton Top. Every piece crafted with high-quality cotton fabric!"
  ],
  
  // Bestsellers
  "bestsellers": [
    "Our top sellers include:\n- Women Classic Pointed Heels (₹2,199)\n- Pearl Layered Back Necklace (₹1,350)\n- Unisex Octagon Gradient Blue Sunglasses (₹1,399)\n- Women Knee-High Leather Boots (₹2,799)\n- Wave Eau Perfume (₹1,799)",
    "Top selling products! Women Classic Pointed Heels (₹2,199), Pearl Layered Back Necklace (₹1,350), Unisex Octagon Gradient Blue Sunglasses (₹1,399), Women Knee-High Leather Boots (₹2,799), Wave Eau Perfume (₹1,799)!"
  ],
  // Category Browsing - Sunglasses
  "what sunglasses do you sell": [
    "17 styles! Women's (7 styles ₹975-₹1,399), Men's (1 style ₹1,050), Unisex (9 styles ₹899-₹1,399). All 100% UV400 protected with case + cleaning cloth!",
    "Sunglasses collection - 17 pieces! Women's range - 7 styles (₹975-₹1,399). Men's option - 1 style (₹1,050). Unisex lineup - 9 styles (₹899-₹1,399). All 100% UV400 protected with case + cleaning cloth!",
    "17 sunglasses styles! Women's selection - 7 styles priced ₹975-₹1,399. Men's offering - 1 style at ₹1,050. Unisex choices - 9 styles priced ₹899-₹1,399. Every pair 100% UV400 protected with case + cleaning cloth!"
  ],
  
  "womens sunglasses": [
    "7 styles! White Frame Slim Cat-Eye (₹1,099) - futuristic, Oversized Transparent Red Round (₹1,199) - retro glam, Sharp Black Cat-Eye (₹1,199) - dramatic edge, Frosted Steel Blue Cat-Eye (₹1,249) - icy statement, Slim Oval Tinted Red (₹1,125) - bold compact, Slim Green Oval (₹975) - minimalist modern, Rimless Tinted Winged (₹1,320) - avant-garde!",
    "Women's sunglasses - 7 styles! White Frame Slim Cat-Eye (₹1,099) futuristic, Oversized Transparent Red Round (₹1,199) retro-glam, Sharp Black Cat-Eye (₹1,199) dramatic-edge, Frosted Steel Blue Cat-Eye (₹1,249) icy-statement, Slim Oval Tinted Red (₹1,125) bold-compact, Slim Green Oval (₹975) minimalist-modern, Rimless Tinted Winged (₹1,320) avant-garde!",
    "7 women's sunglasses! White Frame Slim Cat-Eye (₹1,099) - futuristic style, Oversized Transparent Red Round (₹1,199) - retro glam vibes, Sharp Black Cat-Eye (₹1,199) - dramatic edge look, Frosted Steel Blue Cat-Eye (₹1,249) - icy statement piece, Slim Oval Tinted Red (₹1,125) - bold compact design, Slim Green Oval (₹975) - minimalist modern feel, Rimless Tinted Winged (₹1,320) - avant-garde flair!"
  ],
  
  "mens sunglasses": [
    "Men's Classic Dark Tinted Rectangle Sunglasses (₹1,050) - timeless sharp everyday cool! Plus 9 unisex styles that work perfectly for men.",
    "Men's sunglasses! Classic Dark Tinted Rectangle Sunglasses (₹1,050) timeless-sharp everyday-cool! Bonus: 9 unisex styles work perfectly for men!",
    "Men's option: Classic Dark Tinted Rectangle Sunglasses (₹1,050) - delivers timeless sharp everyday cool! Plus 9 unisex style choices that work perfectly for men!"
  ],
  
  "unisex sunglasses": [
    "9 styles! Octagon Gradient Blue (₹1,399), Black & Gold Geometric Round (₹1,299), Mint Green Chunky Frame (₹999), Oversized Amber Shield (₹1,149) - bestseller!, White Cat-Eye Statement (₹1,299), Yellow Transparent Square (₹1,050), Ice Blue Matte Square (₹989), Clear Frame Glasses (₹899), Oversized Matte Black Wrap (₹1,399).",
    "Unisex sunglasses - 9 styles! Octagon Gradient Blue (₹1,399), Black & Gold Geometric Round (₹1,299), Mint Green Chunky Frame (₹999), Oversized Amber Shield (₹1,149) bestseller!, White Cat-Eye Statement (₹1,299), Yellow Transparent Square (₹1,050), Ice Blue Matte Square (₹989), Clear Frame Glasses (₹899), Oversized Matte Black Wrap (₹1,399)!",
    "9 unisex styles! Octagon Gradient Blue (₹1,399), Black & Gold Geometric Round (₹1,299), Mint Green Chunky Frame (₹999), Oversized Amber Shield (₹1,149) - bestseller option!, White Cat-Eye Statement (₹1,299), Yellow Transparent Square (₹1,050), Ice Blue Matte Square (₹989), Clear Frame Glasses (₹899), Oversized Matte Black Wrap (₹1,399)!"
  ],
  
  "cat eye sunglasses": [
    "4 styles! White Frame Slim (₹1,099), Sharp Black (₹1,199), Frosted Steel Blue (₹1,249), White Cat-Eye Statement (₹1,299) unisex. Bold retro vibes!",
    "Cat-eye collection - 4 styles! White Frame Slim (₹1,099), Sharp Black (₹1,199), Frosted Steel Blue (₹1,249), White Cat-Eye Statement unisex (₹1,299). Bold retro vibes!"
  ],
  
  "do all sunglasses have uv protection": [
    "YES! Every single pair has 100% UV400 protection against UVA and UVB rays. All include protective case and cleaning cloth!",
    "Absolutely! Every pair features 100% UV400 protection - shields against UVA and UVB rays. All include protective case and cleaning cloth!"
  ],
  
  "uv protection": [
    "Absolutely! All our sunglasses come with 100% UV400 protection to shield your eyes from harmful UVA and UVB rays. Style meets safety!",
    "Yes! Every pair has 100% UV400 protection - guards your eyes from harmful UVA and UVB rays. Safety meets style!"
  ],
  
  "sunglasses case": [
    "Yes! Every pair comes with a protective case and cleaning cloth included in the box.",
    "Absolutely! Each pair includes a protective case and cleaning cloth in the box!"
  ],

  // Footwear/Heels
  "heels": [
    "We have Women Classic Pointed Heels in Lemon Yellow & Red (₹2,199) - a bestseller! These retro-inspired heels are perfect for parties, formal events, and making bold fashion statements.",
    "Women Classic Pointed Heels in Lemon Yellow & Red (₹2,199) - bestseller! Retro-inspired design perfect for parties, formal events, and bold fashion statements!"
  ],
  
  "heel height": [
    "Our classic pointed heels are 3-inch mid-heels, perfect for all-day wear without compromising on style or comfort.",
    "Classic pointed heels feature 3-inch mid-heel height - ideal for all-day wear with style and comfort!"
  ],
  
  "formal heels": [
    "Yes! Our pointed heels work beautifully for formal occasions, office wear, and parties. The bold colors add personality while maintaining elegance.",
    "Absolutely! Pointed heels perfect for formal occasions, office wear, and parties. Bold colors add personality while keeping elegance!"
  ],

  // Trousers/Bottoms
  "trousers men": [
    "We have Men Corduroy Brown Trousers (₹1,200) with a tailored fit - perfect for formal and semi-formal occasions. Also available: Men Beige Trendy Trousers (₹1,600) for a modern, fashion-forward look.",
    "Men's trouser options! Corduroy Brown Trousers (₹1,200) - tailored fit for formal/semi-formal. Beige Trendy Trousers (₹1,600) - modern fashion-forward look!"
  ],
  
  "trouser sizes": [
    "Our men's trousers come in M, L, and XL sizes. Check our size guide for exact measurements!",
    "Men's trousers available in M, L, and XL sizes. Check our size guide for exact measurements!"
  ],
  
  "wash trousers": [
    "Yes! Our trousers are machine washable on gentle cycle. We recommend washing in cold water and air drying to maintain fabric quality.",
    "Yes, machine washable on gentle cycle! Recommend cold water wash and air drying to maintain fabric quality."
  ],

  // Bags
  "bags women": [
    "We have the Women Brown Canvas Tote Bag (₹429) - our bestseller! It's spacious, washable, and perfect for college, casual outings, or daily use. Minimal design, maximum functionality.",
    "Women Brown Canvas Tote Bag (₹429) - bestseller! Spacious, washable, perfect for college/casual outings/daily use. Minimal design, maximum functionality!"
  ],
  
  "tote durability": [
    "Absolutely! Made from high-quality canvas material, it's built to last. Spacious enough for laptops, books, and daily essentials. Plus, it's machine washable!",
    "Built to last! High-quality canvas material, spacious for laptops/books/essentials. Bonus: machine washable!"
  ],
  
  "leather bags": [
    "Yes! Check out our Leather Crossbody Bag (₹899) for an elegant, premium option perfect for daily use.",
    "Yes! Leather Crossbody Bag (₹899) - elegant premium option perfect for daily use!"
  ],

  // General Shopping
  "shipping": [
    "Yes! We offer FREE shipping on all orders above ₹500. Orders below ₹500 have a flat ₹50 shipping fee. Standard delivery takes 3-7 business days. Express shipping (₹99) delivers in 1-2 days!",
    "FREE shipping on orders above ₹500! Orders below ₹500 have flat ₹50 fee. Standard delivery: 3-7 business days. Express shipping (₹99): 1-2 days!"
  ],
  
  "international shipping": [
    "Currently, we ship within India only. International shipping coming soon!",
    "Currently shipping within India only. International shipping launching soon!"
  ],
  
  "track order": [
    "Yes! Once your order ships, you'll receive a tracking number via email and SMS.",
    "Absolutely! Tracking number sent via email and SMS once order ships!"
  ],

  // Returns & Refunds
  "return policy": [
    "You can return products within 30 days of purchase for a full refund. Items must be unused and in original packaging. Contact support@yoursite.com or visit your Orders page to initiate a return.",
    "30-day return window for full refund! Items must be unused in original packaging. Contact support@yoursite.com or visit Orders page to initiate return."
  ],
  
  "how to return": [
    "Go to your Orders page → Select the item → Click 'Return Item' → Choose reason → Submit. We'll email you a return shipping label. For defective items, return shipping is FREE!",
    "Orders page → Select item → Click 'Return Item' → Choose reason → Submit. Return shipping label emailed. Defective items: FREE return shipping!"
  ],
  
  "refund time": [
    "Refunds are processed within 5-7 business days after we receive your returned item. You'll get an email confirmation once processed.",
    "Refunds processed within 5-7 business days after receiving returned item. Email confirmation sent once processed!"
  ],

  // Payment & Discounts
  "payment methods": [
    "We accept Credit/Debit Cards, UPI, Net Banking, Wallets (Paytm, PhonePe), and Cash on Delivery (COD available for orders under ₹5,000).",
    "Accepted: Credit/Debit Cards, UPI, Net Banking, Wallets (Paytm, PhonePe), Cash on Delivery (COD for orders under ₹5,000)!"
  ],
  
  "student discount": [
    "Yes! Get 10% student discount year-round. Verify with your .edu email address at checkout to unlock the discount automatically.",
    "10% student discount year-round! Verify with .edu email at checkout to unlock discount automatically!"
  ],
  
  "ongoing sales": [
    "Check our homepage for current sales! We regularly offer seasonal discounts, flash sales, and first-time buyer offers. Subscribe to our newsletter for exclusive deals!",
    "Check homepage for current sales! Regular seasonal discounts, flash sales, first-time buyer offers. Subscribe to newsletter for exclusive deals!"
  ],

  // Bestsellers
  "bestsellers": [
    "Our top sellers include:\n- Women Brown Canvas Tote Bag (₹429)\n- Women Classic Pointed Heels Lemon Yellow & Red (₹2,199)\n- Oversized Amber Shield Sunglasses (₹1,149)\n- White Cat-Eye Statement Sunglasses (₹1,299)\n- Frosted Steel Blue Cat-Eye Sunglasses (₹1,249)",
    "Top sellers! Women Brown Canvas Tote Bag (₹429), Women Classic Pointed Heels Lemon Yellow & Red (₹2,199), Oversized Amber Shield Sunglasses (₹1,149), White Cat-Eye Statement Sunglasses (₹1,299), Frosted Steel Blue Cat-Eye Sunglasses (₹1,249)!"
  ],

  // Size & Fit Questions - Topwear
  "what sizes do womens tops come in": [
    "Most women's tops come in XS, S, M, L, XL. Some exclusive pieces have limited runs - check individual product pages! Rust Ribbed Cotton Top (XS-L), Beige Co-ord Sweatshirt (S-XL), Red Wool Coat (M-XL), Blazers (S-L).",
    "Women's tops: XS, S, M, L, XL (some exclusive pieces limited). Check product pages! Rust Ribbed Cotton Top (XS-L), Beige Co-ord Sweatshirt (S-XL), Red Wool Coat (M-XL), Blazers (S-L)!"
  ],
  
  "what sizes do mens tops come in": [
    "Men's tops typically come in M, L, XL. Yellow Striped Shirt (M-XL), Blazers (M-XL), Sweaters (S-XL), Jackets (M-XL). Check each product page for specific availability!",
    "Men's tops: M, L, XL typically. Yellow Striped Shirt (M-XL), Blazers (M-XL), Sweaters (S-XL), Jackets (M-XL). Check product pages for specific availability!"
  ],
  
  "do blazers run small or large": [
    "Our blazers run true to size with tailored fits. Women's blazers are structured but not tight. Men's blazers offer classic fit with room for layering shirts/turtlenecks underneath. Check Size Guide for chest and shoulder measurements!",
    "Blazers run true to size - tailored fits! Women's: structured but not tight. Men's: classic fit with layering room for shirts/turtlenecks. Check Size Guide for measurements!"
  ],
  
  "how do i measure for a blazer": [
    "Measure your chest (fullest part around bust/chest), shoulders (across back from shoulder point to shoulder point), sleeve length (from shoulder to wrist). Compare to our Size Guide on product page!",
    "Measure: chest (fullest part), shoulders (across back point to point), sleeve length (shoulder to wrist). Compare to Size Guide on product page!"
  ],
  
  "what size sweater should i get for layering": [
    "If you want to layer shirts/turtlenecks underneath, size up one size for comfort. For fitted look worn alone, stick to true size. Our oversized sweaters (Rust ₹3,500, Blue Floral ₹5,490) are intentionally roomy!",
    "Layering underneath? Size up one size for comfort. Fitted look alone? Stick to true size. Oversized sweaters (Rust ₹3,500, Blue Floral ₹5,490) are intentionally roomy!"
  ],
  
  "are dresses true to size": "Yes! Rust Linen Wrap Dress (M-XL), Tennis Dress (S-L), Black Jacket Dress (S-L) all run true to size. Wrap dress is adjustable at waist for flexible fit. Check Size Guide for bust, waist, hip, and length measurements!",
  
  "how long are the coats": "Red Wool Coat is knee-length to mid-thigh, Black Overcoat is mid-thigh to knee, Olive Trench Coat is knee-length. Exact lengths in Size Guide! All designed for elegant proportions without overwhelming your frame.",
  
  "do coord sets come in separate sizes": "No, co-ord sets (Beige Sweatshirt ₹2,999, Rust Knit Wide-Leg ₹2,658) are sold as matching size sets - top and bottom same size. If you need different sizes for top/bottom, purchase separates instead!",

  // Size & Fit Questions - General
  "how do i know my size": [
    "Check our detailed Size Guide on each product page! We provide measurements for chest, waist, hips, length, and inseam for accurate fitting. Measure yourself and compare to our charts. If between sizes, we recommend sizing up for comfort!",
    "Detailed Size Guide on each product page! Measurements for chest, waist, hips, length, inseam. Measure yourself and compare to charts. Between sizes? Size up for comfort!"
  ],
  
  "what if size doesnt fit": [
    "No worries! You can return or exchange within 30 days. We offer FREE size exchanges - just pay return shipping (or it's free if item is defective). Go to My Orders → Select item → Click 'Exchange' → Choose new size!",
    "No worries! Return or exchange within 30 days. FREE size exchanges - just pay return shipping (free if defective). My Orders → Select item → Click 'Exchange' → Choose new size!"
  ],
  
  "are your products true to size": [
    "YES! Most products run true to size. Check customer reviews on product pages for real fit feedback from actual buyers. Our Size Guide provides exact measurements so you can compare with your own clothing!",
    "Yes! Most products true to size. Check customer reviews for real fit feedback. Size Guide provides exact measurements to compare with your clothing!"
  ],
  
  "do you offer plus sizes": [
    "Our size range varies by product - most go up to XL. Check individual product pages for specific size availability. We're working on expanding our size range to be more inclusive!",
    "Size range varies by product - most up to XL. Check product pages for specific availability. Expanding our size range to be more inclusive!"
  ],
  
  "can i get custom sizing": [
    "Currently we offer standard sizes only. Use our detailed Size Guide to find your best fit, and remember we offer FREE size exchanges if needed!",
    "Currently standard sizes only. Use detailed Size Guide for best fit. FREE size exchanges available if needed!"
  ],

  // CROSS-CATEGORY COMPARISONS
  "should i buy jewelry or sunglasses with 1200": [
    "Both great! Jewelry (Pearl Choker ₹780, Layered Set ₹990) adds elegance, lasts forever, formal events. Sunglasses (Cat-Eye ₹1,099-₹1,199, Amber Shield ₹1,149) offer UV protection, daily style, summer essential. Jewelry = timeless investment, Sunglasses = practical style!",
    "Great options! Jewelry (Pearl Choker ₹780, Layered Set ₹990) - elegance, lasts forever, formal events. Sunglasses (Cat-Eye ₹1,099-₹1,199, Amber Shield ₹1,149) - UV protection, daily style, summer essential. Jewelry = timeless, Sunglasses = practical!"
  ],

  "perfume vs bag – which is better as a gift": [
    "Both perfect! Perfume (Premium Set ₹1,299, Flame Essence ₹1,450) is personal, luxurious, everyone loves fragrance! Bags (Canvas Tote ₹429, Leather Handbag ₹1,299) are practical, daily use, visible style. Perfume = intimate luxury, Bag = practical chic!",
    "Perfect options! Perfume (Premium Set ₹1,299, Flame Essence ₹1,450) - personal, luxurious, universally loved! Bags (Canvas Tote ₹429, Leather Handbag ₹1,299) - practical, daily use, visible style. Perfume = intimate, Bag = practical!"
  ],

  "heels vs sneakers – which should i invest in": [
    "Invest in BOTH! Heels (Classic Pointed ₹2,199, Stiletto ₹2,299) for formal events, parties, dates – elegance! Sneakers (₹1,899-₹2,799) for daily comfort, travel, casual outings – versatility. Heels = occasions, Sneakers = everyday!",
    "Invest in both! Heels (Classic Pointed ₹2,199, Stiletto ₹2,299) - formal events, parties, dates, elegance! Sneakers (₹1,899-₹2,799) - daily comfort, travel, casual, versatility. Heels = occasions, Sneakers = everyday!"
  ],

  "winter coat vs summer dress – which is better value": [
    "Winter Coat (Red Wool ₹4,200, Black Overcoat ₹6,450) is high-investment, lasts years, cold-weather essential – wear for months! Summer Dress (Rust Linen Wrap ₹3,000, Tennis Dress ₹3,345) is seasonal, lighter use – less wear time. Coat = long-term value, Dress = seasonal joy!",
    "Winter Coat (Red Wool ₹4,200, Black Overcoat ₹6,450) - high-investment, lasts years, wear for months! Summer Dress (Rust Linen Wrap ₹3,000, Tennis Dress ₹3,345) - seasonal, lighter use. Coat = long-term value, Dress = seasonal joy!"
  ],

  "hat vs bag – which completes an outfit better": [
    "Both! Hats (₹599-₹1,499) add personality, sun protection, statement style – face-framing! Bags (₹319-₹2,649) are practical, carry essentials, visible accessory – functional style. Hat = personality, Bag = practicality! Get both!",
    "Both essential! Hats (₹599-₹1,499) - personality, sun protection, statement style, face-framing! Bags (₹319-₹2,649) - practical, carry essentials, visible accessory. Hat = personality, Bag = practicality! Get both!"
  ],

  // JEWELRY FEATURES
  "tell me about the pearl layered back necklace": [
    "Women Pearl Layered Back Necklace (₹1,350) - An elegant multi-strand pearl necklace designed to drape gracefully down your back. Perfect for low-back dresses or gowns! Features genuine freshwater pearls in a timeless design. Adds sophisticated drama to formal ensembles, weddings, and evening events. Comes with protective storage pouch.",
    "Women Pearl Layered Back Necklace (₹1,350) - Elegant multi-strand design drapes gracefully down your back. Perfect for low-back dresses/gowns! Genuine freshwater pearls, timeless design. Sophisticated drama for formal ensembles, weddings, evening events. Includes protective storage pouch!"
  ],

  "what material is the jewelry made of": [
    "Our jewelry features genuine freshwater pearls, crystal pendants, gold-toned chains, and shell beads. All pieces are handcrafted with premium materials for quality and durability. Hypoallergenic metals used for sensitive skin!",
    "Jewelry materials: genuine freshwater pearls, crystal pendants, gold-toned chains, shell beads. All handcrafted with premium materials for quality/durability. Hypoallergenic metals for sensitive skin!"
  ],

  "are the pearls real": [
    "YES! Our pearl jewelry features genuine freshwater pearls - natural, lustrous, and unique. Each pearl has slight variations that prove authenticity. High-quality handcrafted pieces that last!",
    "Yes! Genuine freshwater pearls - natural, lustrous, unique. Each pearl has slight variations proving authenticity. High-quality handcrafted pieces built to last!"
  ],

  "can i wear pearl jewelry daily": [
    "Absolutely! Our Pearl & Gold Layered Necklace Set (₹990) and other minimalist designs are perfect for everyday wear. Just avoid direct contact with perfume, water, and harsh chemicals. Wipe gently after each wear to maintain luster!",
    "Absolutely! Pearl & Gold Layered Set (₹990) and minimalist designs perfect for daily wear. Avoid perfume, water, harsh chemicals. Wipe gently after wearing to maintain luster!"
  ],

  "whats special about the beach choker": [
    "Freshwater Pearl Beach Choker (₹780) is handcrafted with sea-green beads, freshwater pearls, and a delicate crystal drop charm. Perfect for beach days, boho outfits, vacation wear! Lightweight, catches sunlight beautifully, and pairs with casual summer looks.",
    "Freshwater Pearl Beach Choker (₹780) - handcrafted with sea-green beads, freshwater pearls, crystal drop charm. Perfect for beach days, boho outfits, vacations! Lightweight, catches sunlight beautifully, pairs with casual summer looks!"
  ],

  "which necklace is best for backless dresses": [
    "Pearl Layered Back Necklace (₹1,350) is SPECIFICALLY designed for low-back and backless dresses! The multi-strand design drapes elegantly down your spine, creating a stunning focal point. Perfect for formal gowns, bridal wear, and evening events.",
    "Pearl Layered Back Necklace (₹1,350) - SPECIFICALLY designed for low-back/backless dresses! Multi-strand design drapes elegantly down spine, creating stunning focal point. Perfect for formal gowns, bridal wear, evening events!"
  ],

  "do necklaces come with packaging": [
    "Yes! All jewelry comes with protective storage pouches. Perfect for gifting or safe storage when not wearing!",
    "Yes! All jewelry includes protective storage pouches. Perfect for gifting or safe storage!"
  ],

  // PERFUME FEATURES
  "tell me about flame essence perfume": [
    "Unisex Luxury Amber Glass Perfume - Flame Essence (₹1,450) - A bold, sophisticated fragrance with notes of smoky spice and warm woods. Housed in a jewel-like amber glass bottle with luxe presentation. Perfect evening statement scent. Eau de Parfum concentration lasts 8-12 hours. Unisex appeal for confident wearers!",
    "Unisex Luxury Amber Glass Perfume - Flame Essence (₹1,450) - Bold, sophisticated with smoky spice and warm wood notes. Jewel-like amber glass bottle, luxe presentation. Perfect evening statement scent. Eau de Parfum lasts 8-12 hours. Unisex for confident wearers!"
  ],

  "how long do perfumes last": [
    "ALL our perfumes are Eau de Parfum concentration - lasting 8-12 hours! Higher concentration than Eau de Toilette means better longevity and richer scent. Apply to pulse points for maximum lasting power!",
    "ALL perfumes are Eau de Parfum - lasting 8-12 hours! Higher concentration than Eau de Toilette = better longevity, richer scent. Apply to pulse points for maximum lasting power!"
  ],

  "whats the difference between womens and unisex perfumes": [
    "Women's perfumes (Sheer Light, Sunfig Bloom) feature softer, floral, citrus notes - delicate and feminine. Unisex perfumes (Flame Essence, Wave Eau, Lum Eau) have bolder, deeper notes like amber, musk, woody spices - versatile for anyone! Choose based on your scent preference, not gender!",
    "Women's perfumes (Sheer Light, Sunfig Bloom) - softer, floral, citrus notes, delicate/feminine. Unisex (Flame Essence, Wave Eau, Lum Eau) - bolder, deeper amber/musk/woody spices, versatile for anyone! Choose based on scent preference, not gender!"
  ],

  "what does sunfig bloom smell like": [
    "Women's Tropical Floral 'Sunfig Bloom' (₹1,250) - A bright, exotic fragrance blending fig, jasmine, and neroli. Smells like a summer garden in full bloom! Perfect for beach vacations, warm weather, and bringing tropical vibes to any day. Fresh, fruity, floral - irresistibly cheerful!",
    "Women's Tropical Floral 'Sunfig Bloom' (₹1,250) - Bright, exotic with fig, jasmine, neroli blend. Smells like summer garden in bloom! Perfect for beach vacations, warm weather, tropical vibes. Fresh, fruity, floral - irresistibly cheerful!"
  ],

  "do perfumes come in gift packaging": [
    "Yes! All perfumes come beautifully packaged in designer glass bottles. Our Premium Glass Perfume Set (₹1,299) is specifically a luxury trio for gifting. Perfect presentation for birthdays, anniversaries, special occasions!",
    "Yes! All perfumes beautifully packaged in designer glass bottles. Premium Glass Perfume Set (₹1,299) - luxury trio specifically for gifting. Perfect for birthdays, anniversaries, special occasions!"
  ],

  "whats eau de parfum": [
    "Eau de Parfum (EDP) is a perfume concentration with 15-20% fragrance oils - higher than Eau de Toilette (5-15%). This means stronger scent, better longevity (8-12 hours), richer aroma. Premium quality that lasts all day with fewer reapplications!",
    "Eau de Parfum (EDP) - 15-20% fragrance oil concentration (higher than Eau de Toilette's 5-15%). Means stronger scent, better longevity (8-12 hours), richer aroma. Premium quality lasting all day with fewer reapplications!"
  ],

  "which perfume is best for daily office wear": [
    "Women's Subtle Glow 'Sheer Light' (₹1,350) - Light, airy with notes of citrus blossom, white tea, and musk. Not overpowering, professional, fresh all day. Perfect for office environments where you want to smell good without being too bold!",
    "Women's Subtle Glow 'Sheer Light' (₹1,350) - Light, airy with citrus blossom, white tea, musk. Not overpowering, professional, fresh all day. Perfect for office - smell good without being too bold!"
  ],

  "are perfume bottles refillable": [
    "Our perfumes come in sealed designer glass bottles. While not designed for refilling, the beautiful bottles make stunning décor pieces even after use! Collectible designs.",
    "Perfumes come in sealed designer glass bottles. Not designed for refilling, but beautiful bottles make stunning décor after use! Collectible designs!"
  ],

  // FOOTWEAR FEATURES
  "what heel height are your heels": [
    "Most heels are 3-3.5 inch mid-heels - the perfect balance between elegance and comfort! High enough to elongate legs and look sophisticated, but comfortable enough for all-day wear at events, parties, and office settings.",
    "Most heels: 3-3.5 inch mid-heels - perfect balance of elegance and comfort! High enough to elongate legs, comfortable enough for all-day wear at events, parties, office!"
  ],

  "are heels comfortable": [
    "YES! Our heels feature cushioned insoles, quality materials, and practical 3-3.5 inch mid-heights. Block heels (Knee-High Boots ₹2,799) offer extra stability. Designed for real wear - weddings, parties, office - not just photos! Stilettos are elegant but best for shorter durations.",
    "Yes! Heels feature cushioned insoles, quality materials, practical 3-3.5 inch mid-heights. Block heels (Knee-High Boots ₹2,799) offer extra stability. Designed for real wear - weddings, parties, office! Stilettos elegant but best for shorter durations."
  ],

  "tell me about the classic pointed heels": [
    "Women Classic Pointed Heels Lemon Yellow & Red (₹2,199) - Retro-inspired dual-tone heels with pointed toes and 3-inch mid-height. Playful lemon yellow paired with fire red creates bold, versatile statement. Perfect for parties, formal events, making fashion statements. Comfortable for all-day wear. Bestseller!",
    "Women Classic Pointed Heels Lemon Yellow & Red (₹2,199) - Retro-inspired dual-tone with pointed toes, 3-inch mid-height. Playful lemon yellow + fire red = bold versatile statement. Perfect for parties, formal events, fashion statements. All-day comfortable. Bestseller!"
  ],

  "what material are boots made of": "Women's Knee-High Boots (₹2,799) - Premium leather with block heels, square toe. Men's Chelsea Boots (₹2,598) - Glossy leather slip-on. Men's Combat Boots (₹2,499) - Black suede with rugged sole. All high-quality, durable materials built to last!",

  "are sneakers good for running": "Our sneakers are designed for casual wear, streetwear, and everyday comfort - walking, errands, travel, fashion. For serious running, we recommend specialized athletic running shoes. Our Chunky Sports Sneakers (₹2,799) work for gym sessions and light workouts!",

  "do shoes come in half sizes": "Our shoes come in standard full sizes. Check our detailed Size Guide on each product page for exact measurements (length, width). If between sizes, we recommend sizing up for comfort. FREE size exchanges available!",

  "whats special about chelsea boots": [
    "Unisex Glossy Black Chelsea Boots (₹2,598) - Sleek slip-on design with elastic side panels, no laces needed! Polished glossy finish perfect for modern formal and semi-formal looks. Easy on/off, versatile styling, works for any gender. Premium leather construction!",
    "Unisex Glossy Black Chelsea Boots (₹2,598) - Sleek slip-on with elastic side panels, no laces! Polished glossy finish perfect for modern formal/semi-formal. Easy on/off, versatile styling, works for any gender. Premium leather!"
  ],

  "are mules comfortable for all-day wear": [
    "YES! Women Pointed Toe Black Mules (₹1,899) - Slip-on design, flat/low heel, sleek minimalist style. Perfect for everyday office wear or casual outings. No straps or laces means effortless comfort. Pairs with everything from jeans to professional trousers!",
    "Yes! Women Pointed Toe Black Mules (₹1,899) - Slip-on, flat/low heel, sleek minimalist. Perfect for everyday office/casual outings. No straps/laces = effortless comfort. Pairs with jeans to professional trousers!"
  ],

  // SUNGLASSES FEATURES
  "do sunglasses have uv protection": [
    "YES! Every single pair has 100% UV400 protection - shields your eyes from harmful UVA and UVB rays. Style meets safety! All sunglasses also come with protective case and cleaning cloth included.",
    "Yes! Every pair has 100% UV400 protection - shields eyes from harmful UVA/UVB rays. Style meets safety! All include protective case and cleaning cloth!"
  ],

  "what does uv400 mean": [
    "UV400 protection blocks 99-100% of UVA and UVB rays (up to 400 nanometers wavelength). This is the highest level of UV protection available in sunglasses! Protects your eyes from sun damage, cataracts, and harmful rays. Medical-grade protection with fashion!",
    "UV400 blocks 99-100% of UVA/UVB rays (up to 400nm wavelength). Highest UV protection level available! Protects eyes from sun damage, cataracts, harmful rays. Medical-grade protection with fashion!"
  ],

  "tell me about the amber shield sunglasses": [
    "Unisex Oversized Amber Shield Sunglasses (₹1,149) - BESTSELLER! Sporty meets futuristic with wraparound shield design and warm amber tint. Oversized coverage, perfect for festivals, road trips, high-impact street styling. 100% UV400 protected. Unisex design works for everyone!",
    "Unisex Oversized Amber Shield Sunglasses (₹1,149) - BESTSELLER! Sporty-futuristic wraparound shield design, warm amber tint. Oversized coverage, perfect for festivals, road trips, street styling. 100% UV400 protected. Unisex for everyone!"
  ],

  "do sunglasses come with cases": [
    "YES! Every pair includes a protective case and microfiber cleaning cloth in the box. Keep your sunglasses safe when not wearing and clean lenses without scratches!",
    "Yes! Every pair includes protective case and microfiber cleaning cloth. Keep sunglasses safe when not wearing, clean lenses without scratches!"
  ],

  "whats the difference between cat-eye and round sunglasses": [
    "Cat-eye (White Frame ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) - Sharp, upswept edges, retro 50s-60s vibe, dramatic and bold. Flatters angular faces. Round (Red Oversized ₹1,199, Black & Gold ₹1,299) - Soft circular lenses, vintage 70s vibe, playful and softer. Flatters square faces. Both iconic styles!",
    "Cat-eye (White Frame ₹1,099, Sharp Black ₹1,199, Steel Blue ₹1,249) - Sharp upswept edges, retro 50s-60s, dramatic/bold. Flatters angular faces. Round (Red Oversized ₹1,199, Black & Gold ₹1,299) - Soft circular, vintage 70s, playful/softer. Flatters square faces. Both iconic!"
  ],

  "are transparent frames trendy": [
    "SUPER trendy! Transparent frames (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) are Y2K revival fashion - bold, playful, Instagram-worthy! Show off your face shape while making a statement. Very popular right now!",
    "Super trendy! Transparent frames (Red Round ₹1,199, Yellow Square ₹1,050, Clear Frame ₹899) - Y2K revival fashion! Bold, playful, Instagram-worthy. Show off face shape while making statement. Very popular now!"
  ],

  "can men wear womens sunglasses": [
    "Absolutely! Sunglasses have no gender - it's all about face shape and personal style! We also have 9 unisex styles (₹899-₹1,399) designed specifically to work for everyone. Try what you love!",
    "Absolutely! Sunglasses have no gender - all about face shape and personal style! 9 unisex styles (₹899-₹1,399) designed to work for everyone. Try what you love!"
  ],

  "whats special about frosted steel blue cat-eye": [
    "Women's Frosted Cat-Eye in Steel Blue (₹1,249) - Icy, sharp, futuristic silhouette that cuts through ordinary! Frosted finish gives unique texture, steel blue color is bold yet cool-toned. Statement-making, unforgettable, avant-garde style. Perfect for fashion-forward looks!",
    "Women's Frosted Cat-Eye in Steel Blue (₹1,249) - Icy, sharp, futuristic silhouette cuts through ordinary! Frosted finish = unique texture, steel blue = bold yet cool-toned. Statement-making, unforgettable, avant-garde. Perfect for fashion-forward looks!"
  ],

  // TOPWEAR FEATURES
  "tell me about the red wool coat": [
    "Women Red Oversized Wool Blend Coat (₹4,200) - Command attention with this bold red oversized design! Tailored in soft wool blend for premium warmth and elegance. Features broad lapels, plush texture, structured yet comfortable fit. Pairs seamlessly with minimalist innerwear. Perfect winter statement piece for making an entrance!",
    "Women Red Oversized Wool Blend Coat (₹4,200) - Command attention with bold red oversized design! Soft wool blend for premium warmth/elegance. Broad lapels, plush texture, structured yet comfortable. Pairs with minimalist innerwear. Perfect winter statement piece!"
  ],

  "what material are sweaters made of": [
    "Our sweaters are knitted fabrics - some are textured knit (Rust ₹3,500), wool blend (Red Coat ₹4,200, Black Overcoat ₹6,450, Burgundy Blazer ₹5,466), cotton blend, and ribbed materials. Cozy, warm, breathable for fall/winter comfort!",
    "Sweaters are knitted fabrics - textured knit (Rust ₹3,500), wool blend (Red Coat ₹4,200, Black Overcoat ₹6,450, Burgundy Blazer ₹5,466), cotton blend, ribbed materials. Cozy, warm, breathable for fall/winter!"
  ],

  "are blazers machine washable": [
    "Wool and structured blazers should be dry cleaned or hand washed to maintain shape and quality. Cotton blazers can be machine washed on gentle cycle with cold water. Always check care labels! Proper care ensures longevity.",
    "Wool/structured blazers: dry clean or hand wash to maintain shape. Cotton blazers: machine wash gentle cycle, cold water. Always check care labels! Proper care ensures longevity."
  ],

  "whats a co-ord set": [
    "Co-ord set = coordinated outfit set - matching top and bottom pieces designed to be worn together! Examples: Beige Sweatshirt Set (₹2,999) - sweatshirt + joggers, Rust Knit Wide-Leg Pants (₹2,658) - knit top + wide-leg trousers. Effortless styling, complete look in one purchase!",
    "Co-ord set = coordinated outfit - matching top + bottom worn together! Examples: Beige Sweatshirt Set (₹2,999) - sweatshirt + joggers, Rust Knit Wide-Leg Pants (₹2,658) - knit top + trousers. Effortless styling, complete look!"
  ],

  "tell me about the tennis dress": [
    "Women Tennis Dress with Green Accent (₹3,345) - Stylish, modern athletic dress with sleek white design and green accents. Breathable fabric, flattering fit, built-in shorts. Perfect for actual tennis, sports activities, OR casual athleisure looks! Comfort meets style for active lifestyles.",
    "Women Tennis Dress with Green Accent (₹3,345) - Stylish athletic dress, sleek white + green accents. Breathable fabric, flattering fit, built-in shorts. Perfect for tennis, sports, OR casual athleisure! Comfort meets style for active lifestyles!"
  ],

  "what sizes do tops come in": [
    "Most items come in XS, S, M, L, XL. Some exclusive pieces have limited size runs - check individual product pages for specific availability and our detailed Size Guide with measurements!",
    "Most items: XS, S, M, L, XL. Some exclusive pieces have limited runs - check product pages for availability and detailed Size Guide with measurements!"
  ],

  "is silk comfortable for summer": [
    "YES! Men Beige Silk Shirt (₹4,600) - Silk is naturally temperature-regulating, breathable, and lightweight. Feels cool against skin in summer heat while looking luxurious. Perfect for summer parties, vacations, evening gatherings. Smooth, comfortable, elegant!",
    "Yes! Men Beige Silk Shirt (₹4,600) - Silk naturally temperature-regulating, breathable, lightweight. Feels cool in summer heat while looking luxurious. Perfect for parties, vacations, evenings. Smooth, comfortable, elegant!"
  ],

  "whats the difference between a blazer and a suit": [
    "Blazer = structured jacket worn with non-matching pants (mix & match styling). Suit = matching jacket + pants set (coordinated formal look). We have both! Blazers offer more versatility, suits offer polished formality.",
    "Blazer = structured jacket with non-matching pants (mix & match). Suit = matching jacket + pants set (coordinated formal). We have both! Blazers = versatility, suits = polished formality."
  ],

  // BOTTOMWEAR FEATURES
  "tell me about corduroy brown trousers": [
    "Men Corduroy Brown Trousers (₹1,200) - Stylish corduroy fabric with distinctive ribbed texture and tailored fit. Perfect for formal and semi-formal occasions - office meetings, smart-casual events. Timeless brown color pairs with everything. Available in M, L, XL. Versatile wardrobe essential!",
    "Men Corduroy Brown Trousers (₹1,200) - Stylish corduroy with distinctive ribbed texture, tailored fit. Perfect for formal/semi-formal - office meetings, smart-casual events. Timeless brown pairs with everything. Available M, L, XL. Versatile essential!"
  ],

  "whats the difference between pleated and flat-front pants": [
    "Pleated pants (White Pleated ₹1,300, Black Pleated ₹1,500) have fabric folds at waistband - adds volume, movement, vintage charm, comfortable fit. Flat-front pants are smooth at waist - sleek, modern, streamlined look. Both stylish - choose based on preference!",
    "Pleated pants (White ₹1,300, Black ₹1,500) - fabric folds at waistband, adds volume/movement, vintage charm, comfortable. Flat-front - smooth waist, sleek/modern/streamlined. Both stylish - choose by preference!"
  ],

  "are trousers machine washable": [
    "Cotton and linen trousers - YES, machine wash cold, gentle cycle. Wool and structured pants - dry clean or hand wash recommended. Always air dry to maintain shape. Check care labels for specific instructions!",
    "Cotton/linen trousers: YES, machine wash cold, gentle cycle. Wool/structured pants: dry clean or hand wash recommended. Always air dry to maintain shape. Check care labels!"
  ],

  "whats a maxi skirt": [
    "Maxi skirt = floor-length or ankle-length skirt. Our Black Urban Maxi Skirt (₹1,600) and Black Maxi Pleated Skirt (₹1,600) are sophisticated, elegant, flow beautifully. Perfect for formal events, evening wear, or elevated everyday style!",
    "Maxi skirt = floor-length or ankle-length. Black Urban Maxi (₹1,600) and Black Maxi Pleated (₹1,600) - sophisticated, elegant, beautiful flow. Perfect for formal events, evening wear, elevated everyday style!"
  ],

  "what sizes do trousers come in": [
    "Men's trousers come in M, L, XL. Women's pants/skirts come in S, M, L, XL. Check our Size Guide on product pages for exact waist, hip, and inseam measurements!",
    "Men's trousers: M, L, XL. Women's pants/skirts: S, M, L, XL. Check Size Guide on product pages for exact waist, hip, inseam measurements!"
  ],

  "what are cargo pants": [
    "Men Modern Beige Cargo Pants (₹1,200) - Pants with large utility pockets on sides/legs. Originally military/workwear, now trendy streetwear! Relaxed fit, functional, modern street style. Pairs great with casual tops and sneakers.",
    "Men Modern Beige Cargo Pants (₹1,200) - Pants with large utility pockets on sides/legs. Originally military/workwear, now trendy streetwear! Relaxed fit, functional, modern street style. Pairs with casual tops and sneakers!"
  ],

  "tell me about wide-leg pants": [
    "Women Rust Knit Top with Wide-Leg Pants (₹2,658) - High-waisted orange wide-leg trousers with modern sophistication! Wide-leg = loose, flowing from hips down (opposite of skinny). Creates elegant silhouette, comfortable, very trendy! Paired with matching rust knit mock-neck top as complete co-ord set.",
    "Women Rust Knit Top with Wide-Leg Pants (₹2,658) - High-waisted orange wide-leg trousers, modern sophistication! Wide-leg = loose, flowing from hips (opposite of skinny). Elegant silhouette, comfortable, trendy! Paired with matching rust knit top - complete co-ord!"
  ],

  // BAGS FEATURES
  "what material are tote bags made of": [
    "Canvas totes (Brown ₹429, Classic ₹799) are durable, washable cotton canvas - sturdy, eco-friendly, casual! Leather totes (PU Tote Set ₹999, Crossbody Set ₹2,649) are vegan PU leather or genuine leather - premium, structured, long-lasting!",
    "Canvas totes (Brown ₹429, Classic ₹799) - durable washable cotton canvas, sturdy/eco-friendly/casual! Leather totes (PU Set ₹999, Crossbody ₹2,649) - vegan PU or genuine leather, premium/structured/long-lasting!"
  ],

  "are canvas bags machine washable": [
    "YES! Canvas tote bags can be machine washed - gentle cycle, cold water, air dry flat. Do not bleach or tumble dry. This makes them perfect for daily use - spills and dirt wash right out!",
    "Yes! Canvas totes machine washable - gentle cycle, cold water, air dry flat. No bleach or tumble dry. Perfect for daily use - spills and dirt wash right out!"
  ],

  "tell me about the brown canvas tote": [
    "Women Brown Canvas Tote Bag (₹429) - BESTSELLER! Minimal, reliable, spacious brown canvas for everyday use. Perfect for college, casual outings, grocery runs, carrying laptops and books. Washable, durable, effortlessly chic. Comfortable shoulder straps. Best value daily workhorse!",
    "Women Brown Canvas Tote Bag (₹429) - BESTSELLER! Minimal, reliable, spacious for everyday use. Perfect for college, outings, groceries, laptops/books. Washable, durable, effortlessly chic. Comfortable straps. Best value daily workhorse!"
  ],

  "whats the difference between tote and crossbody bags": [
    "Tote bags (₹319-₹799) - large, open-top, shoulder straps, carry lots (laptop, books, groceries). Spacious but need one hand. Crossbody bags (Leather Set ₹2,649) - smaller, zippered, diagonal strap across body, hands-free! Secure for travel. Tote = capacity, Crossbody = convenience!",
    "Tote bags (₹319-₹799) - large, open-top, shoulder straps, carry lots (laptop/books/groceries). Spacious but need one hand. Crossbody (Leather Set ₹2,649) - smaller, zippered, diagonal strap, hands-free! Secure for travel. Tote = capacity, Crossbody = convenience!"
  ],

  "how big are mini bags": [
    "Women White Mini Stylish Bag (₹319) - Compact mini size perfect for essentials only: phone, wallet, keys, small items. NOT for laptops or books! Great for nights out, minimal days, when you want to travel light. Cute and functional!",
    "Women White Mini Stylish Bag (₹319) - Compact mini perfect for essentials: phone, wallet, keys, small items. NOT for laptops/books! Great for nights out, minimal days, travel light. Cute and functional!"
  ],

  "whats special about the pearl handbag": [
    "Women Beaded Pearl Handbag (₹1,890) - Elegant mini clutch made ENTIRELY of luminous faux pearls! Structured shape, shell clasp, bead handle. Statement accessory for weddings, parties, summer getaways. Unique, show-stopping, conversation piece. Pairs beautifully with formal and resort wear!",
    "Women Beaded Pearl Handbag (₹1,890) - Elegant mini clutch made ENTIRELY of luminous faux pearls! Structured shape, shell clasp, bead handle. Statement for weddings, parties, summer getaways. Unique, show-stopping, conversation piece. Pairs with formal and resort wear!"
  ],

  "do leather bags need special care": [
    "Yes! Wipe with damp cloth, use leather conditioner every 3 months, avoid prolonged water exposure, store in cool dry place. Proper care makes leather age beautifully and last years! PU leather requires less maintenance than genuine leather.",
    "Yes! Wipe with damp cloth, leather conditioner every 3 months, avoid prolonged water exposure, store cool/dry place. Proper care makes leather age beautifully and last years! PU leather needs less maintenance than genuine."
  ],

  "can i fit a laptop in tote bags": [
    "YES! Canvas Tote (Classic ₹799, Brown ₹429) and PU Leather Tote Set (₹999) are spacious enough for laptops (13-15 inch), books, daily essentials. Perfect for work, college, everyday carry!",
    "Yes! Canvas Tote (Classic ₹799, Brown ₹429) and PU Leather Tote Set (₹999) fit laptops (13-15 inch), books, daily essentials. Perfect for work, college, everyday carry!"
  ],

  // HATS FEATURES
  "what material are hats made of": [
    "Straw hats (Beach ₹1,049, Summer Boho ₹799) - natural woven straw, breathable. Felt hats (Black Wide Brim ₹1,349) - wool felt, structured. Bucket hats (Printed ₹699) - soft fabric. Caps (Camo ₹599) - cotton/polyester blend. Fedoras (Beige ₹1,190) - breathable fabric with band!",
    "Straw hats (Beach ₹1,049, Summer Boho ₹799) - natural woven straw, breathable. Felt hats (Black Wide Brim ₹1,349) - wool felt, structured. Bucket hats (Printed ₹699) - soft fabric. Caps (Camo ₹599) - cotton/polyester. Fedoras (Beige ₹1,190) - breathable fabric with band!"
  ],

  // SIZING AND MEASUREMENTS
  "how do i measure for pants": [
    "Measure your waist (natural waistline, smallest part), hips (fullest part), inseam (inside leg from crotch to ankle). Compare to Size Guide! If between sizes, size up for comfort.",
    "Measure waist (natural waistline, smallest part), hips (fullest part), inseam (inside leg crotch to ankle). Compare to Size Guide! Between sizes? Size up for comfort."
  ],

  // FOOTWEAR SIZING
  "what sizes do shoes come in": [
    "Our shoes come in standard full sizes - check each product page for available size range! Men's typically 7-12, Women's typically 5-10. Size Guide provides exact measurements in cm/inches.",
    "Shoes come in standard full sizes - check product page for size range! Men's typically 7-12, Women's typically 5-10. Size Guide provides exact measurements in cm/inches."
  ],

  "do you have half sizes": [
    "Currently we offer full sizes only. If you typically wear half sizes, we recommend sizing up for comfort. Example: If you wear 7.5, order size 8. Check Size Guide for exact length measurements!",
    "Currently full sizes only. If you wear half sizes, we recommend sizing up for comfort. Example: wear 7.5? order size 8. Check Size Guide for exact length measurements!"
  ],

  "are heels true to size": [
    "YES! Our heels (Classic Pointed ₹2,199, Pastel Stiletto ₹2,299, Dual-Tone ₹2,799) run true to size. If between sizes or have wider feet, size up. Check customer reviews for real fit feedback!",
    "Yes! Heels (Classic Pointed ₹2,199, Pastel Stiletto ₹2,299, Dual-Tone ₹2,799) run true to size. Between sizes or wider feet? Size up. Check customer reviews for real fit feedback!"
  ],

  "how do i measure my foot for shoes": [
    "Stand on paper, trace foot outline, measure length from heel to longest toe and width at widest point. Compare to Size Guide measurements! Measure in evening when feet are slightly swollen for accurate fit.",
    "Stand on paper, trace foot outline, measure length heel to longest toe + width at widest point. Compare to Size Guide measurements! Measure in evening when feet slightly swollen for accurate fit."
  ],

  "do sneakers run small or large": [
    "Our sneakers run true to size. Chunky styles (Blue ₹2,799, Olive ₹1,899, Pink ₹2,365) have roomy toe boxes for comfort. Athletic sneakers should have thumb's width space at toes - size up if between sizes!",
    "Sneakers run true to size. Chunky styles (Blue ₹2,799, Olive ₹1,899, Pink ₹2,365) have roomy toe boxes for comfort. Athletic sneakers need thumb's width space at toes - size up if between sizes!"
  ],

  "are boots true to size": [
    "Yes! Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) all run true to size. For knee-high boots, also check calf circumference in Size Guide to ensure proper fit!",
    "Yes! Chelsea Boots (₹2,598), Combat Boots (₹2,499), Knee-High Boots (₹2,799) run true to size. For knee-high boots, check calf circumference in Size Guide for proper fit!"
  ],

  "what if boots are too tight on calves": [
    "Check our Size Guide for calf circumference measurements before ordering! Knee-High Leather Boots (₹2,799) have structured fit. If calves are muscular/wider, consider ankle boots or combat boots instead. FREE size exchanges available!",
    "Check Size Guide for calf circumference measurements before ordering! Knee-High Leather Boots (₹2,799) have structured fit. Calves muscular/wider? Consider ankle boots or combat boots instead. FREE size exchanges available!"
  ],

  "do mules come in wide fit": [
    "Women's Black Mules (₹1,899) have standard width. If you have wider feet, we recommend sizing up. Pointed toe design is sleek - check Size Guide measurements and customer reviews for fit guidance!",
    "Women's Black Mules (₹1,899) have standard width. Wider feet? We recommend sizing up. Pointed toe design is sleek - check Size Guide measurements and customer reviews for fit guidance!"
  ],

  // BAGS SIZING
  "how big are tote bags": [
    "Canvas Totes (Classic ₹799, Brown ₹429) are spacious - fit 13-15 inch laptops, books, daily essentials! Approximate dimensions in product descriptions. Perfect for work, college, everyday carry. Mini Bag (₹319) fits essentials only - phone, wallet, keys.",
    "Canvas Totes (Classic ₹799, Brown ₹429) - spacious, fit 13-15 inch laptops, books, daily essentials! Approximate dimensions in product descriptions. Perfect for work, college, everyday carry. Mini Bag (₹319) fits essentials only - phone, wallet, keys."
  ],

  "will a laptop fit in the tote bag": [
    "YES! Classic Canvas Tote (₹799), Brown Canvas Tote (₹429), and PU Leather Tote Set (₹999) accommodate 13-15 inch laptops comfortably. Check product dimensions on each page!",
    "Yes! Classic Canvas Tote (₹799), Brown Canvas Tote (₹429), PU Leather Tote Set (₹999) accommodate 13-15 inch laptops comfortably. Check product dimensions on each page!"
  ],

  "how small are mini bags": [
    "Women White Mini Stylish Bag (₹319) is compact mini size - approximately 8-10 inches wide. Fits phone, small wallet, keys, lipstick, sunglasses. NOT for laptops, books, or large items! Perfect for nights out or minimal days.",
    "Women White Mini Stylish Bag (₹319) - compact mini size, approximately 8-10 inches wide. Fits phone, small wallet, keys, lipstick, sunglasses. NOT for laptops, books, large items! Perfect for nights out or minimal days."
  ],

  "what are crossbody bag dimensions": [
    "Women Leather Crossbody Bag Set (₹2,649) are medium crossbody size - structured, angular silhouette. Fit essentials plus small tablet/kindle. Check product page for exact dimensions! Adjustable straps for custom fit.",
    "Women Leather Crossbody Bag Set (₹2,649) - medium crossbody size, structured angular silhouette. Fit essentials plus small tablet/kindle. Check product page for exact dimensions! Adjustable straps for custom fit."
  ],

  "are bag straps adjustable": [
    "Crossbody bags have adjustable straps for height customization. Tote bags have fixed shoulder straps designed for comfortable over-shoulder carry. Handbags/clutches have fixed handles or no straps.",
    "Crossbody bags - adjustable straps for height customization. Tote bags - fixed shoulder straps designed for comfortable over-shoulder carry. Handbags/clutches - fixed handles or no straps."
  ],

  // HATS SIZING
  "what sizes do hats come in": [
    "Most hats come in one size fits most with adjustable features! Fedoras and wide brim hats have internal bands for fit adjustment. Bucket hats and caps are flexible, stretchy materials. Approximate head circumference: 56-60cm.",
    "Most hats - one size fits most with adjustable features! Fedoras and wide brim hats have internal bands for fit adjustment. Bucket hats and caps - flexible, stretchy materials. Approximate head circumference: 56-60cm."
  ],

  "how do i measure my head for a hat": [
    "Use soft measuring tape around your head just above ears and eyebrows (widest part). If measurement is 56-58cm = Medium, 58-60cm = Large. Our hats accommodate most head sizes!",
    "Use soft measuring tape around head just above ears and eyebrows (widest part). Measurement 56-58cm = Medium, 58-60cm = Large. Our hats accommodate most head sizes!"
  ],

  "are hats adjustable": [
    "Caps (Abstract Camo ₹599) have adjustable back straps. Fedoras (Classic ₹1,190) have internal sizing bands. Wide brim hats (₹1,049-₹1,499) have adjustable inner bands. Bucket hats (₹699) are flexible stretchy fit!",
    "Caps (Abstract Camo ₹599) - adjustable back straps. Fedoras (Classic ₹1,190) - internal sizing bands. Wide brim hats (₹1,049-₹1,499) - adjustable inner bands. Bucket hats (₹699) - flexible stretchy fit!"
  ],

  "will wide brim hats fit small heads": [
    "Yes! Wide brim hats have adjustable internal bands to customize fit for smaller or larger heads. The brim size (wide) is for sun protection and style - doesn't affect head fit. One size fits most!",
    "Yes! Wide brim hats have adjustable internal bands to customize fit for smaller/larger heads. Brim size (wide) is for sun protection and style - doesn't affect head fit. One size fits most!"
  ],

  // JEWELRY SIZING
  "what length are necklaces": [
    "Chokers (Beach Choker ₹780, Shell Bead ₹2,399) are 14-16 inches - sit at base of neck. Layered necklaces (Pearl & Gold Set ₹990) are 16-20 inches - various lengths. Pendants (Amber Crystal ₹1,299) are 18-20 inches - hang at collarbone. Exact lengths on product pages!",
    "Chokers (Beach Choker ₹780, Shell Bead ₹2,399) - 14-16 inches, sit at base of neck. Layered necklaces (Pearl & Gold Set ₹990) - 16-20 inches, various lengths. Pendants (Amber Crystal ₹1,299) - 18-20 inches, hang at collarbone. Exact lengths on product pages!"
  ],

  "are necklaces adjustable": [
    "Most necklaces have adjustable chains with extenders - add 2-3 inches of length customization! Perfect for different necklines and personal preference. Check product pages for specific details.",
    "Most necklaces have adjustable chains with extenders - add 2-3 inches of length customization! Perfect for different necklines and personal preference. Check product pages for details."
  ],

  "what size is the pearl layered back necklace": [
    "Pearl Layered Back Necklace (₹1,350) is multi-strand design specifically for draping down the back - various lengths (16-24 inches) create layered effect. Adjustable clasp for custom fit on different body types!",
    "Pearl Layered Back Necklace (₹1,350) - multi-strand design specifically for draping down back, various lengths (16-24 inches) create layered effect. Adjustable clasp for custom fit on different body types!"
  ],

  // SUNGLASSES SIZING
  "what sizes do sunglasses come in": [
    "Sunglasses come in one size fits most! Frame dimensions (lens width, bridge width, temple length) listed on product pages. Oversized styles (Amber Shield ₹1,149, Red Round ₹1,199) are intentionally large for bold look!",
    "Sunglasses - one size fits most! Frame dimensions (lens width, bridge width, temple length) listed on product pages. Oversized styles (Amber Shield ₹1,149, Red Round ₹1,199) intentionally large for bold look!"
  ],

  "how do i know if sunglasses will fit my face": [
    "Check product descriptions for frame style guidance! Cat-eye suits angular faces, Round suits square faces, Oversized suits most faces. Measure your current sunglasses (lens width/temple length) and compare to our dimensions on product pages!",
    "Check product descriptions for frame style guidance! Cat-eye suits angular faces, Round suits square faces, Oversized suits most faces. Measure current sunglasses (lens width/temple length) and compare to our dimensions on product pages!"
  ],

  "are oversized sunglasses too big for small faces": [
    "Oversized styles (Red Round ₹1,199, Amber Shield ₹1,149, Matte Black Wrap ₹1,399) are designed to be bold and large - that's the style! If you prefer smaller frames, try Slim styles (White Cat-Eye ₹1,099, Green Oval ₹975) for petite faces.",
    "Oversized styles (Red Round ₹1,199, Amber Shield ₹1,149, Matte Black Wrap ₹1,399) designed to be bold and large - that's the style! Prefer smaller frames? Try Slim styles (White Cat-Eye ₹1,099, Green Oval ₹975) for petite faces."
  ],

  "do sunglasses have adjustable nose pads": [
    "Some styles have adjustable nose pads for comfort customization. Check individual product pages! Most frames are designed to fit comfortably on average nose bridges. If concerned about fit, check dimensions and customer reviews!",
    "Some styles have adjustable nose pads for comfort customization. Check individual product pages! Most frames designed to fit comfortably on average nose bridges. Concerned about fit? Check dimensions and customer reviews!"
  ],

  // COLOR-SPECIFIC QUERIES
  "what colors do you have": [
    "We have a RAINBOW of options! Neutrals (black, white, beige, tan, brown, grey), Bold colors (red, yellow, rust, burgundy, olive, mustard, pink, blue, green), Metallics (gold accents), Transparent (clear, amber). Something for every style!",
    "We have a RAINBOW! Neutrals (black, white, beige, tan, brown, grey), Bold colors (red, yellow, rust, burgundy, olive, mustard, pink, blue, green), Metallics (gold accents), Transparent (clear, amber). Something for every style!"
  ],

  "show me all black items": [
    "Tons of black! Topwear (Black Turtleneck Sweater ₹5,775, Black Wool Overcoat ₹6,450, Black Oversized Jacket Dress ₹3,977), Sunglasses (Sharp Black Cat-Eye ₹1,199, Black & Gold Geometric ₹1,299, Matte Black Wrap ₹1,399), Footwear (Black Mules ₹1,899, Black Patent Heels ₹2,599, Black Chelsea Boots ₹2,598, Black Combat Boots ₹2,499), Bottomwear (Black Pleated Pants ₹1,500, Black Maxi Skirts ₹1,600, Black Striped Trousers Set ₹1,800), Bags (Black Canvas Bag ₹359), Hats (Black Wide Brim Felt ₹1,349, Textured Brim Evening Black ₹1,499).",
    "Tons of black! Topwear (Black Turtleneck ₹5,775, Black Wool Overcoat ₹6,450, Black Oversized Jacket Dress ₹3,977), Sunglasses (Sharp Black Cat-Eye ₹1,199, Black & Gold Geometric ₹1,299, Matte Black Wrap ₹1,399), Footwear (Black Mules ₹1,899, Black Patent Heels ₹2,599, Black Chelsea Boots ₹2,598, Black Combat Boots ₹2,499), Bottomwear (Black Pleated Pants ₹1,500, Black Maxi Skirts ₹1,600, Black Striped Trousers Set ₹1,800), Bags (Black Canvas ₹359), Hats (Black Wide Brim ₹1,349, Textured Brim Evening ₹1,499)!"
  ],

  "do you have white products": [
    "Yes! Topwear (White V-neck Blouse ₹6,340, White Cotton Shirt Set ₹2,899, White Bomber Jacket ₹3,450, White Linen Shirt ₹5,679, White Knitted Vest ₹8,765), Sunglasses (White Cat-Eye ₹1,099, White Cat-Eye Statement ₹1,299), Bottomwear (White Pleated Skirt ₹1,300, White Formal Pleated Pants ₹1,400, White Pleated Shorts ₹1,100), Bags (White Mini Stylish Bag ₹319).",
    "Yes! Topwear (White V-neck Blouse ₹6,340, White Cotton Shirt Set ₹2,899, White Bomber ₹3,450, White Linen Shirt ₹5,679, White Knitted Vest ₹8,765), Sunglasses (White Cat-Eye ₹1,099, White Cat-Eye Statement ₹1,299), Bottomwear (White Pleated Skirt ₹1,300, White Formal Pleated Pants ₹1,400, White Pleated Shorts ₹1,100), Bags (White Mini ₹319)!"
  ],

  "show me beige/neutral items": [
    "Topwear (Beige Co-ord Sweatshirt ₹2,999, Beige Blazer Sets ₹3,240-₹6,547, Beige Silk Shirt ₹4,600), Footwear (Tan Brown Sneakers ₹2,299), Sunglasses (Clear Frame ₹899), Bottomwear (Beige Trendy Trousers ₹1,600, Beige Cargo Pants ₹1,200, Neutral Beige Trousers ₹1,500), Bags (Tan Leather Shoulder Bag ₹998, PU Leather Tote Set ₹999 - beige option, Leather Crossbody Set ₹2,649 - beige), Hats (Classic Fedora Beige ₹1,190, Straw Hats ₹799-₹1,049, Printed Bucket Hat Beige ₹699).",
    "Topwear (Beige Co-ord Sweatshirt ₹2,999, Beige Blazer Sets ₹3,240-₹6,547, Beige Silk Shirt ₹4,600), Footwear (Tan Brown Sneakers ₹2,299), Sunglasses (Clear Frame ₹899), Bottomwear (Beige Trendy Trousers ₹1,600, Beige Cargo ₹1,200, Neutral Beige Trousers ₹1,500), Bags (Tan Leather Shoulder ₹998, PU Leather Tote ₹999 - beige, Leather Crossbody ₹2,649 - beige), Hats (Classic Fedora Beige ₹1,190, Straw Hats ₹799-₹1,049, Printed Bucket ₹699)!"
  ],

  "do you have red products": [
    "Bold reds! Topwear (Red Oversized Wool Coat ₹4,200), Footwear (Classic Pointed Heels Yellow & Red ₹2,199 - red accent, Dual-Tone Cream & Red ₹2,799 - red accent, Black Patent Red Sole ₹2,599 - red sole), Sunglasses (Oversized Transparent Red Round ₹1,199, Slim Oval Tinted Red ₹1,125), Bags (Elegant Leather Handbag wine red ₹1,299), Hats (Abstract Camo Cap red-beige ₹599).",
    "Bold reds! Topwear (Red Oversized Wool Coat ₹4,200), Footwear (Classic Pointed Heels Yellow & Red ₹2,199 - red accent, Dual-Tone Cream & Red ₹2,799 - red accent, Black Patent Red Sole ₹2,599 - red sole), Sunglasses (Oversized Transparent Red Round ₹1,199, Slim Oval Tinted Red ₹1,125), Bags (Elegant Leather Handbag wine red ₹1,299), Hats (Abstract Camo Cap red-beige ₹599)!"
  ],

  "show me rust/orange colored items": [
    "Rust is TRENDING! Topwear (Rust Collared Ribbed Cotton Top ₹1,450, Rust Off-Shoulder Linen Wrap Dress ₹3,000, Rust Textured Knit Sweater ₹3,500, Rust Cardigan ₹3,986, Rust Knit Top with Wide-Leg Pants ₹2,658), Perfumes (Citrus Orange ₹670 - orange).",
    "Rust is TRENDING! Topwear (Rust Collared Ribbed Cotton Top ₹1,450, Rust Off-Shoulder Linen Wrap Dress ₹3,000, Rust Textured Knit Sweater ₹3,500, Rust Cardigan ₹3,986, Rust Knit Top with Wide-Leg Pants ₹2,658), Perfumes (Citrus Orange ₹670 - orange)!"
  ],

  "do you have blue items": [
    "Blues available! Topwear (Blue Floral Knit Sweater ₹5,490), Footwear (Blue Chunky Sports Sneakers ₹2,799), Sunglasses (Octagon Gradient Blue ₹1,399, Frosted Steel Blue Cat-Eye ₹1,249, Ice Blue Matte Square ₹989), Jewelry (Gold Chain Blue Crystal Hearts ₹1,599), Perfumes (Luxury Blue Glass Perfume ₹890), Bags (PU Leather Tote Set ₹999 - royal blue option).",
    "Blues available! Topwear (Blue Floral Knit Sweater ₹5,490), Footwear (Blue Chunky Sports Sneakers ₹2,799), Sunglasses (Octagon Gradient Blue ₹1,399, Frosted Steel Blue Cat-Eye ₹1,249, Ice Blue Matte Square ₹989), Jewelry (Gold Chain Blue Crystal Hearts ₹1,599), Perfumes (Luxury Blue Glass ₹890), Bags (PU Leather Tote ₹999 - royal blue)!"
  ],

  "show me green products": [
    "Greens! Topwear (Olive Green Trench Coat ₹6,879, Olive Green Zip Jacket ₹3,456, Green Turtleneck Sweater ₹3,489, Tennis Dress Green Accent ₹3,345), Sunglasses (Mint Green Chunky Frame ₹999, Slim Green Oval ₹975), Footwear (Olive Green Chunky Sneakers ₹1,899, Pastel Stiletto Green & Pink ₹2,299 - green), Bags (Quilted Style Party Tote green ₹749).",
    "Greens! Topwear (Olive Green Trench Coat ₹6,879, Olive Green Zip Jacket ₹3,456, Green Turtleneck Sweater ₹3,489, Tennis Dress Green Accent ₹3,345), Sunglasses (Mint Green Chunky Frame ₹999, Slim Green Oval ₹975), Footwear (Olive Green Chunky Sneakers ₹1,899, Pastel Stiletto Green & Pink ₹2,299 - green), Bags (Quilted Style Party Tote green ₹749)!"
  ],

  "do you have yellow items": [
    "Sunny yellows! Topwear (Men Yellow Striped Shirt ₹2,977, Mustard Yellow Zip Jacket ₹5,630), Footwear (Classic Pointed Heels Lemon Yellow & Red ₹2,199 - yellow), Sunglasses (Yellow Transparent Square ₹1,050).",
    "Sunny yellows! Topwear (Men Yellow Striped Shirt ₹2,977, Mustard Yellow Zip Jacket ₹5,630), Footwear (Classic Pointed Heels Lemon Yellow & Red ₹2,199 - yellow), Sunglasses (Yellow Transparent Square ₹1,050)!"
  ],

  "show me pink items": [
    "Pretty pinks! Footwear (Pastel Stiletto Heels Green & Blush Pink ₹2,299 - pink, Chunky Pink Sneakers ₹2,365).",
    "Pretty pinks! Footwear (Pastel Stiletto Heels Green & Blush Pink ₹2,299 - pink, Chunky Pink Sneakers ₹2,365)!"
  ],

  // Contact & Support
  "contact": [
    "Email: support@yoursite.com\nPhone: +91-XXXX-XXXXXX (Mon-Sat, 9 AM - 6 PM)\nLive Chat: Available on our website\nResponse time: Within 24 hours",
    "📧 Email: support@yoursite.com\n📞 Phone: +91-XXXX-XXXXXX (Mon-Sat, 9 AM - 6 PM)\n💬 Live Chat: Available on our website\n⏱️ Response time: Within 24 hours"
  ],
  
  "physical store": [
    "We're online-only right now, which helps us keep prices low! But we're planning retail stores soon. Stay tuned!",
    "We're online-only currently, which helps keep prices low! Planning retail stores soon. Stay tuned!"
  ]
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
    const { query, sessionId } = req.body;
    const userId = req.userId; // Get userId from auth middleware (optional)

    // Create a session identifier (use userId if available, otherwise use provided sessionId or generate one)
    const effectiveSessionId = userId || sessionId || `temp-${Date.now()}-${Math.random()}`;

    const lowerQuery = query.toLowerCase();

    // Function to find the best matching FAQ
    const findBestMatch = (query) => {
      let bestMatch = null;
      let bestMatchKey = null;
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
          bestMatchKey = key;
        }
      }

      return maxScore > 0 ? { answer: bestMatch, questionKey: bestMatchKey } : null;
    };

    // Try to find a matching FAQ
    const faqResult = findBestMatch(lowerQuery);
    if (faqResult) {
      return res.json({ 
        success: true, 
        message: getRandomAnswer(faqResult.answer, effectiveSessionId, faqResult.questionKey) 
      });
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