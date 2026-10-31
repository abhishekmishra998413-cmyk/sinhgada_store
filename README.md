# 🎓 Sinhgad Campus Mart & Chigru AI Shop Hunter
### Hyperlocal Marketplace & AI Agent for Sinhgad Institutes Students (Pune)

> **Live Local Server**: [http://localhost:5173](http://localhost:5173)  
> **Sinhgad Campuses Covered**: SCOE (Sinhgad College of Engineering), SKNCOE, NBN Sinhgad (Ambegaon), SITS (Narhe), Sinhgad Pharmacy (SCOP), SIOM, and Sinhgad Hostels.

---

## 🤖 Meet "Chigru" — Your Campus AI Shopping Agent

**Chigru** is an intelligent conversational AI agent built specifically for Sinhgad students.

### How Chigru Works:
1. **Asks What You Want & At What Price**:
   - Customer enters their item (e.g. *Mini Drafter, Lab Apron, Arduino Uno, SPPU Decoded, Black Book Hardcover Binding, Casio fx-991EX, Hostel Kettle, Extension Board*).
   - Customer enters their **target price / budget** (e.g. *₹300, ₹180, ₹450, ₹150*, or selects one-click chips).
2. **Shows Each & Every Shop Ranked from Cheapest to Most Expensive**:
   - Compares every partner shop around Sinhgad campus carrying that item.
   - Highlights:
     - `#1 CHEAPEST SHOP`: Lowest verified price on campus.
     - Price comparison badge: `🟢 ₹40 Under Your Target Price!` or `🟡 Above Target Price`.
     - Live Availability status: `In Stock (18 units)` or `Few Left (3 left)`.
     - Exact distance from student's location (e.g. `0.05 km • 1 min walk from SCOE Gate`).
3. **Turn-by-Turn Google Maps Navigation**:
   - Every shop card includes a direct **"🗺️ Directions on Google Maps"** button that opens turn-by-turn walking/driving directions to the exact store coordinates.
4. **Instant WhatsApp Hold**:
   - Includes a direct **"📱 WhatsApp Shop"** button with a pre-filled reservation message mentioning the student's name, PRN, and product so the shopkeeper keeps it behind the counter!

---

## 🚀 How to Deploy on GitHub & Generate a Live Link

The project has already been initialized with `git` and includes an automated **GitHub Pages Deployment Workflow** (`.github/workflows/deploy.yml`).

### Step 1: Create a New Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Enter a repository name (e.g., `sinhgad-campus-mart` or `chigru-sinhgad`).
3. Set it to **Public** and leave "Add a README file" unchecked (since we already have one).
4. Click **Create repository**.

### Step 2: Push Your Local Code to GitHub
Open your terminal/PowerShell in this project folder and run:

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```
*(Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub username and repository name).*

### Step 3: Enable GitHub Pages (To Generate the Live Link)
1. In your GitHub repository, click on **Settings** (top tab).
2. On the left sidebar, click on **Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. That's it! GitHub will automatically run the build and give you a live URL like:
   `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

---

## ⚡ Alternative 1-Click Deployment (Vercel / Netlify)

If you prefer **Vercel** or **Netlify** for an instant free custom domain:
1. Push your code to GitHub as shown above.
2. Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com).
3. Click **"Add New Project"** > **"Import from Git"**.
4. Select your `sinhgad-campus-mart` repository and click **Deploy**.
5. You will get a live link like `https://sinhgad-mart.vercel.app` in under 30 seconds!

---

## 🛠️ Local Development

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run local dev server
npm run dev

# 3. Build for production
npm run build
```
