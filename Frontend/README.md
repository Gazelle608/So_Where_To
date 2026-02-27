# 📖 **README.md - So Where To? Mystery Travel E-Commerce Platform**

```markdown
# ✈️ So Where To? - Mystery Travel E-Commerce Platform

![Project Status](https://img.shields.io/badge/status-completed-brightgreen)
![Vue Version](https://img.shields.io/badge/vue-3.x-42b883)
![Node Version](https://img.shields.io/badge/node-18.x-339933)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [User Flows](#user-flows)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Team](#team)
- [Timeline](#timeline)
- [Challenges & Solutions](#challenges--solutions)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## 🌟 Project Overview

**So Where To?** is a unique mystery travel service e-commerce platform that sells curated mystery travel bundles. Users can "spin the globe" to receive a random destination offer, with the actual destination revealed only after purchase. The platform connects spontaneous travelers with discounted travel inventory (unsold flight seats and accommodation).

### 🎯 Value Proposition
> "Experience the thrill of not knowing where you're going. Book a mystery bundle at a fixed price, and we'll reveal your destination 48 hours before departure. Flights and accommodation included." (Reminder - Mystery pack only)

### 💼 Business Model
**B2B2C** (Business-to-Business-to-Consumer)
- **B2B:** Partnerships with airlines and hostels for bulk-purchased inventory
- **B2C:** Direct sales to consumers through the platform

### 💰 Revenue Streams
- Commission on mystery bundle sales (20-30% margin)
- Featured destination promotions

---

## ✨ Features

### 🎨 User Experience
- **Interactive 3D Globe** - Explore over 55+ destinations with clickable markers
- **Mystery Spin** - Random destination selection with engaging animation
- **Flight Ticket Cards** - Destinations displayed as real airline tickets

### 🔐 Authentication
- User registration with validation
- Login with "Remember Me" functionality
- Persistent sessions using localStorage
- Session timeout after inactivity (1 hour / 1 minute for testing)

### 🛒 Booking System
- 10-minute booking timer with warning
- Interactive seat selection (grey available, green taken)
- Multiple departure airports (JNB, CPT, DUR, PLZ, BFN, GRJ)
- Booking confirmation and history

### 📊 User Dashboard
- View upcoming and past bookings
- Blacklist preferences (destinations to avoid or to filter out)
- Profile management

### 🗺️ Destinations
- 55+ destinations across Asia, Europe, Africa, Americas, Oceania
- Mystery destinations with region-based pricing (R700-R900)
- Revealed destinations with real Unsplash images (R350-R600)
- Filter by All, Revealed, or Mystery

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Vue.js 3** | Frontend framework |
| **Vue Router** | Navigation and routing |
| **Vuex** | State management |
| **globe.gl** | 3D globe visualization |
| **Axios** | HTTP requests |
| **CSS3** | Styling and animations |

### Backend (Simulated)
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express** | API framework |
| **MySQL** | Database (simulated with localStorage) |
| **JWT** | Authentication tokens (simulated) |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Vite** | Build tool and dev server |
| **Git** | Version control |
| **VS Code** | Code editor |
| **npm** | Package management |

---

## 📁 Project Structure

```
so-where-to/
├── Frontend/
│   ├── public/
│   │   ├── images/           # Logo and static images
│   │   └── index.html        # Entry HTML
│   ├── src/
│   │   ├── assets/           # Global styles and assets
│   │   ├── components/       # Reusable components
│   │   │   ├── auth/         # Login/Register forms
│   │   │   ├── common/       # LoadingSpinner, NewsletterSignup
│   │   │   ├── layout/       # AppHeader, AppFooter
│   │   │   └── ui/           # FlightTicketCard
│   │   ├── router/           # Vue Router configuration
│   │   ├── services/         # API services
│   │   ├── stores/           # Vuex store modules
│   │   │   ├── auth.store.js
│   │   │   ├── bookings.store.js
│   │   │   ├── spin.store.js
│   │   │   ├── user.store.js
│   │   │   └── index.js
│   │   ├── views/            # Page components
│   │   │   ├── public/       # Public routes
│   │   │   │   ├── HomeView.vue
│   │   │   │   ├── DestinationsView.vue
│   │   │   │   ├── SpinView.vue
│   │   │   │   ├── HowItWorksView.vue
│   │   │   │   ├── ContactView.vue
│   │   │   │   ├── LoginView.vue
│   │   │   │   └── RegisterView.vue
│   │   │   └── protected/    # Protected routes
│   │   │       ├── DashboardView.vue
│   │   │       ├── BookingsView.vue
│   │   │       ├── BookingDetailsView.vue
│   │   │       ├── ProfileView.vue
│   │   │       ├── WishlistView.vue
│   │   │       └── CartView.vue
│   │   ├── App.vue           # Root component
│   │   └── main.js           # Entry point
│   ├── package.json
│   └── vite.config.js
├── Backend/                   # (Structure for future API)
├── Project Charter.pdf        # Project documentation
└── README.md                  # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Step-by-Step Setup

1. **Clone the repository**
```bash
git clone https://github.com/Gazelle608/so-where-to.git
cd so-where-to/Frontend
cd so-where-to/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Install backend dependencies**
```bash
npm install
```

5. **Run backend dependencies**
```bash
node --watch server.js
node server.js
nodemon
```

The application will be available at `http://localhost:5173`

---

## 📖 Usage Guide

### 👤 User Registration
1. Navigate to `/register`
2. Fill in: First Name, Last Name, Email, Password
3. Accept terms and conditions
4. Click "Create Account"
5. You'll be redirected to login

### 🔑 User Login
1. Navigate to `/login`
2. Enter email and password
3. Check "Remember Me" for persistent session
4. Click "Sign In"
5. Redirected to dashboard

