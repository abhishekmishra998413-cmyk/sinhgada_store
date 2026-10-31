# 🎓 Sinhgad Campus Mart & AI Store Finder
### Dedicated Hyperlocal Marketplace & AI Agent for Sinhgad Institutes Students (Pune)

> **Live Server**: [http://localhost:5173](http://localhost:5173)  
> **Campuses Covered**: Sinhgad College of Engineering (SCOE), Smt. Kashibai Navale College of Engineering (SKNCOE), NBN Sinhgad Technical Institutes Campus (Ambegaon), SITS (Narhe), Sinhgad Pharmacy (SCOP), SIOM, and Sinhgad Hostels.

---

## 🌟 Key Features

### 1. 🤖 Conversational AI Shopper Agent ("Sinhgad Mitra")
- **Interactive Multi-Step Guidance**:
  - **Question 1**: *"What product or item are you looking for today?"* (Offers one-click suggestions: Mini Drafters, White Lab Apron, Arduino Uno, Decoded Books, Black Book Hardcover Binding, Casio fx-991EX, Hostel Extension Board, etc.).
  - **Question 2**: *"What is your maximum target budget in ₹?"* (One-click chips: ₹150, ₹300, ₹450, ₹600, ₹1000, or Any Budget).
  - **Question 3**: *"Where are you currently located on Sinhgad Campus?"* (SCOE Main Gate, SKNCOE, Central Library, Boys/Girls Hostels, Fun College Chowk, NBN Ambegaon).
- **Cheapest-to-Expensive Price Ranking**:
  - The AI Agent filters out items above budget and **strictly sorts all matching options from lowest price to highest price** (`#1 Cheapest Option`, `#2 Value Pick`, etc.).
  - Calculates real savings against original MRP (with student ID discount).
- **Real-time Stock Availability**:
  - Visual status badges: `In Stock (units available)`, `Few Left (only 2-3 left)`, or `Out of Stock / Pre-order`.
- **Integrated Google Maps Navigation**:
  - One-click **"Directions on Google Maps"** button that automatically launches turn-by-turn navigation directly to the store coordinates (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).
  - Direct walking distance (e.g. `0.05 km • 1 min walk`).

---

### 2. 👤 Student Customer Profile & Virtual ID Pass
- **Student Profile Management**:
  - Full Name, Sinhgad PRN / Roll Number, Contact WhatsApp & Email.
  - Sinhgad College Selector (SCOE, SKNCOE, NBN, SITS, etc.).
  - Branch/Department & Year (FE, SE, TE, BE).
  - Residence type (Sinhgad Boys/Girls Hostel, Private PG in Vadgaon/Ambegaon, Day Scholar).
- **Digital Sinhgad Student Mart ID Card**:
  - Generates a verified student customer badge with unique PRN and QR simulation.
  - Entitles students to 10%–25% official discounts at campus stores.
  - Persisted automatically to `localStorage`.

---

### 3. 🗺️ Interactive Leaflet & Google Maps Campus Locator
- **Sinhgad Campus Landmark Markers**:
  - SCOE Main Gate, SKNCOE, Central Library, Sinhgad Boys Hostels 1–5, Girls Hostel Complex, Fun College Chowk, Navale Bridge.
- **Partner Local Stores**:
  - **Morya Engineering Stationery & Xerox** (Opp. SCOE Gate)
  - **Navale Electronics & IoT Project Lab** (Near SKNCOE & Navale Hospital)
  - **Sinhgad Central Book Depot & SPPU Decoded** (Fun College Chowk)
  - **Sai Hardcover Project Binding & High-Speed Xerox** (Near NBN Gate)
  - **Omkar Hostel Essentials & Daily Mart** (Hostel Lane 3)
  - **Sinhgad 24x7 LifeCare Chemist** (Navale Bridge Chowk)
  - **TechZone Laptop & Gadgets Care** (Opp. Dental College)
  - **Sinhgad Sports & Fitness Depot** (Sports Complex Ambegaon)
- Clicking any store marker reveals products sold, prices, and one-click Google Maps walking directions.

---

### 4. 🛒 Product Reservation & WhatsApp Hold
- Students can hold/reserve urgent items (e.g., Mini Drafters before graphics exam, Arduino Uno boards for project review) without paying upfront.
- Generates a unique **Sinhgad Reservation Token** (`SINHGAD-RES-XXXXXX`).
- Includes direct WhatsApp integration with the shopkeeper to keep the item ready at the counter.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm run install

# 2. Start the development server
npm run dev
# The website will be available at http://localhost:5173
```
