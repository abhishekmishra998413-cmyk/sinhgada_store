import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  MapPin, 
  Compass, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  Tag, 
  TrendingDown, 
  CheckCircle2, 
  Store, 
  Heart, 
  GraduationCap, 
  Phone,
  ShieldCheck,
  Building,
  Layers
} from 'lucide-react';
import { useStudent } from './context/StudentContext';
import { PRODUCTS, STORES, CATEGORIES, CAMPUS_LOCATIONS } from './data/campusStoresAndProducts';
import { calculateDistanceKm } from './services/aiAgentService';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import AIAgentModal from './components/AIAgentModal';
import CampusMapModal from './components/CampusMapModal';
import UserProfileModal from './components/UserProfileModal';
import StoreDirectoryModal from './components/StoreDirectoryModal';
import CartModal from './components/CartModal';

export default function App() {
  const { wishlist, cart, userLocation, profile, activeRole, products, stores, shopkeeperProfile } = useStudent();

  // Navigation & Modals State
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'wishlist' | 'cart'
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStoreDirOpen, setIsStoreDirOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected item / store for Map
  const [mapSelectedProduct, setMapSelectedProduct] = useState(null);
  const [mapHighlightedStoreId, setMapHighlightedStoreId] = useState(null);

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Stores & Items');
  const [sortOrder, setSortOrder] = useState('cheapest_first'); // 'cheapest_first' | 'expensive_first' | 'nearest_campus' | 'highest_rated'
  const [maxBudget, setMaxBudget] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filtered & Sorted Products computation from dynamic database
  const filteredProducts = useMemo(() => {
    let list = products.map(prod => {
      const store = stores.find(s => s.id === prod.storeId);
      const dist = store ? calculateDistanceKm(userLocation.lat, userLocation.lng, store.lat, store.lng) : 0.5;
      return {
        ...prod,
        store,
        distanceKm: dist
      };
    });

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q))) ||
        (p.store && p.store.name.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All Products') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // In-stock only filter
    if (inStockOnly) {
      list = list.filter(p => p.stock === 'in_stock');
    }

    // Max budget filter
    if (maxBudget && maxBudget > 0) {
      list = list.filter(p => p.price <= maxBudget);
    }

    // Wishlist view filter
    if (activeTab === 'wishlist') {
      list = list.filter(p => wishlist.includes(p.id));
    }

    // SORTING - Default and Key Requirement: CHEAPEST FIRST
    list.sort((a, b) => {
      if (sortOrder === 'cheapest_first') {
        return a.price - b.price;
      } else if (sortOrder === 'expensive_first') {
        return b.price - a.price;
      } else if (sortOrder === 'nearest_campus') {
        return a.distanceKm - b.distanceKm;
      } else if (sortOrder === 'highest_rated') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.price - b.price;
    });

    return list;
  }, [searchQuery, selectedCategory, sortOrder, maxBudget, inStockOnly, activeTab, wishlist, userLocation]);

  // Open map focused on specific product
  const handleViewProductOnMap = (product) => {
    setMapSelectedProduct(product);
    setMapHighlightedStoreId(product.storeId);
    setIsMapOpen(true);
  };

  // Open map focused on specific store
  const handleSelectStoreForMap = (storeId) => {
    setMapSelectedProduct(null);
    setMapHighlightedStoreId(storeId);
    setIsMapOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'cart') {
            setIsCartOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAIAgent={() => setIsAIAgentOpen(true)}
        onOpenMap={() => {
          setMapSelectedProduct(null);
          setMapHighlightedStoreId(null);
          setIsMapOpen(true);
        }}
        cartCount={cart.length}
        wishlistCount={wishlist.length}
      />

      {/* Shopkeeper Mode Active Alert & Quick Inventory Access */}
      {activeRole === 'shopkeeper' && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 text-xs font-medium shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold bg-black/25 px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                Shopkeeper Mode Active
              </span>
              <span>
                Managing: <b>{shopkeeperProfile.storeName || 'Campus Partner Store'}</b>
              </span>
            </div>
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="bg-white text-amber-950 px-3 py-1 rounded-lg font-bold hover:bg-amber-100 transition shadow-sm text-xs"
            >
              Add New Food/Products & Update Stock →
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner with Search & Filters */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        maxBudget={maxBudget}
        setMaxBudget={setMaxBudget}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        onOpenAIAgent={() => setIsAIAgentOpen(true)}
        categories={CATEGORIES}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Category Pills Slider & Quick Action Links */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white hover:bg-orange-50 text-slate-700 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setIsStoreDirOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition"
            >
              <Store className="w-3.5 h-3.5 text-orange-600" />
              <span>All 8 Partner Stores</span>
            </button>
          </div>

        </div>

        {/* Sorting Feedback & Results Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              {filteredProducts.length}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {activeTab === 'wishlist' ? 'Saved Wishlist Items' : 'Matching Products Found'}
              </p>
              <p className="text-[11px] text-slate-500">
                {sortOrder === 'cheapest_first' ? (
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>Ranked from Cheapest to Most Expensive (Student Savings Mode)</span>
                  </span>
                ) : (
                  <span>Current sort: {sortOrder.replace('_', ' ')}</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick toggle to cheapest */}
          {sortOrder !== 'cheapest_first' && (
            <button
              onClick={() => setSortOrder('cheapest_first')}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition"
            >
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>Switch to Cheapest First</span>
            </button>
          )}

          {/* Near Campus Proximity indicator */}
          <div className="text-right hidden sm:block text-xs text-slate-500">
            <span>Distances measured from: </span>
            <span className="font-semibold text-slate-700">{userLocation.name.split(',')[0]}</span>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try adjusting your search query, increasing the budget filter, or asking our AI Shopper Agent!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Products');
                setMaxBudget(null);
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isRankedCheapest={sortOrder === 'cheapest_first' && index === 0}
                onViewOnMap={handleViewProductOnMap}
                onOpenStoreModal={() => handleSelectStoreForMap(product.storeId)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Floating Bottom AI Assistant Mitra Button - Chigru */}
      <aside aria-label="Quick AI Assistant" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIAgentOpen(true)}
          className="group relative flex items-center space-x-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl shadow-orange-600/30 hover:shadow-2xl hover:shadow-orange-600/40 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white"></span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black tracking-wide leading-none">
              ASK CHIGRU AI
            </p>
            <p className="text-[10px] text-orange-100 font-medium leading-tight mt-0.5">
              Enter product & price!
            </p>
          </div>
        </button>
      </aside>

      {/* Modals */}
      <AIAgentModal
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
        onSelectProductOnMap={handleViewProductOnMap}
      />

      <CampusMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        selectedProduct={mapSelectedProduct}
        highlightedStoreId={mapHighlightedStoreId}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <StoreDirectoryModal
        isOpen={isStoreDirOpen}
        onClose={() => setIsStoreDirOpen(false)}
        onSelectStoreForMap={handleSelectStoreForMap}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 text-white font-extrabold text-base mb-2">
                <span className="text-orange-500">SINHGAD</span>MART
                <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full border border-orange-500/30">
                  Campus Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Empowering students across Sinhgad Institutes Pune (SCOE, SKNCOE, NBN, SITS, SCOP, SIOM) to find course materials, engineering drawing tools, books, electronics, and hostel essentials at verified lowest prices.
              </p>
              <div className="mt-3 text-[11px] text-slate-500">
                📍 Vadgaon Budruk & Ambegaon BK, Pune 411041, Maharashtra, India
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Sinhgad Campuses
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>• SCOE (Sinhgad College of Engineering)</li>
                <li>• SKNCOE (Smt. Kashibai Navale College)</li>
                <li>• NBN Sinhgad Technical Campus</li>
                <li>• SITS Narhe Campus</li>
                <li>• Sinhgad Central Library Reading Hall</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Chigru AI Assistant
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setIsAIAgentOpen(true)} className="hover:text-orange-400 transition text-left">
                    🤖 Ask Chigru: Mini Drafter at ₹300
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAIAgentOpen(true)} className="hover:text-orange-400 transition text-left">
                    🤖 Ask Chigru: White Lab Apron at ₹200
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAIAgentOpen(true)} className="hover:text-orange-400 transition text-left">
                    🤖 Ask Chigru: Arduino Uno at ₹450
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAIAgentOpen(true)} className="hover:text-orange-400 transition text-left">
                    🤖 Ask Chigru: Black Book Binding at ₹150
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsProfileOpen(true)} className="hover:text-orange-400 transition text-left">
                    👤 Sinhgad Student Customer Pass
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <div>
              © 2026 Sinhgad Campus Mart & AI Finder. Built for Sinhgadites.
            </div>
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <span>Google Maps Integrated</span>
              <span>•</span>
              <span>Cheapest Price Engine</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
