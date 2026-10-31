import React, { useState } from 'react';
import { 
  X, 
  User, 
  GraduationCap, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Sparkles,
  QrCode,
  Tag,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useStudent, COLLEGES, BRANCHES, YEARS, RESIDENCE_TYPES } from '../context/StudentContext';

export default function StudentProfileModal({ isOpen, onClose }) {
  const { profile, updateProfile, wishlist, cart } = useStudent();
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Student Customer Profile
            </span>
            <span className="flex items-center space-x-1 text-xs text-amber-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sinhgad Campus Verified</span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold">Sinhgadite Customer Pass & Profile</h2>
          <p className="text-orange-100 text-xs mt-1">
            Used by nearby campus stores to give you official student discounts and reserve products.
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {/* Digital Sinhgad ID Card Simulation */}
          <div className="mb-6 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-mono tracking-widest uppercase text-orange-400">
                  SINHGAD TECHNICAL EDUCATION SOCIETY
                </p>
                <h3 className="text-lg font-bold tracking-tight">Student Customer Card</h3>
              </div>
              <div className="bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-lg px-2 py-1 text-[10px] font-bold uppercase">
                Active Pass
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 my-3 text-xs">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Student Name</p>
                <p className="font-semibold text-white truncate">{formData.name || 'Student Name'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">College</p>
                <p className="font-semibold text-white truncate">
                  {formData.college ? formData.college.split(' - ')[0] : 'SCOE'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase">PRN / Roll No</p>
                <p className="font-mono font-semibold text-amber-300 truncate">
                  {formData.prnNumber || '72248912B'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-orange-400" />
                <span>Entitled to 10-25% Discount at Campus Stores</span>
              </span>
              <span className="font-mono text-slate-400">PUNE 411041</span>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="Abhishek Mishra"
                  />
                </div>
              </div>

              {/* Sinhgad PRN */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sinhgad PRN / Roll Number
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="prnNumber"
                    value={formData.prnNumber}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                    placeholder="e.g. 72145892K"
                  />
                </div>
              </div>

              {/* Sinhgad College Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sinhgad College Campus
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    {COLLEGES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch / Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch / Department
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    {BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  {YEARS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Phone (WhatsApp) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="student@sinhgad.edu"
                  />
                </div>
              </div>

              {/* Hostel / Residence */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residence / Hostel Location (for distance & delivery calculation)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="residenceLocation"
                    value={formData.residenceLocation}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    placeholder="e.g. Sinhgad Boys Hostel 3 / Flat in Ambegaon Pathar"
                  />
                </div>
              </div>

            </div>

            {/* Save Buttons & Feedback */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                {savedSuccess && (
                  <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Customer Profile Updated!</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-orange-500/20 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
