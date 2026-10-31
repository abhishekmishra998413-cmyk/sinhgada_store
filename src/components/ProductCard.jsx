import React from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Heart, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Compass, 
  Tag, 
  Star 
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { calculateDistanceKm } from '../services/aiAgentService';

export default function ProductCard({ 
  product, 
  onViewOnMap, 
  onOpenStoreModal,
  isRankedCheapest = false 
}) {
  const { wishlist, toggleWishlist, addToCart, userLocation } = useStudent();
  const isWishlisted = wishlist.includes(product.id);

  // Distance from the student's selected campus location
  const storeLat = product.lat || product.store?.lat || 18.4642;
  const storeLng = product.lng || product.store?.lng || 73.8351;
  const distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, storeLat, storeLng);
  const walkTimeMin = Math.max(1, Math.round((distanceKm / 4.5) * 60));

  const savings = product.mrp ? Math.max(0, product.mrp - product.price) : 0;
  const discountPercent = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${storeLat},${storeLng}`;

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-lg hover:-translate-y-1 ${
      isRankedCheapest 
        ? 'border-emerald-300 ring-2 ring-emerald-500/10' 
        : 'border-slate-200/90 hover:border-orange-300'
    }`}>
      
      {/* Top Media & Badges */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition ${
            isWishlisted 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 shadow-sm'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Cheapest Tag */}
        {isRankedCheapest && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center space-x-1 uppercase tracking-wider">
            <span>🔥</span>
            <span>Cheapest Price</span>
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute bottom-3 left-3">
          {product.stock === 'in_stock' && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-300/80 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>In Stock ({product.stockCount})</span>
            </span>
          )}
          {product.stock === 'few_left' && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-300/80 shadow-sm">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>Only {product.stockCount} left!</span>
            </span>
          )}
          {product.stock === 'out_of_stock' && (
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-800 bg-rose-100/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-rose-300/80 shadow-sm">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>Out of Stock</span>
            </span>
          )}
        </div>

        {/* Sinhgad Discount Percentage */}
        {discountPercent > 0 && (
          <div className="absolute bottom-3 right-3 bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Category */}
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate">
            {product.category}
          </p>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Price Showcase: Student Price vs MRP */}
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-orange-600">
              ₹{product.price}
            </span>
            {product.mrp && product.mrp > product.price && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.mrp}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Save ₹{savings}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Store Location Info Box */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/60 text-xs">
            
            <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
              <span className="truncate pr-1 text-slate-900 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                <span className="truncate">{product.store?.name}</span>
              </span>
              <span className="text-[10px] font-mono text-orange-700 bg-orange-100/80 px-1.5 py-0.2 rounded shrink-0">
                {distanceKm} km ({walkTimeMin}m)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 pl-4 truncate">
              {product.store?.proximity || product.store?.address}
            </p>

            {product.store?.studentDiscountNote && (
              <p className="text-[10px] text-orange-700 font-semibold pl-4 mt-0.5 truncate flex items-center space-x-1">
                <Tag className="w-2.5 h-2.5" />
                <span>{product.store.studentDiscountNote}</span>
              </p>
            )}

          </div>

          {/* Action CTAs */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            
            {/* Direct Google Maps Navigation */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 rounded-xl text-xs font-bold transition shadow-sm"
              title="Get direct walking / driving directions on Google Maps"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Hold / Reserve for Student */}
            <button
              onClick={() => addToCart(product)}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Reserve Item</span>
            </button>

          </div>

          {/* View on Interactive Campus Map Link */}
          <div className="mt-2 text-center">
            <button
              onClick={() => onViewOnMap(product)}
              className="text-[11px] font-medium text-slate-500 hover:text-orange-600 inline-flex items-center space-x-1 transition"
            >
              <Compass className="w-3 h-3 text-orange-500" />
              <span>Show pin on Sinhgad Campus Map</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
