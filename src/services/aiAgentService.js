import { PRODUCTS, STORES } from '../data/campusStoresAndProducts';

// Haversine formula to calculate accurate distance in km between two lat/lng coordinates
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0.5;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100;
}

// Intelligent parser to extract budget number from natural language text
export function parseBudgetFromText(text) {
  if (!text) return null;
  const patterns = [
    /(?:under|below|less than|within|upto|max|maximum|around|budget of|budget|at|for|price)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /(?:rs\.?|inr|₹)\s*(\d+)/i,
    /(\d+)\s*(?:rs|rupees|inr|₹|bucks)/i,
    /\b(\d{2,5})\b/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (val >= 10 && val <= 100000) {
        return val;
      }
    }
  }
  return null;
}

// Clean product search keywords
export function cleanProductSearchQuery(text) {
  if (!text) return '';
  // Remove budget numbers and filler words
  return text
    .replace(/(?:under|below|less than|within|upto|max|maximum|around|budget of|budget|at|for|price)\s*(?:rs\.?|inr|₹)?\s*\d+/gi, '')
    .replace(/(?:rs\.?|inr|₹)\s*\d+/gi, '')
    .replace(/\b\d+\s*(?:rs|rupees|inr|₹|bucks)\b/gi, '')
    .replace(/\b(?:i want|i need|looking for|where can i get|show me|cheap|cheapest|please|give me)\b/gi, '')
    .trim();
}

/**
 * CHIGRU AI Search Engine:
 * Finds each and every shop carrying the requested product or category,
 * calculates distance from student's spot, compares with target price,
 * and sorts strictly from CHEAPEST to MOST EXPENSIVE!
 */
