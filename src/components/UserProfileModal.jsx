import React, { useState } from 'react';
import { 
  X, 
  User, 
  Store, 
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
  Save,
  PlusCircle,
  Package,
  Clock,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useStudent, COLLEGES, BRANCHES, YEARS, RESIDENCE_TYPES } from '../context/StudentContext';
import { CATEGORIES } from '../data/campusStoresAndProducts';

export default function UserProfileModal({ isOpen, onClose }) {
  const { 
    activeRole, 
    setActiveRole, 
    profile, 
    updateProfile, 
    shopkeeperProfile, 
    updateShopkeeperProfile,
    stores, 
    products, 
    addProductToStore, 
    updateProductInStore, 
    deleteProductFromStore,
    toggleStoreStatus,
    addNewStore 
  } = useStudent();

  const [currentTab, setCurrentTab] = useState(activeRole); // 'consumer' | 'shopkeeper'
  
  // Consumer form state
  const [consumerData, setConsumerData] = useState({ ...profile });
  const [consumerSavedSuccess, setConsumerSavedSuccess] = useState(false);

  // Shopkeeper form state
  const [shopkeeperData, setShopkeeperData] = useState({ ...shopkeeperProfile });
  const [selectedStoreId, setSelectedStoreId] = useState(shopkeeperProfile.storeId || stores[0]?.id);
  const [shopkeeperSavedSuccess, setShopkeeperSavedSuccess] = useState(false);

  // Add new product state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Food, Canteen & Student Mess',
    price: '',
    mrp: '',
    stock: 'in_stock',
    stockCount: 20,
    description: '',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    shopNote: ''
  });

  // Add new store state
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    category: 'Food, Canteen & Student Mess',
    tagline: '',
    address: '',
    phone: '+91 98220 00000',
    proximity: 'Vadgaon Campus',
    studentDiscountNote: '10% OFF with Sinhgad ID',
    lat: 18.4635,
    lng: 73.8345
  });

  if (!isOpen) return null;

  // Active store for shopkeeper
  const currentStore = stores.find(s => s.id === selectedStoreId) || stores[0];
  const storeItems = products.filter(p => p.storeId === selectedStoreId);

  const handleConsumerSave = (e) => {
    e.preventDefault();
    updateProfile(consumerData);
    setActiveRole('consumer');
    setConsumerSavedSuccess(true);
    setTimeout(() => setConsumerSavedSuccess(false), 2000);
  };

  const handleShopkeeperSave = (e) => {
    e.preventDefault();
    updateShopkeeperProfile({
      ...shopkeeperData,
      storeId: selectedStoreId,
      storeName: currentStore?.name
    });
    setActiveRole('shopkeeper');
    setShopkeeperSavedSuccess(true);
    setTimeout(() => setShopkeeperSavedSuccess(false), 2000);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    addProductToStore({
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      mrp: Number(newProd.mrp || newProd.price),
      stock: newProd.stock,
      stockCount: Number(newProd.stockCount || 10),
      description: newProd.description || `${newProd.name} available at ${currentStore.name}`,
      image: newProd.image,
      shopNote: newProd.shopNote || 'Added by store owner',
      storeId: selectedStoreId,
      keywords: newProd.name.toLowerCase().split(/\s+/)
    });

    setIsAddingProduct(false);
    setNewProd({
      name: '',
      category: 'Food, Canteen & Student Mess',
      price: '',
      mrp: '',
      stock: 'in_stock',
      stockCount: 20,
      description: '',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
      shopNote: ''
    });
  };

  const handleCreateStore = (e) => {
    e.preventDefault();
    if (!newStore.name) return;

    const created = addNewStore(newStore);
    setSelectedStoreId(created.id);
    setIsAddingStore(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Role Tabs */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-white/25 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Sinhgad Portal Login & Profile
            </span>
            <span className="text-xs text-amber-100 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Database</span>
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            Select Your Role to Access Campus Mart
          </h2>
          <p className="text-orange-100 text-xs mt-1">
            Choose whether you are a Student Consumer or a Campus Shopkeeper / Mess Owner
          </p>

          {/* Role Switcher Pills */}
          <div className="mt-5 grid grid-cols-2 gap-2 bg-black/20 p-1.5 rounded-2xl max-w-md">
            <button
              onClick={() => setCurrentTab('consumer')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                currentTab === 'consumer'
                  ? 'bg-white text-orange-950 shadow-md'
                  : 'text-orange-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4 text-orange-600" />
              <span>Consumer (Student)</span>
            </button>

            <button
              onClick={() => setCurrentTab('shopkeeper')}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                currentTab === 'shopkeeper'
                  ? 'bg-white text-orange-950 shadow-md'
                  : 'text-orange-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4 text-orange-600" />
              <span>Shopkeeper (Merchant)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto bg-stone-50/50">
          
          {/* ================================================= */}
          {/* CONSUMER / STUDENT TAB */}
          {/* ================================================= */}
          {currentTab === 'consumer' && (
            <div>
              {/* Virtual ID Pass Preview */}
              <div className="mb-6 bg-gradient-to-br from-slate-900 via-stone-900 to-orange-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-mono tracking-widest uppercase text-orange-400">
                      SINHGAD TECHNICAL EDUCATION SOCIETY
                    </p>
                    <h3 className="text-lg font-bold">Student Customer Pass</h3>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg px-2 py-0.5 text-[10px] font-bold">
                    ACTIVE PASS
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-2 text-xs">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase">Student</p>
                    <p className="font-semibold text-white truncate">{consumerData.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase">College</p>
                    <p className="font-semibold text-white truncate">{consumerData.college?.split(' - ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase">PRN / Roll</p>
                    <p className="font-mono font-semibold text-amber-300">{consumerData.prnNumber}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-300 flex items-center justify-between">
                  <span className="text-orange-300">Entitles you to 10%–25% OFF at all campus stores & messes</span>
                  <span className="font-mono text-stone-400">Pune 411041</span>
                </div>
              </div>

              {/* Edit Consumer Profile Form */}
              <form onSubmit={handleConsumerSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={consumerData.name}
                      onChange={(e) => setConsumerData({ ...consumerData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sinhgad PRN / Roll</label>
                    <input
                      type="text"
                      value={consumerData.prnNumber}
                      onChange={(e) => setConsumerData({ ...consumerData, prnNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sinhgad College</label>
                    <select
                      value={consumerData.college}
                      onChange={(e) => setConsumerData({ ...consumerData, college: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-orange-500/20"
                    >
                      {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Dept</label>
                    <select
                      value={consumerData.branch}
                      onChange={(e) => setConsumerData({ ...consumerData, branch: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                    >
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                    <select
                      value={consumerData.year}
                      onChange={(e) => setConsumerData({ ...consumerData, year: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={consumerData.phone}
                      onChange={(e) => setConsumerData({ ...consumerData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={consumerData.email}
                      onChange={(e) => setConsumerData({ ...consumerData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Residence Location / Hostel</label>
                    <input
                      type="text"
                      value={consumerData.residenceLocation}
                      onChange={(e) => setConsumerData({ ...consumerData, residenceLocation: e.target.value })}
                      placeholder="e.g. Sinhgad Boys Hostel 3 / Flat in Ambegaon Pathar"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  {consumerSavedSuccess ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Consumer Profile Saved!</span>
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Consumer Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================= */}
          {/* SHOPKEEPER / STORE OWNER TAB */}
          {/* ================================================= */}
          {currentTab === 'shopkeeper' && (
            <div className="space-y-6">
              
              {/* Shop Selector & Status Toggle */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      Merchant Store Manager
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Manage Store & Inventory
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleStoreStatus(selectedStoreId)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        currentStore?.isOpen 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${currentStore?.isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <span>{currentStore?.isOpen ? 'Store is OPEN' : 'Store is CLOSED'}</span>
                    </button>

                    <button
                      onClick={() => setIsAddingStore(!isAddingStore)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded-xl"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-orange-600" />
                      <span>Register New Shop</span>
                    </button>
                  </div>
                </div>

                {/* Select which store to manage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Choose Your Store from Database:
                    </label>
                    <select
                      value={selectedStoreId}
                      onChange={(e) => setSelectedStoreId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-slate-900"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.category.split(',')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Owner Contact Name:
                    </label>
                    <input
                      type="text"
                      value={shopkeeperData.ownerName}
                      onChange={(e) => setShopkeeperData({ ...shopkeeperData, ownerName: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      placeholder="Manoj Patil"
                    />
                  </div>
                </div>

                {/* Current Store Meta Info */}
                {currentStore && (
                  <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      <span>{currentStore.address}</span>
                    </span>
                    <span className="text-[11px] font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                      {currentStore.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Form to Register a Brand New Store */}
              {isAddingStore && (
                <form onSubmit={handleCreateStore} className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-3 animate-in fade-in">
                  <h4 className="font-extrabold text-amber-950 text-sm flex items-center space-x-1.5">
                    <Store className="w-4 h-4 text-orange-600" />
                    <span>Register New Sinhgad Campus Store / Mess into Database</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Store / Canteen Name</label>
                      <input
                        type="text"
                        value={newStore.name}
                        onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                        placeholder="e.g. Om Sai Canteen & Snacks"
                        required
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={newStore.category}
                        onChange={(e) => setNewStore({ ...newStore, category: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      >
                        {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">Campus Proximity & Address</label>
                      <input
                        type="text"
                        value={newStore.address}
                        onChange={(e) => setNewStore({ ...newStore, address: e.target.value, proximity: e.target.value })}
                        placeholder="e.g. Near SCOE Canteen / Vadgaon BK"
                        required
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={newStore.phone}
                        onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                        placeholder="+91 98220 12345"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Student Discount Perk</label>
                      <input
                        type="text"
                        value={newStore.studentDiscountNote}
                        onChange={(e) => setNewStore({ ...newStore, studentDiscountNote: e.target.value })}
                        placeholder="10% OFF with Sinhgad ID"
                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStore(false)}
                      className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-orange-600 text-white rounded-xl font-bold"
                    >
                      Add Store to Database
                    </button>
                  </div>
                </form>
              )}

              {/* Store Items List & Add Product Button */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {currentStore?.name} — Products & Menu ({storeItems.length})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Items immediately sync with Chigru AI search and live customer price rankings
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingProduct(!isAddingProduct)}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Item / Food</span>
                  </button>
                </div>

                {/* Add Product Form */}
                {isAddingProduct && (
                  <form onSubmit={handleCreateProduct} className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200 text-xs space-y-3 mb-4 animate-in fade-in">
                    <h5 className="font-bold text-orange-950 text-xs uppercase tracking-wider">
                      Add New Item / Dish
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Item / Dish Name</label>
                        <input
                          type="text"
                          value={newProd.name}
                          onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                          placeholder="e.g. Special Paneer Thali / Drafter"
                          required
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Category</label>
                        <select
                          value={newProd.category}
                          onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                        >
                          {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={newProd.price}
                          onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                          placeholder="80"
                          required
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold text-orange-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">MRP (₹)</label>
                        <input
                          type="number"
                          value={newProd.mrp}
                          onChange={(e) => setNewProd({ ...newProd, mrp: e.target.value })}
                          placeholder="100"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Stock Status</label>
                        <select
                          value={newProd.stock}
                          onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                        >
                          <option value="in_stock">In Stock</option>
                          <option value="few_left">Few Left (2-3 left)</option>
                          <option value="out_of_stock">Out of Stock</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Available Units</label>
                        <input
                          type="number"
                          value={newProd.stockCount}
                          onChange={(e) => setNewProd({ ...newProd, stockCount: e.target.value })}
                          placeholder="25"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">Description / Ingredients</label>
                        <input
                          type="text"
                          value={newProd.description}
                          onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                          placeholder="Hot fresh chapati, 2 sabjis, dal tadka, rice"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingProduct(false)}
                        className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-orange-600 text-white rounded-xl font-bold"
                      >
                        Save Item
                      </button>
                    </div>
                  </form>
                )}

                {/* Items in this Store */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {storeItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No products added yet for this store. Click "Add Item / Food" above!
                    </div>
                  ) : (
                    storeItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.category}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-black text-orange-600 text-sm">₹{item.price}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              item.stock === 'in_stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.stock === 'in_stock' ? `In Stock (${item.stockCount})` : 'Limited'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => {
                              const newPrice = prompt(`Enter new price for "${item.name}":`, item.price);
                              if (newPrice && !isNaN(newPrice)) {
                                updateProductInStore(item.id, { price: Number(newPrice) });
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-orange-600 bg-white rounded-lg border border-stone-200"
                            title="Edit Price"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              const nextStock = item.stock === 'in_stock' ? 'out_of_stock' : 'in_stock';
                              updateProductInStore(item.id, { stock: nextStock });
                            }}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 bg-white rounded-lg border border-stone-200"
                            title="Toggle Stock Status"
                          >
                            <Package className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => deleteProductFromStore(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 bg-white rounded-lg border border-stone-200"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* Save Shopkeeper Preferences */}
              <div className="pt-2 flex justify-between items-center text-xs">
                {shopkeeperSavedSuccess ? (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-lg flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Shopkeeper Mode Saved!</span>
                  </span>
                ) : <span />}

                <button
                  type="button"
                  onClick={handleShopkeeperSave}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-md shadow-orange-500/20"
                >
                  Activate Shopkeeper Dashboard
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
