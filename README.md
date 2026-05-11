# MoveIn | Pune's Premium Student Housing Platform

![MoveIn Landing Page](public/screenshot.png) <!-- Note: Add a real screenshot if available -->

MoveIn is a high-end student housing marketplace specifically designed for students moving to Pune. It eliminates the friction of high brokerage, fake listings, and inaccurate distance claims by providing a verified, role-based platform.

## 🚀 Key Features

- **Verified Stays**: Every PG and Hostel is hand-verified for safety and amenities.
- **Role-Based Access**: Specialized interfaces for **Students** (Discovery & Booking) and **Property Owners** (Listing & Lead Management).
- **Premium UX**: Glassmorphic UI, smooth Framer Motion animations, and a mobile-first responsive design.
- **Safety Audit**: 25-point safety score for every property to ensure peace of mind for students and parents.
- **Smart Filters**: Find stays near specific Pune colleges (COEP, MIT-WPU, Symbiosis, etc.).
- **Zero Brokerage**: Direct connection between students and property owners.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/Auth**: Supabase (PostgreSQL + Auth + RLS)
- **Analytics**: Google Analytics 4 (React-GA4)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vansh0204/MoveIn.git
   cd MoveIn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the SQL provided in `supabase/schema.sql` in your Supabase SQL Editor to set up tables and RLS policies.

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🛡️ Role System

- **Students**: Can explore stays, filter by college, and book visits.
- **Owners**: Access a specialized dashboard to manage listings, track inquiries, and view analytics.
- **Google OAuth**: Intelligent role detection persists your choice across sign-ins.

## 📄 License

MIT License - feel free to use this project for your own housing marketplace!

---
Built with ❤️ for the student community in Pune.
