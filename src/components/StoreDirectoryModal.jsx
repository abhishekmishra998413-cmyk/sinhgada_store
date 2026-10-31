import React from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ExternalLink, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Tag 
} from 'lucide-react';
import { STORES, PRODUCTS } from '../data/campusStoresAndProducts';
import { useStudent } from '../context/StudentContext';
import { calculateDistanceKm } from '../services/aiAgentService';

export default function StoreDirectoryModal({ isOpen, onClose, onSelectStoreForMap }) {
  const { userLocation, stores, products } = useStudent();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] sm:h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Official Campus Partners
              </span>
              <span className="text-xs text-orange-100 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sinhgad Institutes Verified</span>
              </span>
            </div>
            <h3 className="text-xl font-extrabold mt-1">Nearby Sinhgad Stores Directory</h3>
            <p className="text-xs text-orange-100">
              Verified local shops around Vadgaon Budruk, Ambegaon BK & Narhe
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store) => {
              const distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, store.lat, store.lng);
              const walkTimeMin = Math.max(1, Math.round((distanceKm / 4.5) * 60));
              const storeProductsCount = products.filter(p => p.storeId === store.id).length;
              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/70 px-2.5 py-0.5 rounded-md">
                        {store.category}
                      </span>
                      <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{store.rating}</span>
                        <span className="text-slate-400 font-normal">({store.reviewsCount})</span>
                      </div>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {store.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {store.tagline}
                    </p>

                    {/* Proximity & Distance */}
                    <div className="bg-slate-50 rounded-xl p-2.5 my-3 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="flex items-center space-x-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate">{store.proximity}</span>
                        </span>
                        <span className="text-[10px] font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded shrink-0">
                          {distanceKm} km ({walkTimeMin} min walk)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5">
                        {store.address}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold pl-5 flex items-center space-x-1 pt-0.5">
                        <Tag className="w-3 h-3" />
                        <span>{store.studentDiscountNote}</span>
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1 text-xs text-slate-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{store.openHours}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{store.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectStoreForMap(store.id);
                      }}
                      className="inline-flex items-center justify-center space-x-1 py-2 bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-800 rounded-xl text-xs font-semibold transition"
                    >
                      <Compass className="w-3.5 h-3.5 text-orange-600" />
                      <span>Pin on Map</span>
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