### 🌍 Using the Globe
1. Navigate to `/spin`
2. Click on any location marker to view details
3. Click "Spin the Globe" button for random selection
4. After spin, a random destination will be selected
5. Click "Book Now" to proceed (requires login)

### 🎟️ Booking a Flight
1. From destination card, click "Book Now"
2. You'll have 10 minutes to complete booking
3. Select your seat from the interactive map
4. Review booking summary
5. Click "Confirm Booking"
6. View in "My Bookings" page

### ❤️ Managing Wishlist
1. Browse destinations
2. Click heart icon on any destination
3. View all saved in `/wishlist`
4. Remove items or add to cart

### 🚫 Blacklist Preferences
1. Go to Profile
2. Navigate to Blacklist tab
3. Search and select destinations to avoid
4. These will never appear in your spins

### 🌙 Dark Mode
- Click moon/sun icon in header to toggle
- Dark mode: Airport terminal theme (navy + cyan)
- Light mode: Coral pink theme
- Preference saved automatically

---

## 🔄 User Flows

### New User Flow
```
Home → Register → Login → Dashboard → Spin Globe → 
Select Destination → Book → Confirm → View Bookings
```

### Returning User Flow
```
Login → Dashboard → View Upcoming Trips → 
Browse New Destinations → Add to Wishlist → Book Later
```

### Mystery Booking Flow
```
Spin Globe → Random Selection → Review Offer → 
Book Now → Seat Selection → Confirm → Mystery Added to Bookings
```

---

## 📡 API Documentation (Simulated)

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Destinations Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/destinations` | Get all destinations |
| GET | `/api/destinations/:id` | Get single destination |
| GET | `/api/destinations/region/:region` | Get by region |

### Bookings Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |
| GET | `/api/bookings/:id` | Get booking details |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  blacklist JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Destinations Table
```sql
CREATE TABLE destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  city VARCHAR(100),
  country VARCHAR(100),
  region VARCHAR(50),
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  price DECIMAL(10,2),
  days INT,
  rating DECIMAL(3,1),
  revealed BOOLEAN,
  code VARCHAR(10),
  image TEXT,
  tags JSON
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  destinationId INT,
  bookingNumber VARCHAR(50) UNIQUE,
  departure VARCHAR(50),
  seat VARCHAR(10),
  totalPrice DECIMAL(10,2),
  status ENUM('confirmed', 'pending', 'cancelled', 'completed'),
  bookedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (destinationId) REFERENCES destinations(id)
);
```

---

## 🧪 Testing

### Manual Testing Scenarios

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Register new user | User created, redirected to login | ✅ |
| Login with credentials | Logged in, redirected to dashboard | ✅ |
| Session persistence | Stay logged in after refresh | ✅ |
| Spin globe | Random destination selected | ✅ |
| Book flight | Added to My Bookings | ✅ |
| Seat selection | Only available seats selectable | ✅ |
| Timer expiration | Redirected after timeout | ✅ |
| Dark mode toggle | Theme changes instantly | ✅ |
| Add to wishlist | Appears in wishlist page | ✅ |
| Filter destinations | Shows correct filtered results | ✅ |

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Gazelle Pearson** | Project Manager, Full Stack | Overall coordination, architecture, core development |
| **Bungcwalisa Magobiyane** | Backend Developer | Database design, API structure, server logic |
| **Waathiq Hendricks** | Backend Developer, Proposal | Backend functionality, documentation |
| **Will Mxabannis** | Frontend Developer, Proposal | UI components, frontend logic, documentation |

---

## 📅 Timeline

| Milestone | Date | Status |
|-----------|------|--------|
| Project Kickoff | 8 December 2026 | ✅ |
| Proposal & Charter | 27 February 2026 | ✅ |
| Frontend Development | 20 February 2026 | ✅ |
| Backend Integration | 23 February 2026 | ✅ |
| Testing & Bug Fixes | 25 February 2026 | ✅ |
| Final Presentation | 27 February 2026 | 🔄 |

---

## 🚧 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| 3D globe complexity | Used globe.gl library with simplified implementation |
| Session persistence | Implemented localStorage with token management |
| Seat selection UI | Created interactive grid with visual feedback |
| Countdown timer | Built with setInterval and proper cleanup |
| Responsive design | Used CSS Grid and media queries |
| Dark mode theming | CSS variables with class toggling |

---

## 🔮 Future Enhancements

- [ ] Real payment gateway integration (PayFast, PayPal)
- [ ] Actual airline API integration
- [ ] Mobile app development
- [ ] Social media login (Google, Facebook)
- [ ] User reviews and ratings
- [ ] Referral program
- [ ] Multi-language support
- [ ] Email confirmation system
- [ ] Live chat support
- [ ] Advanced analytics dashboard

---

## 📄 License

This project is created for educational purposes as part of a Software Development course. All rights reserved © 2026 Team 8.

---

## 🙏 Acknowledgements

- **Facilitators:** Matthew Brown, Khanyiso Haman, Tyhiesha Johnson
- **Libraries:** globe.gl, Vue.js, Vuex, Vue Router
- **Images:** Unsplash for placeholder destination photos
- **Icons:** SVG icons from Material Design

---

## 📞 Contact

For any questions or contributions, please contact the project team:

- **Gazelle Pearson:** pearsongazelle@gmail.com
- **Bungcwalisa Magobiyane:** magobiyanebungcwalisa@gmail.com
- **Waathiq Hendricks:** waathiqhendricks0606@gmail.com
- **Will Mxabannis:** w.mxabannis2003@gmail.com

---

<div align="center">
  <p>⭐ If you like this project, don't forget to star the repository! ⭐</p>
  <p>Made with Mystery by Group 8</p>
</div>
```