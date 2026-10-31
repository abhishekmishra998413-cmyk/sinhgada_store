import React from 'react';
import { 
  ShoppingBag, 
  Bot, 
  MapPin, 
  User, 
  Heart, 
  ShoppingCart, 
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { CAMPUS_LOCATIONS } from '../data/campusStoresAndProducts';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenProfile, 
  onOpenAIAgent, 
  onOpenMap,
  cartCount,
  wishlistCount 
}) {
  const { profile, userLocation, setUserLocation } = useStudent();

  const handleLocationChange = (e) => {
    const locId = e.target.value;
    const selected = CAMPUS_LOCATIONS.find(l => l.id === locId);
    if (selected) {
      setUserLocation(selected);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Sinhgad Alert Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
              Sinhgad Student Exclusive
            </span>
            <span className="truncate">
              ⚡ Flash 10%–25% OFF at all campus stores near SCOE, SKNCOE, NBN & Hostels with verified Student ID!
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>Verified Sinhgad Stores</span>
            </span>
            <span className="text-orange-200">|</span>
            <span>📍 Vadgaon Budruk & Ambegaon BK, Pune 411041</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('shop')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 ring-2 ring-orange-100">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  SINHGAD<span className="text-orange-600">MART</span>
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
                  Campus AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Nearby Stores, Cheapest Prices & Live Stock for Sinhgadites
              </p>
            </div>
          </div>

          {/* Location Selector (Where is the student currently at?) */}
          <div className="hidden lg:flex items-center bg-slate-100 hover:bg-slate-150 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 space-x-2">
            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="text-slate-500 font-medium">Near:</span>
            <select 
              value={userLocation.id}
              onChange={handleLocationChange}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
            >
              {CAMPUS_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Chigru AI Agent Button */}
            <button
              onClick={onOpenAIAgent}
              className="relative inline-flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Ask Chigru AI</span>
              <span className="hidden sm:inline-flex bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                Price Hunter
              </span>
            </button>

            {/* Campus Map Button */}
            <button
              onClick={onOpenMap}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition"
              title="View Sinhgad Campus Map"
            >
              <Compass className="w-4 h-4 text-orange-600" />
              <span className="hidden md:inline">Campus Map</span>
            </button>

            {/* Student Profile Button (Customer) */}
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center space-x-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 transition group"
              title="Student Customer Profile & ID Pass"
            >
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs group-hover:bg-orange-600 group-hover:text-white transition">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden xl:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                  {profile.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {profile.prnNumber || 'Sinhgad ID'}
                </p>
              </div>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`relative p-2 sm:p-2.5 rounded-xl border transition ${
                activeTab === 'wishlist' 
                  ? 'border-orange-500 bg-orange-50 text-orange-600' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Saved Items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart / Reserved Items */}
            <button
              onClick={() => setActiveTab('cart')}
              className={`relative p-2 sm:p-2.5 rounded-xl border transition ${
                activeTab === 'cart' 
                  ? 'border-orange-500 bg-orange-50 text-orange-600' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Reserved / Bag"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
