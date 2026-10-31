import React, { useState } from 'react';
import { 
  User, 
  Store, 
  Phone, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Bot,
  HeartHandshake
} from 'lucide-react';
import { useStudent, COLLEGES, BRANCHES } from '../context/StudentContext';

export default function OnboardingPopupModal({ isOpen, onClose }) {
  const { registerUser } = useStudent();

  const [role, setRole] = useState('consumer'); // 'consumer' | 'shopkeeper'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState(COLLEGES[0]);
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [storeName, setStoreName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid 10-digit mobile / WhatsApp number.');
      return;
    }

    // Register user in database
    registerUser({
      name: name.trim(),
      phone: phone.trim(),
      role,
      college: role === 'consumer' ? college : '',
      branch: role === 'consumer' ? branch : '',
      storeName: role === 'shopkeeper' ? (storeName || 'Campus Partner Store') : ''
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-6 transform animate-in zoom-in-95 duration-200">
        
        {/* Soothing Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 relative">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Welcome to Sinhgad Institutes
            </span>
            <span className="flex items-center space-x-1 text-xs text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Verified</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 mt-1">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-2 ring-white/30 shrink-0">
              <Bot className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Sinhgad Campus Mart
              </h2>
              <p className="text-xs text-orange-100">
                Meet Chigru AI • Compare prices & find all nearby stores & messes
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-stone-50/60">
          
          {successMsg ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Welcome, {name}!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your profile has been stored in our campus database. Chigru AI is ready to find you the cheapest shops!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Who You Are:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('consumer')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
                      role === 'consumer'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-500/20'
                        : 'bg-white text-slate-700 border-stone-200 hover:border-orange-300'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Sinhgad Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('shopkeeper')}
                    className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
                      role === 'shopkeeper'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20'
                        : 'bg-white text-slate-700 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Shopkeeper / Mess</span>
                  </button>
                </div>
              </div>

              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={role === 'consumer' ? "e.g. Abhishek Mishra" : "e.g. Manoj Patil"}
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Phone Number Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Stored securely in the campus database for order reservations & discounts.
                </p>
              </div>

              {/* Consumer specific fields */}
              {role === 'consumer' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sinhgad College
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20"
                      >
                        {COLLEGES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Branch / Department
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                      >
                        {BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                /* Shopkeeper specific field */
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Store or Mess Name
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Gurukrupa Mess / Morya Stationery"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/25 transition transform active:scale-98"
                >
                  <span>Enter Sinhgad Campus Mart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Skip / Browse */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                >
                  Skip for now & browse as guest
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