export function searchWithChigruAI({ 
  query, 
  targetPrice = null, 
  studentLat = 18.4642, 
  studentLng = 73.8351, 
  studentName = 'Sinhgadite',
  studentCollege = 'Sinhgad College'
}) {
  const extractedPrice = targetPrice || parseBudgetFromText(query);
  const cleanedQuery = cleanProductSearchQuery(query).toLowerCase();
  const searchTerms = cleanedQuery.split(/\s+/).filter(t => t.length > 1);

  // Score all products to match user intent
  let candidates = PRODUCTS.map(prod => {
    let score = 0;
    const nameLower = prod.name.toLowerCase();
    const catLower = prod.category.toLowerCase();
    const descLower = prod.description.toLowerCase();
    const itemGroup = (prod.itemGroup || '').toLowerCase();
    const keywords = (prod.keywords || []).map(k => k.toLowerCase());

    // Exact itemGroup match (e.g. drafter, apron, arduino, decoded, blackbook, calculator, kettle, extension)
    if (cleanedQuery.includes(itemGroup) || (itemGroup && cleanedQuery.split(/\s+/).includes(itemGroup))) {
      score += 50;
    }

    // Direct keyword match
    for (const kw of keywords) {
      if (cleanedQuery.includes(kw) || kw.includes(cleanedQuery)) {
        score += 30;
      }
    }

    // Name match
    if (nameLower.includes(cleanedQuery)) {
      score += 40;
    }

    // Word token matches
    for (const term of searchTerms) {
      if (nameLower.includes(term)) score += 10;
      if (keywords.some(k => k.includes(term))) score += 8;
      if (catLower.includes(term)) score += 5;
      if (descLower.includes(term)) score += 3;
    }

    const store = STORES.find(s => s.id === prod.storeId);
    const distanceKm = store ? calculateDistanceKm(studentLat, studentLng, store.lat, store.lng) : 0.5;
    const walkTimeMin = Math.max(1, Math.round((distanceKm / 4.5) * 60));

    // Price comparison with user's target price
    const priceDelta = extractedPrice ? prod.price - extractedPrice : 0;
    const isUnderOrAtBudget = extractedPrice ? prod.price <= extractedPrice : true;
    const googleMapsUrl = store 
      ? `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`
      : `https://www.google.com/maps/search/?api=1&query=Sinhgad+Vadgaon+Pune`;

    // WhatsApp pre-filled reservation link for this specific shop
    const shopPhoneClean = (store?.phone || '+919822144552').replace(/[^0-9]/g, '');
    const whatsappMsg = `Hello%20${encodeURIComponent(store?.name || 'Shopkeeper')},%20I%20am%20${encodeURIComponent(studentName)}%20from%20${encodeURIComponent(studentCollege)}.%20Chigru%20AI%20recommended%20your%20shop!%20Is%20"${encodeURIComponent(prod.name)}"%20available%20for%20₹${prod.price}?`;
    const whatsappUrl = `https://wa.me/${shopPhoneClean}?text=${whatsappMsg}`;

    return {
      ...prod,
      store,
      distanceKm,
      walkTimeMin,
      priceDelta,
      isUnderOrAtBudget,
      googleMapsUrl,
      whatsappUrl,
      score
    };
  });

  // Filter only relevant matches
  let matchingProducts = candidates.filter(c => c.score > 0);

  // Fallback: If no direct match, show all products in same category
  if (matchingProducts.length === 0) {
    matchingProducts = candidates.slice(0, 8);
  }

  // CRITICAL REQUIREMENT: SORT EVERY SHOP FROM CHEAPEST TO MOST EXPENSIVE!
  matchingProducts.sort((a, b) => a.price - b.price);

  const cheapestProduct = matchingProducts[0];
  const mostExpensiveProduct = matchingProducts[matchingProducts.length - 1];
  const shopsUnderBudget = matchingProducts.filter(p => p.isUnderOrAtBudget);

  // Generate Chigru's intelligent AI reasoning summary
  let aiReasoning = '';
  if (extractedPrice) {
    if (shopsUnderBudget.length > 0) {
      aiReasoning = `🎉 Great news! I found ${shopsUnderBudget.length} shop${shopsUnderBudget.length > 1 ? 's' : ''} offering this within your budget of ₹${extractedPrice} (out of ${matchingProducts.length} campus shops total). The cheapest option starts at only ₹${cheapestProduct.price} at ${cheapestProduct.store?.name}!`;
    } else {
      aiReasoning = `ℹ️ Currently, the lowest campus price starts at ₹${cheapestProduct.price} at ${cheapestProduct.store?.name} (which is ₹${cheapestProduct.price - extractedPrice} above your target of ₹${extractedPrice}). Below is every shop ranked right from cheapest to most expensive:`;
    }
  } else {
    aiReasoning = `Found ${matchingProducts.length} campus shops carrying this. Ranked strictly from the cheapest shop (₹${cheapestProduct?.price}) to the most expensive (₹${mostExpensiveProduct?.price}) with direct Google Maps walking routes:`;
  }

  return {
    targetProduct: cleanedQuery || 'Requested Item',
    targetPrice: extractedPrice,
    aiReasoning,
    shopsList: matchingProducts,
    totalShopsFound: matchingProducts.length,
    cheapestShop: cheapestProduct?.store?.name,
    cheapestPrice: cheapestProduct?.price,
    expensivePrice: mostExpensiveProduct?.price,
    shopsUnderBudgetCount: shopsUnderBudget.length
  };
}

// Preset Prompts for Quick Customer Questions in Chigru
export const CHIGRU_PRESETS = [
  {
    label: 'Mini Drafter at ₹300',
    product: 'mini drafter',
    price: 300
  },
  {
    label: 'Lab Apron at ₹200',
    product: 'white lab apron',
    price: 200
  },
  {
    label: 'Arduino Uno at ₹450',
    product: 'arduino uno',
    price: 450
  },
  {
    label: 'Black Book Binding at ₹150',
    product: 'black book hardcover binding',
    price: 150
  },
  {
    label: 'Casio fx-991EX at ₹1400',
    product: 'casio 991ex calculator',
    price: 1400
  },
  {
    label: 'SPPU Decoded at ₹250',
    product: 'sppu decoded book',
    price: 250
  },
  {
    label: 'Hostel Kettle at ₹500',
    product: 'electric kettle',
    price: 500
  },
  {
    label: 'Extension Board at ₹250',
    product: 'hostel extension board',
    price: 250
  }
];
