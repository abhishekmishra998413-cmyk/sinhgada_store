import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STORES, INITIAL_PRODUCTS, CAMPUS_LOCATIONS } from '../data/campusStoresAndProducts';

const StudentContext = createContext();

const DEFAULT_CONSUMER_PROFILE = {
  name: 'Abhishek Mishra',
  email: 'abhishek.sinhgad@gmail.com',
  phone: '+91 98765 43210',
  college: 'SCOE - Sinhgad College of Engineering (Vadgaon BK)',
  branch: 'Computer Engineering',
  year: 'TE (Third Year)',
  prnNumber: '72248912B',
  residenceType: 'Hostel',
  residenceLocation: 'Sinhgad Boys Hostel 3, Vadgaon BK',
  preferredBudget: 'economy',
  currentLocationId: 'scoe',
  studentPassActive: true
};

const DEFAULT_SHOPKEEPER_PROFILE = {
  ownerName: 'Manoj Patil',
  phone: '+91 98221 44552',
  storeId: 'store-gurukrupa-mess',
  storeName: 'Gurukrupa Student Mess & Dining Hall',
  role: 'shopkeeper'
};

export const COLLEGES = [
  'SCOE - Sinhgad College of Engineering (Vadgaon BK)',
  'SKNCOE - Smt. Kashibai Navale College of Engineering (Vadgaon BK)',
  'NBN Sinhgad Technical Institutes Campus (Ambegaon BK)',
  'SITS - Sinhgad Institute of Technology and Science (Narhe)',
  'Sinhgad College of Pharmacy (SCOP Vadgaon)',
  'Sinhgad Institute of Management (SIOM Vadgaon)',
  'Sinhgad College of Architecture (SCOA Vadgaon)',
  'Sinhgad Law College (Ambegaon)',
  'RMD Sinhgad School of Engineering (Warje)'
];

export const BRANCHES = [
  'Computer Engineering',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Electronics & Telecommunication (E&TC)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'Pharmacy / B.Pharm',
  'Architecture / B.Arch',
  'MBA / Management',
  'First Year General Engineering (FE)'
];

export const YEARS = [
  'FE (First Year)',
  'SE (Second Year)',
  'TE (Third Year)',
  'BE (Final Year)',
  'Postgraduate / ME / MBA'
];

export const RESIDENCE_TYPES = [
  'Sinhgad Campus Boys Hostel',
  'Sinhgad Campus Girls Hostel',
  'Private PG in Vadgaon Budruk',
  'Private PG / Flat in Ambegaon Pathar',
  'Flat / Room in Narhe / Navale Bridge',
  'Day Scholar / Commuter from Pune City'
];

export function StudentProvider({ children }) {
  // Current active login mode: 'consumer' or 'shopkeeper'
  const [activeRole, setActiveRole] = useState(() => {
    try {
      return localStorage.getItem('sinhgad_active_role') || 'consumer';
    } catch (e) {
      return 'consumer';
    }
  });

  // Consumer (Student) Profile
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_consumer_profile');
      return saved ? JSON.parse(saved) : DEFAULT_CONSUMER_PROFILE;
    } catch (e) {
      return DEFAULT_CONSUMER_PROFILE;
    }
  });

  // Shopkeeper Profile
  const [shopkeeperProfile, setShopkeeperProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_shopkeeper_profile');
      return saved ? JSON.parse(saved) : DEFAULT_SHOPKEEPER_PROFILE;
    } catch (e) {
      return DEFAULT_SHOPKEEPER_PROFILE;
    }
  });

  // Dynamic Stores Database
  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_stores_db');
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch (e) {
      return INITIAL_STORES;
    }
  });

  // Dynamic Products Database (Includes Food, Stationery, Electronics, Books, etc.)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_products_db');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  // Wishlist & Reservations
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_wishlist');
      return saved ? JSON.parse(saved) : ['food-thali-gurukrupa', 'drafter-morya-budget'];
    } catch (e) {
      return ['food-thali-gurukrupa', 'drafter-morya-budget'];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [userLocation, setUserLocation] = useState({
    id: 'scoe',
    name: 'SCOE Main Gate, Vadgaon BK',
    lat: 18.4642,
    lng: 73.8351
  });

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_active_role', activeRole);
    } catch (e) {}
  }, [activeRole]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_consumer_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_shopkeeper_profile', JSON.stringify(shopkeeperProfile));
    } catch (e) {}
  }, [shopkeeperProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_stores_db', JSON.stringify(stores));
    } catch (e) {}
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_products_db', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Consumer actions
  const updateProfile = (fields) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Shopkeeper Actions (Allows store owners to manage items in the database)
  const updateShopkeeperProfile = (fields) => {
    setShopkeeperProfile(prev => ({ ...prev, ...fields }));
  };

  const addProductToStore = (newProd) => {
    const prodWithId = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [prodWithId, ...prev]);
    return prodWithId;
  };

  const updateProductInStore = (productId, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p));
  };

  const deleteProductFromStore = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleStoreStatus = (storeId) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, isOpen: !s.isOpen } : s));
  };

  const addNewStore = (storeData) => {
    const newStore = {
      ...storeData,
      id: `store-${Date.now()}`,
      rating: 4.8,
      reviewsCount: 1,
      isOpen: true,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeData.name + ' Vadgaon Sinhgad Pune')}`
    };
    setStores(prev => [newStore, ...prev]);
    return newStore;
  };

  return (
    <StudentContext.Provider value={{
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
      addNewStore,
      wishlist,
      toggleWishlist,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      userLocation,
      setUserLocation
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
