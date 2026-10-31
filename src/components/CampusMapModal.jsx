import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ExternalLink, 
  Compass, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import L from 'leaflet';
import { CAMPUS_LOCATIONS, STORES, PRODUCTS } from '../data/campusStoresAndProducts';
import { useStudent } from '../context/StudentContext';
import { calculateDistanceKm } from '../services/aiAgentService';

export default function CampusMapModal({ isOpen, onClose, selectedProduct, highlightedStoreId }) {
  const { userLocation, stores, products } = useStudent();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [activeStore, setActiveStore] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    // Default center: Sinhgad Campus, Vadgaon Budruk Pune
    const centerLat = selectedProduct?.lat || 18.4635;
    const centerLng = selectedProduct?.lng || 73.8345;

    // Small timeout to ensure DOM container is rendered
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], 16);
      mapInstanceRef.current = map;

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Sinhgad Campus Pune',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon helper
      const createIcon = (color, text, isStore = false) => {
        return L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background-color: ${color};
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span>${isStore ? '🏪' : '🎓'}</span>
              <span>${text}</span>
            </div>
          `,
          iconSize: [100, 30],
          iconAnchor: [50, 15]
        });
      };

      // Add student current location marker
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createIcon('#2563eb', 'You Are Here', false)
      }).addTo(map);
      userMarker.bindPopup(`<b>Your Current Spot:</b><br/>${userLocation.name}`).openPopup();

      // Add Sinhgad Campus Landmark Markers
      CAMPUS_LOCATIONS.forEach(loc => {
        if (loc.id !== userLocation.id) {
          const marker = L.marker([loc.lat, loc.lng], {
            icon: createIcon('#64748b', loc.name.split(' (')[0], false)
          }).addTo(map);
          marker.bindPopup(`<b>${loc.name}</b><br/>Sinhgad Landmark`);
        }
      });

      // Add Store Markers from dynamic database
      stores.forEach(store => {
        const isSelected = selectedProduct && selectedProduct.storeId === store.id;
        const isHighlighted = highlightedStoreId === store.id;
        const color = isSelected || isHighlighted ? '#16a34a' : '#ea580c';

        const storeMarker = L.marker([store.lat, store.lng], {
          icon: createIcon(color, store.name.split(' ')[0], true)
        }).addTo(map);

        storeMarker.on('click', () => {
          setActiveStore(store);
        });

        markersRef.current.push(storeMarker);

        if (isSelected || isHighlighted) {
          setActiveStore(store);
          map.setView([store.lat, store.lng], 17);
        }
      });

    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, selectedProduct, highlightedStoreId, stores]);

  if (!isOpen) return null;

  // Selected store items from dynamic database
  const storeProducts = activeStore 
    ? products.filter(p => p.storeId === activeStore.id).sort((a,b) => a.price - b.price)
    : [];

  const distanceToActiveStore = activeStore
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, activeStore.lat, activeStore.lng)
    : 0.2;

  const googleMapsDirectionsUrl = activeStore
    ? `https://www.google.com/maps/dir/?api=1&destination=${activeStore.lat},${activeStore.lng}`
    : `https://www.google.com/maps/search/?api=1&query=Sinhgad+Vadgaon+Pune`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[92vh] sm:h-[88vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base flex items-center space-x-2">
                <span>Sinhgad Campus Map & Store Locator</span>
                <span className="bg-orange-500/30 text-orange-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-orange-500/40">
                  Vadgaon & Ambegaon BK
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pins for SCOE, SKNCOE, Central Library, Hostels & Partner local shops
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body and Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Interactive Leaflet Map */}
          <div className="flex-1 h-1/2 md:h-full relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            {/* Quick Floating Controls */}
            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs font-medium text-slate-700 flex items-center space-x-3 pointer-events-auto">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>You</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                <span>Nearby Stores</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>Campus Gates</span>
              </div>
            </div>
          </div>

          {/* Store Details Panel */}
          <div className="w-full md:w-80 lg:w-96 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto p-4 flex flex-col justify-between shrink-0 h-1/2 md:h-full">
            {activeStore ? (
              <div className="space-y-4">
                
                {/* Store Header */}
                <div>
                  <div className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/70 px-2.5 py-0.5 rounded-full mb-1">
                    <span>{activeStore.category}</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {activeStore.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeStore.tagline}
                  </p>
                </div>

                {/* Distance & Proximity Banner */}
                <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3 text-xs">
                  <div className="flex items-center justify-between text-orange-950 font-bold mb-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{distanceToActiveStore} km from your spot</span>
                    </span>
                    <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                      ~{Math.max(1, Math.round((distanceToActiveStore / 4.5) * 60))} min walk
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-800">
                    📍 {activeStore.proximity}
                  </p>
                  <p className="text-[11px] text-orange-700 font-semibold mt-1">
                    🎁 {activeStore.studentDiscountNote}
                  </p>
                </div>

                {/* Open Hours & Phone */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeStore.openHours}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{activeStore.phone}</span>
                  </div>
                </div>

                {/* Products Available at this store (Sorted Cheapest First) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Available Stock ({storeProducts.length})
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Cheapest First
                    </span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {storeProducts.map(p => (
                      <div key={p.id} className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            {p.stock === 'in_stock' ? `In Stock (${p.stockCount})` : 'Limited'}
                          </p>
                        </div>
                        <span className="font-black text-orange-600 shrink-0">
                          ₹{p.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Google Maps External Link Button */}
                <div className="pt-2">
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open in Google Maps Navigation</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <MapPin className="w-10 h-10 text-orange-400 mb-2 stroke-1" />
                <p className="font-bold text-slate-700 text-sm">Select Any Store Pin on the Map</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                  Click on any orange store marker to view prices, products, and direct Google Maps walking routes.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
