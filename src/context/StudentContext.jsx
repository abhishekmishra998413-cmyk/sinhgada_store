import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

const DEFAULT_PROFILE = {
  name: 'Abhishek Mishra',
  email: 'abhishek.sinhgad@gmail.com',
  phone: '+91 98765 43210',
  college: 'SCOE - Sinhgad College of Engineering (Vadgaon BK)',
  branch: 'Computer Engineering',
  year: 'TE (Third Year)',
  prnNumber: '72248912B',
  residenceType: 'Hostel',
  residenceLocation: 'Sinhgad Boys Hostel 3, Vadgaon BK',
  preferredBudget: 'economy', // 'economy' | 'moderate' | 'any'
  currentLocationId: 'scoe',
  joinedDate: 'August 2024',
  studentPassActive: true
};

export const COLLEGES = [
  'SCOE - Sinhgad College of Engineering (Vadgaon BK)',
  'SKNCOE - Smt. Kashibai Navale College of Engineering (Vadgaon BK)',
  'NBN Sinhgad School of Engineering (Ambegaon BK)',
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
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_student_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_student_wishlist');
      return saved ? JSON.parse(saved) : ['prod-drafter-1', 'prod-arduino-uno'];
    } catch (e) {
      return ['prod-drafter-1', 'prod-arduino-uno'];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sinhgad_student_cart');
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

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_student_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_student_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sinhgad_student_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const updateProfile = (newFields) => {
    setProfile(prev => ({ ...prev, ...newFields }));
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

  return (
    <StudentContext.Provider value={{
      profile,
      updateProfile,
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
