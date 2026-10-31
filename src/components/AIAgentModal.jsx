import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  ArrowRight,
  TrendingDown,
  Compass,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  Tag,
  DollarSign,
  Store,
  Check
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { CAMPUS_LOCATIONS } from '../data/campusStoresAndProducts';
import { searchWithChigruAI, parseBudgetFromText, CHIGRU_PRESETS } from '../services/aiAgentService';

export default function AIAgentModal({ isOpen, onClose, onSelectProductOnMap }) {
  const { profile, userLocation, addToCart, products, stores } = useStudent();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState('ask_product'); // 'ask_product' | 'ask_price' | 'show_results'
  
  const [desiredProduct, setDesiredProduct] = useState('');
  const [targetPrice, setTargetPrice] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initiateChigru();
    }
  }, [isOpen]);

  const initiateChigru = () => {
    setStep('ask_product');
    setDesiredProduct('');
    setTargetPrice(null);
    setMessages([
      {
        id: 'chigru-welcome-1',
        sender: 'chigru',
        text: `Namaste ${profile.name ? profile.name.split(' ')[0] : 'Sinhgadite'}! 🙏 I am **Chigru**, your dedicated Sinhgad Campus AI Shopping & Food Finder.`,
        timestamp: 'Just now'
      },
      {
        id: 'chigru-welcome-2',
        sender: 'chigru',
        text: `Tell me **what product or food item you want** and **at what price range** (Food, Mess Thali, Maggi, Coffee, Drafters, Aprons, Books, Electronics, etc.).\n\nI will search every shop & canteen in our Sinhgad database and show you **each and every shop right from cheapest to most expensive** with live stock and direct Google Maps walking directions!\n\n👉 **What product or food are you looking for today?**`,
        type: 'product_prompt',
        timestamp: 'Just now'
      }
    ]);
  };

  if (!isOpen) return null;

  // Step 1: Select or enter product
  const handleSelectProduct = (productName) => {
    setDesiredProduct(productName);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: productName,
      timestamp: 'Just now'
    };

    const chigruPriceMsg = {
      id: `chigru-${Date.now()}`,
      sender: 'chigru',
      text: `Got it! You need "${productName}".\n\n💰 **At what price range of money (₹) are you looking for this?**\n(Enter your target budget or pick below, and I will show every shop closer to that range ranked from cheapest to expensive!):`,
      type: 'price_prompt',
      timestamp: 'Just now'
    };

    setStep('ask_price');
    setMessages(prev => [...prev, userMsg, chigruPriceMsg]);
  };

  // Step 2: Select or enter price, then trigger Chigru search
  const handleSelectPrice = (priceVal) => {
    setTargetPrice(priceVal);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: priceVal ? `Target Price: ₹${priceVal}` : 'Cheapest Available / Any Price',
      timestamp: 'Just now'
    };

    setIsThinking(true);
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      executeChigruSearch(desiredProduct, priceVal);
      setIsThinking(false);
    }, 500);
  };

  const executeChigruSearch = (productQuery, priceTarget) => {
    const aiResult = searchWithChigruAI({
      query: productQuery,
      targetPrice: priceTarget,
      studentLat: userLocation.lat,
      studentLng: userLocation.lng,
      studentName: profile.name,
      studentCollege: profile.college,
      allProducts: products,
      allStores: stores
    });

    const chigruResultMsg = {
      id: `chigru-${Date.now()}`,
      sender: 'chigru',
      text: aiResult.aiReasoning,
      type: 'results',
      data: aiResult,
      timestamp: 'Just now'
    };

    setStep('show_results');
    setMessages(prev => [...prev, chigruResultMsg]);
  };

  // Free-form user input submit
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    const extractedPrice = parseBudgetFromText(userText) || targetPrice;
    
    setIsThinking(true);
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const aiResult = searchWithChigruAI({
        query: userText,
        targetPrice: extractedPrice,
        studentLat: userLocation.lat,
        studentLng: userLocation.lng,
        studentName: profile.name,
        studentCollege: profile.college,
        allProducts: products,
        allStores: stores
      });

      const chigruResultMsg = {
        id: `chigru-${Date.now()}`,
        sender: 'chigru',
        text: `🤖 **Chigru's Campus Analysis for "${userText}":**\n\n${aiResult.aiReasoning}`,
        type: 'results',
        data: aiResult,
        timestamp: 'Just now'
      };

      setStep('show_results');
      setIsThinking(false);
      setMessages(prev => [...prev, chigruResultMsg]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[92vh] sm:h-[88vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header - Chigru AI Branding */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/30 shadow-inner">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-orange-700 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Chigru <span className="text-amber-200 font-bold">AI Agent</span>
                </h3>
                <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Sinhgad Campus AI
                </span>
              </div>
              <p className="text-xs text-orange-100 flex items-center space-x-1.5 mt-0.5">
                <span>Ranks each shop from cheapest to expensive</span>
                <span>•</span>
                <span>Google Maps Directions</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={initiateChigru}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1 transition"
              title="Restart Chigru Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[94%] sm:max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-normal">
                  {msg.text}
                </div>

                {/* Step 1: Suggested Sinhgad Products */}
                {msg.type === 'product_prompt' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Click to ask Chigru:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CHIGRU_PRESETS.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDesiredProduct(item.product);
                            handleSelectProduct(item.product);
                          }}
                          className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-950 font-semibold text-xs rounded-xl border border-orange-200 transition transform hover:scale-102 flex items-center space-x-1"
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Target Price Prompts */}
                {msg.type === 'price_prompt' && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Choose Your Target Price / Budget for "{desiredProduct}":
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[35, 50, 80, 150, 250, 350, 500].map((pr) => (
                        <button
                          key={pr}
                          onClick={() => handleSelectPrice(pr)}
                          className="px-3 py-2 bg-stone-50 hover:bg-orange-600 hover:text-white text-slate-800 font-bold text-xs rounded-xl border border-stone-200 hover:border-orange-600 transition flex items-center justify-between"
                        >
                          <span className="text-[11px] text-slate-500 hover:text-white">Budget:</span>
                          <span>₹{pr}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => handleSelectPrice(null)}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition text-center"
                      >
                        Cheapest (Any)
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Comparative Shop-by-Shop Ranking Results */}
                {msg.type === 'results' && msg.data && (
                  <div className="mt-4 space-y-3.5">
                    
                    {/* Header Summary Pill */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-orange-900">
                          Found {msg.data.totalShopsFound} Campus Shops
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 font-bold">
                          Cheapest: ₹{msg.data.cheapestPrice}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600">
                        Sorted from Cheapest to Expensive ⬇️
                      </span>
                    </div>

                    {/* Shop Cards: RENDERED STRICTLY FROM CHEAPEST TO MOST EXPENSIVE */}
                    {msg.data.shopsList.map((item, index) => {
                      const isCheapest = index === 0;
                      const hasBudget = msg.data.targetPrice !== null;
                      const isUnder = hasBudget && item.isUnderOrAtBudget;
                      const delta = Math.abs(item.priceDelta);

                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl p-4 transition border ${
                            isCheapest
                              ? 'bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                              : isUnder
                              ? 'bg-white border-emerald-200 shadow-sm'
                              : 'bg-white border-slate-200 shadow-sm'
                          }`}
                        >
                          {/* Top Rank Badge & Price Delta against Customer's Target */}
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                                  isCheapest
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 text-white'
                                }`}
                              >
                                <span>#{index + 1}</span>
                                <span>{isCheapest ? 'CHEAPEST SHOP' : 'SHOP OPTION'}</span>
                              </span>

                              {/* Price vs Customer's Entered Price indicator */}
                              {hasBudget && (
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 ${
                                    item.isUnderOrAtBudget
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {item.priceDelta < 0 && (
                                    <>
                                      <TrendingDown className="w-3 h-3 text-emerald-600" />
                                      <span>₹{delta} Under Your Target!</span>
                                    </>
                                  )}
                                  {item.priceDelta === 0 && (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Matches Your Target!</span>
                                    </>
                                  )}
                                  {item.priceDelta > 0 && (
                                    <>
                                      <span>+₹{delta} Above Target</span>
                                    </>
                                  )}
                                </span>
                              )}
                            </div>

                            {/* Live Stock Availability */}
                            <div>
                              {item.stock === 'in_stock' && (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>In Stock ({item.stockCount} units)</span>
                                </span>
                              )}
                              {item.stock === 'few_left' && (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  <span>Only {item.stockCount} Left!</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Shop Name & Price Line */}
                          <div className="flex items-start justify-between gap-3 my-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                                {item.store?.name}
                              </h4>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                                {item.name}
                              </p>
                              {item.shopNote && (
                                <p className="text-[11px] text-orange-700 mt-0.5 font-medium">
                                  💡 {item.shopNote}
                                </p>
                              )}
                            </div>

                            {/* Price at this shop */}
                            <div className="text-right shrink-0">
                              <span className="text-lg sm:text-xl font-black text-orange-600">
                                ₹{item.price}
                              </span>
                              {item.mrp && item.mrp > item.price && (
                                <p className="text-[10px] text-slate-400 line-through">
                                  MRP ₹{item.mrp}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Location & Distance Box */}
                          <div className="bg-slate-50/90 rounded-xl p-2.5 my-2.5 text-xs border border-slate-200/60">
                            <div className="flex items-center justify-between text-slate-800 font-semibold mb-1">
                              <span className="flex items-center space-x-1.5 truncate">
                                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                <span className="truncate">{item.store?.proximity}</span>
                              </span>
                              <span className="text-[10px] font-mono text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded shrink-0">
                                {item.distanceKm} km ({item.walkTimeMin} min walk)
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 pl-5 truncate">
                              📍 {item.store?.address}
                            </p>
                            <p className="text-[10px] text-slate-500 pl-5 mt-0.5 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{item.store?.openHours}</span>
                            </p>
                          </div>

                          {/* Action Buttons: GOOGLE MAPS NAVIGATION & WHATSAPP */}
                          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                            
                            {/* Open Direct Google Maps Navigation */}
                            <a
                              href={item.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>Directions on Google Maps</span>
                              <ExternalLink className="w-3 h-3 opacity-80" />
                            </a>

                            {/* WhatsApp Shopkeeper to hold */}
                            <a
                              href={item.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Shop</span>
                            </a>

                            {/* View Pin on Campus Map */}
                            <button
                              onClick={() => {
                                onClose();
                                onSelectProductOnMap(item);
                              }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition"
                            >
                              <Compass className="w-3.5 h-3.5 text-orange-600" />
                              <span>Map Pin</span>
                            </button>

                            {/* Hold / Reserve Item */}
                            <button
                              onClick={() => addToCart(item)}
                              className="ml-auto inline-flex items-center space-x-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl text-xs font-bold transition"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Reserve</span>
                            </button>

                          </div>

                        </div>
                      );
                    })}

                    <div className="pt-2 text-center text-slate-400 text-xs">
                      Want to search another item or price? Ask Chigru below!
                    </div>
                  </div>
                )}

              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Thinking Animation */}
          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-orange-700 bg-orange-50 p-3 rounded-2xl max-w-xs border border-orange-200">
              <Bot className="w-4 h-4 animate-spin text-orange-600" />
              <span className="font-semibold">Chigru is scanning all campus shops...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form at Bottom */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Chigru: e.g. 'mini drafter at 300', 'lab apron 180', 'arduino 450'..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold transition flex items-center justify-center shadow-md shadow-orange-500/20"
            >
              <Send className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline text-xs font-bold">Ask Chigru</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Chigru AI • Sinhgad Institutes Vadgaon & Ambegaon</span>
            <span>Always ranks shops cheapest first</span>
          </div>
        </div>

      </div>
    </div>
  );
}
