// Chigru AI Engine: Fuzzy intent, related words dictionary, price-range matching
// and multi-shop comparative ranking from cheapest to most expensive!

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

export function parseBudgetFromText(text) {
  if (!text) return null;
  const patterns = [
    /(?:under|below|less than|within|upto|max|maximum|around|budget of|budget|at|for|price|range|rs\.?)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
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

export function cleanProductSearchQuery(text) {
  if (!text) return '';
  return text
    .replace(/(?:under|below|less than|within|upto|max|maximum|around|budget of|budget|at|for|price|range)\s*(?:rs\.?|inr|₹)?\s*\d+/gi, '')
    .replace(/(?:rs\.?|inr|₹)\s*\d+/gi, '')
    .replace(/\b\d+\s*(?:rs|rupees|inr|₹|bucks)\b/gi, '')
    .replace(/\b(?:i want|i need|looking for|where can i get|show me|cheap|cheapest|please|give me|find me)\b/gi, '')
    .trim();
}

// Semantic Related-Words Map for Campus Students
const RELATED_WORDS_MAP = {
  food: ['thali', 'mess', 'lunch', 'dinner', 'khana', 'maggi', 'coffee', 'chai', 'tea', 'dosa', 'biryani', 'sandwich', 'poha', 'juice', 'shake', 'nashta', 'roti', 'snack'],
  thali: ['thali', 'mess', 'lunch', 'dinner', 'khana', 'roti', 'chapati', 'dal'],
  mess: ['thali', 'mess', 'lunch', 'dinner', 'khana', 'gurukrupa', 'monthly mess'],
  maggi: ['maggi', 'noodles', 'snack', 'midnight', 'cheese maggi', 'fast food'],
  chai: ['chai', 'tea', 'kulhad chai', 'bun maska', 'breakfast', 'nashta'],
  coffee: ['coffee', 'cold coffee', 'beverage', 'drink', 'shake'],
  biryani: ['biryani', 'chicken biryani', 'paneer biryani', 'rice', 'dinner'],
  dosa: ['dosa', 'masala dosa', 'south indian', 'idli', 'nashta', 'breakfast'],
  drafter: ['drafter', 'mini drafter', 'graphics', 'drawing', 'eg', 'engineering graphics', 'omega', 'isomars'],
  apron: ['apron', 'lab coat', 'white apron', 'chemistry apron', 'workshop apron', 'pharmacy apron'],
  arduino: ['arduino', 'arduino uno', 'iot', 'robotics', 'microcontroller', 'sensors', 'be project'],
  decoded: ['decoded', 'sppu decoded', 'techmax', 'nirali', 'pyq', 'question paper', 'solved papers'],
  blackbook: ['black book', 'hardcover', 'binding', 'thesis', 'project binding', 'golden print', 'be submission'],
  kettle: ['kettle', 'electric kettle', 'maggi kettle', 'hot water', 'hostel kettle'],
  extension: ['extension', 'extension board', 'spike guard', 'power strip', 'socket'],
  calculator: ['calculator', 'calc', 'casio', 'scientific calculator', 'fx991ex', 'fx991ms'],
  medicine: ['medicine', 'pain', 'volini', 'spray', 'dettol', 'first aid', 'bandage', 'chemist', 'pharmacy']
};

export function searchWithChigruAI({ 
  query, 
  targetPrice = null, 
  studentLat = 18.4642, 
  studentLng = 73.8351, 
  studentName = 'Sinhgadite',
  studentCollege = 'Sinhgad College',
  allProducts = [],
  allStores = []
}) {
  const extractedPrice = targetPrice || parseBudgetFromText(query);
  const cleanedQuery = cleanProductSearchQuery(query).toLowerCase();
  const searchTokens = cleanedQuery.split(/\s+/).filter(t => t.length > 1);

  // Expand query with semantic related words
  let expandedWords = new Set(searchTokens);
  for (const [key, relatedList] of Object.entries(RELATED_WORDS_MAP)) {
    if (cleanedQuery.includes(key) || searchTokens.some(t => key.includes(t))) {
      relatedList.forEach(w => expandedWords.add(w));
    }
  }

  // Score candidate items across database
  let scoredItems = allProducts.map(prod => {
    let score = 0;
    const nameLower = prod.name.toLowerCase();
    const catLower = prod.category.toLowerCase();
    const descLower = prod.description.toLowerCase();
    const itemGroup = (prod.itemGroup || '').toLowerCase();
    const keywords = (prod.keywords || []).map(k => k.toLowerCase());

    // Item group match
    if (cleanedQuery.includes(itemGroup) || expandedWords.has(itemGroup)) {
      score += 45;
    }

    // Direct match with user's original words
    for (const token of searchTokens) {
      if (nameLower.includes(token)) score += 30;
      if (keywords.some(k => k.includes(token))) score += 20;
      if (catLower.includes(token)) score += 15;
      if (descLower.includes(token)) score += 8;
    }

    // Semantic expanded match
    for (const expWord of expandedWords) {
      if (nameLower.includes(expWord)) score += 12;
      if (keywords.some(k => k.includes(expWord))) score += 10;
    }

    const store = allStores.find(s => s.id === prod.storeId);
    const distanceKm = store ? calculateDistanceKm(studentLat, studentLng, store.lat, store.lng) : 0.5;
    const walkTimeMin = Math.max(1, Math.round((distanceKm / 4.5) * 60));

    const priceDelta = extractedPrice ? prod.price - extractedPrice : 0;
    const isUnderOrAtBudget = extractedPrice ? prod.price <= extractedPrice : true;

    const googleMapsUrl = store
      ? `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`
      : `https://www.google.com/maps/search/?api=1&query=Sinhgad+Vadgaon+Pune`;

    const shopPhoneClean = (store?.phone || '+919822144552').replace(/[^0-9]/g, '');
    const whatsappMsg = `Hello%20${encodeURIComponent(store?.name || 'Shopkeeper')},%20I%20am%20${encodeURIComponent(studentName)}%20from%20${encodeURIComponent(studentCollege)}.%20Chigru%20AI%20suggested%20your%20shop!%20Is%20"${encodeURIComponent(prod.name)}"%20available%20for%20₹${prod.price}?`;
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

  // Filter only items with positive relevance score
  let matchingItems = scoredItems.filter(i => i.score > 0);

  // Fallback: If nothing matched, show first few items in relevant category
  if (matchingItems.length === 0) {
    matchingItems = scoredItems.slice(0, 8);
  }

  // CRITICAL REQUIREMENT: SORT EVERY SINGLE SHOP/PRODUCT FROM CHEAPEST TO MOST EXPENSIVE!
  matchingItems.sort((a, b) => a.price - b.price);

  const cheapestItem = matchingItems[0];
  const mostExpensiveItem = matchingItems[matchingItems.length - 1];
  const shopsUnderBudget = matchingItems.filter(p => p.isUnderOrAtBudget);

  // Generate intelligent Chigru AI reasoning
  let aiReasoning = '';
  if (extractedPrice) {
    if (shopsUnderBudget.length > 0) {
      aiReasoning = `🎉 Found ${shopsUnderBudget.length} shop${shopsUnderBudget.length > 1 ? 's' : ''} offering this under your budget range of ₹${extractedPrice}! The cheapest verified shop is **${cheapestItem.store?.name}** at only **₹${cheapestItem.price}** (${cheapestItem.store?.proximity}). Below is every shop ranked right from cheapest to most expensive with Google Maps walking directions:`;
    } else {
      aiReasoning = `ℹ️ The lowest verified price on campus starts at **₹${cheapestItem.price}** at **${cheapestItem.store?.name}** (which is ₹${cheapestItem.price - extractedPrice} above your target of ₹${extractedPrice}). Below is each and every campus shop ranked right from cheapest to expensive:`;
    }
  } else {
    aiReasoning = `Found ${matchingItems.length} campus shops. Here is each shop ranked strictly from the cheapest (₹${cheapestItem?.price}) to the most expensive (₹${mostExpensiveItem?.price}) with live stock and direct Google Maps directions:`;
  }

  return {
    targetProduct: cleanedQuery || 'Requested Item',
    targetPrice: extractedPrice,
    aiReasoning,
    shopsList: matchingItems,
    totalShopsFound: matchingItems.length,
    cheapestShop: cheapestItem?.store?.name,
    cheapestPrice: cheapestItem?.price,
    expensivePrice: mostExpensiveItem?.price,
    shopsUnderBudgetCount: shopsUnderBudget.length
  };
}

// Preset Quick Question Prompts for Chigru (Now covering Food, Thali, Mess, Tea, Drafters, Aprons, etc.)
export const CHIGRU_PRESETS = [
  {
    label: 'Veg Thali / Mess at ₹80',
    product: 'unlimited student veg thali mess',
    price: 80
  },
  {
    label: 'Cheese Maggi at ₹45',
    product: 'cheese maggi noodles',
    price: 45
  },
  {
    label: 'Cold Coffee at ₹30',
    product: 'thick cold coffee',
    price: 30
  },
  {
    label: 'Kulhad Chai + Bun Maska at ₹35',
    product: 'kulhad chai bun maska',
    price: 35
  },
  {
    label: 'Mini Drafter at ₹300',
    product: 'mini drafter',
    price: 300
  },
  {
    label: 'Lab Apron at ₹180',
    product: 'white lab apron',
    price: 180
  },
  {
    label: 'Arduino Uno at ₹450',
    product: 'arduino uno r3',
    price: 450
  },
  {
    label: 'Black Book Binding at ₹150',
    product: 'black book hardcover binding',
    price: 150
  },
  {
    label: 'Electric Kettle at ₹500',
    product: 'hostel electric kettle',
    price: 500
  }
];
