# Internship Enrollment SPA

A production-ready React 18 + TypeScript single-page application for a 15-day internship enrollment program featuring a smooth 4-step flow with resume upload, domain selection, Razorpay payment integration, and Supabase backend.

## ✨ Features

- **4-Step Enrollment Flow**
  - Student profile with form validation
  - Interactive domain selection (UI/UX, Frontend, Database, Digital Marketing)
  - Secure Razorpay payment integration
  - Success screen with confetti, QR code, and WhatsApp sharing

- **Modern UI/UX**
  - Glassmorphism design with orange gradient theme (#FF6B35)
  - Framer Motion animations and page transitions
  - Mobile-first responsive design
  - Smooth 60fps animations

- **Production Features**
  - Resume upload to Supabase Storage with drag-drop
  - Real-time form validation with React Hook Form + Zod
  - Server-side Razorpay order creation via Edge Functions
  - QR code generation for enrollment verification
  - WhatsApp integration for sharing
  - Toast notifications
  - Offline detection
  - PWA support

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Backend**: Supabase (PostgreSQL + Storage + Edge Functions)
- **Payments**: Razorpay
- **UI Components**: Headless UI, Lucide React
- **Additional**: React Hot Toast, React Confetti, QRCode React

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Razorpay account (test/live keys)

## 🛠️ Installation

1. **Clone and install dependencies**
   ```bash
   cd d:/internship
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_APP_URL=http://localhost:5173
   VITE_WHATSAPP_NUMBER=9098855355
   VITE_ENROLLMENT_FEE=50000
   ```

3. **Set up Supabase**
   
   a. Run the database schema:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL

   b. Create storage bucket:
   - The schema creates the `resumes` bucket automatically
   - Verify in Storage section of Supabase dashboard

4. **Deploy Supabase Edge Function**
   
   Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```
   
   Login and link project:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```
   
   Deploy the Edge Function:
   ```bash
   supabase functions deploy razorpay-create-order
   ```
   
   Set Edge Function secrets:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id
   supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

## 💻 Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🏗️ Build

Create production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`

4. Redeploy:
   ```bash
   vercel --prod
   ```

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/internship-enrollment)

## 📱 Mobile Testing

Test on real device:
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `VITE_APP_URL` in `.env` to your local IP
3. Access from mobile: `http://YOUR_IP:5173`

## 🔧 Configuration

### Razorpay Test Mode

Use test keys for development:
- Key ID: Available in Razorpay Dashboard → Settings → API Keys
- Key Secret: Keep this secure, never commit to git

Test cards: https://razorpay.com/docs/payments/payments/test-card-details/

### Supabase RLS Policies

The schema includes Row Level Security policies:
- Public insert access for enrollments (enrollment flow)
- Public read access (for verification)
- Adjust policies based on your security requirements

## 📊 Performance

Target Lighthouse scores:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Optimizations included:
- Code splitting with Vite
- Lazy loading components
- Image optimization
- Tailwind CSS purging
- Gzip compression

## 🐛 Troubleshooting

**Payment not working:**
- Verify Razorpay keys are correct
- Check Edge Function is deployed and has secrets set
- Check browser console for errors

**Resume upload failing:**
- Verify Supabase Storage bucket `resumes` exists
- Check RLS policies on storage
- Ensure file size is under 5MB

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npm run build`

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase and Razorpay documentation
- Contact support at your configured WhatsApp number

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
