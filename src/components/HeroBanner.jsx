import React from 'react';
import { Search, Sparkles, Filter, ArrowUpDown, MapPin, Tag, Bot, CheckCircle2 } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export default function HeroBanner({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  maxBudget,
  setMaxBudget,
  inStockOnly,
  setInStockOnly,
  onOpenAIAgent,
  categories
}) {
  const { profile, userLocation } = useStudent();

  const quickSearches = [
    { label: '🍲 Student Veg Thali (Mess)', query: 'thali' },
    { label: '🍜 Cheese Maggi', query: 'maggi' },
    { label: '☕ Thick Cold Coffee', query: 'coffee' },
    { label: '🍵 Kulhad Chai', query: 'chai' },
    { label: '📐 Mini Drafter', query: 'drafter' },
    { label: '🥼 Lab Apron', query: 'apron' },
    { label: '⚡ Arduino Uno', query: 'arduino' },
    { label: '📚 Black Book Binding', query: 'black book' },
    { label: '🔢 Casio fx-991EX', query: 'casio' },
    { label: '🫖 Hostel Kettle', query: 'kettle' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-slate-50 to-slate-50 pt-8 pb-6 border-b border-slate-200">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c0a_1px,transparent_1px),linear-gradient(to_bottom,#ea580c0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Student Welcome & College Tag */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-orange-100/80 border border-orange-200/80 text-orange-900 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Sinhgad Institutes Pune • Sinhgad Student Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Find Any Product Nearby at the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Cheapest Price
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Welcome <span className="font-semibold text-slate-800">{profile.name}</span> ({profile.college?.split(' - ')[0] || 'Sinhgad Student'}). Comparing verified stationery, tech, xerox, and hostel stores around Vadgaon & Ambegaon.
            </p>
          </div>

          {/* Chigru AI Banner Shortcut Card */}
          <div 
            onClick={onOpenAIAgent}
            className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-orange-200 shadow-sm hover:shadow-md hover:border-orange-400 transition-all cursor-pointer group max-w-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Chigru AI Agent</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">Online</span>
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-snug">
                "Enter product & target price — Chigru shows every shop cheapest to expensive!"
              </p>
            </div>
          </div>
        </div>

        {/* Universal Search & Price Filtering Console */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="relative lg:col-span-5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products: drafter, apron, arduino, casio, binding..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sorting Order: Default is Cheapest to Expensive */}
            <div className="lg:col-span-2">
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full py-2.5 pl-3 pr-8 bg-orange-50/70 border border-orange-200 text-orange-950 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="cheapest_first">💰 Cheapest to Expensive</option>
                  <option value="expensive_first">💎 Expensive to Cheapest</option>
                  <option value="nearest_campus">📍 Nearest to Sinhgad</option>
                  <option value="highest_rated">⭐ Highest Student Rating</option>
                </select>
              </div>
            </div>

            {/* Max Budget Slider / Quick input */}
            <div className="lg:col-span-2 flex items-center space-x-2 bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl">
              <Tag className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <div className="w-full">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>Max:</span>
                  <span className="text-orange-600 font-bold">
                    {maxBudget ? `₹${maxBudget}` : 'No Limit'}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={maxBudget || 2000}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
              {maxBudget && (
                <button 
                  onClick={() => setMaxBudget(null)} 
                  className="text-[10px] text-slate-400 hover:text-slate-700 underline shrink-0"
                  title="Clear budget limit"
                >
                  Reset
                </button>
              )}
            </div>

          </div>

          {/* Quick Click Search Tags */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sinhgadites often buy:</span>
            </span>
            {quickSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(item.query)}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  searchQuery.toLowerCase() === item.query.toLowerCase()
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-orange-100 hover:text-orange-900 text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="ml-auto flex items-center space-x-2 pl-2">
              <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 h-3.5 w-3.5"
                />
                <span className="font-medium text-[11px] text-emerald-700">In-Stock Only</span>
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
