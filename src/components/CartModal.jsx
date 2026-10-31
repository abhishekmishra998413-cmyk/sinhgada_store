import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ExternalLink, 
  Sparkles,
  QrCode,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export default function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart, profile } = useStudent();
  const [reservationComplete, setReservationComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const totalMrp = cart.reduce((sum, item) => sum + ((item.mrp || item.price) * (item.qty || 1)), 0);
  const studentSavings = Math.max(0, totalMrp - subtotal);

  const handleConfirmReservation = () => {
    setReservationComplete(true);
  };

  const reservationId = `SINHGAD-RES-${Math.floor(100000 + Math.random() * 900000)}`;

  // Construct WhatsApp reservation message
  const itemsText = cart.map(i => `• ${i.name} (Qty: ${i.qty || 1}) - ₹${i.price}`).join('%0A');
  const whatsappUrl = `https://wa.me/919822144552?text=Hello%20Sinhgad%20Store,%20I%20am%20${encodeURIComponent(profile.name)}%20(PRN:%20${profile.prnNumber})%20from%20${encodeURIComponent(profile.college)}.%20Please%20reserve%20these%20items%20for%20me:%0A${itemsText}%0ATotal:%20₹${subtotal}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Held & Reserved Items</h3>
              <p className="text-xs text-slate-400">
                Reserve without upfront payment • Pick up at Campus Store
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {reservationComplete ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Items Reserved for You!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Show your Sinhgad ID or this token when collecting at the store.
                </p>
              </div>

              {/* Reservation Token Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 max-w-sm mx-auto text-left font-mono text-xs text-slate-800 space-y-1.5">
                <div className="flex justify-between border-b border-orange-200 pb-2">
                  <span className="text-slate-500">Token ID:</span>
                  <span className="font-bold text-orange-700">{reservationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PRN / Roll:</span>
                  <span className="font-bold text-amber-700">{profile.prnNumber}</span>
                </div>
                <div className="flex justify-between border-t border-orange-200 pt-2 text-sm font-sans font-bold">
                  <span>Pay on Pickup:</span>
                  <span className="text-orange-600">₹{subtotal}</span>
                </div>
              </div>

              {/* WhatsApp Shopkeeper Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition"
                >
                  <span>WhatsApp Shopkeeper</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    clearCart();
                    setReservationComplete(false);
                    onClose();
                  }}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-1" />
              <p className="font-bold text-slate-700 text-base">Your Reservation Bag is Empty</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Explore campus stationery, books, and electronics to hold them before they go out of stock!
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                        <span>{item.store?.name || 'Campus Store'}</span>
                      </p>
                      <div className="mt-1 flex items-baseline space-x-2">
                        <span className="font-extrabold text-orange-600 text-sm">
                          ₹{item.price}
                        </span>
                        {item.mrp && item.mrp > item.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total MRP:</span>
                  <span>₹{totalMrp}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Sinhgad Student Savings:</span>
                  <span>- ₹{studentSavings}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-extrabold text-sm sm:text-base">
                  <span>Payable at Store:</span>
                  <span className="text-orange-600">₹{subtotal}</span>
                </div>
              </div>

              {/* Confirm Reservation CTA */}
              <div className="pt-2">
                <button
                  onClick={handleConfirmReservation}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition"
                >
                  <span>Confirm Free Reservation Token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  No payment needed right now. Pay directly via UPI / Cash at the shop.
                </p>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
