# Deployment Guide

Complete step-by-step guide for deploying the Internship Enrollment application to production.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Razorpay account created (test or live)
- [ ] Vercel account (for deployment)
- [ ] Git repository (optional but recommended)

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in project details:
   - Name: `internship-enrollment`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be provisioned (~2 minutes)

### 1.2 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of `supabase/schema.sql`
4. Paste and click "Run"
5. Verify success message

### 1.3 Verify Storage Bucket

1. Go to **Storage** in sidebar
2. Verify `resumes` bucket exists
3. If not, create it:
   - Click "New Bucket"
   - Name: `resumes`
   - Public: No (keep private)
   - Click "Create Bucket"

### 1.4 Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` `public` key (starts with `eyJ...`)
3. Save these for environment variables

## Part 2: Razorpay Setup

### 2.1 Create Razorpay Account

1. Go to https://razorpay.com
2. Sign up for account
3. Complete KYC (for live mode) or use test mode

### 2.2 Get API Keys

**For Test Mode:**
1. Go to **Settings** → **API Keys**
2. Under "Test Mode", click "Generate Test Key"
3. Copy:
   - Key ID (e.g., `rzp_test_xxxxx`)
   - Key Secret (e.g., `xxxxx`) - Keep this secure!

**For Live Mode:**
1. Complete KYC verification
2. Switch to "Live Mode"
3. Generate live keys (same process)

## Part 3: Deploy Supabase Edge Function

### 3.1 Install Supabase CLI

```bash
# Windows (PowerShell)
npm install -g supabase

# Verify installation
supabase --version
```

### 3.2 Login to Supabase

```bash
supabase login
```

This will open browser for authentication.

### 3.3 Link Your Project

```bash
cd d:/internship
supabase link --project-ref YOUR_PROJECT_REF
```

Find `PROJECT_REF` in your Supabase project URL:
`https://app.supabase.com/project/YOUR_PROJECT_REF`

### 3.4 Deploy Edge Function

```bash
supabase functions deploy razorpay-create-order
```

### 3.5 Set Edge Function Secrets

```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxx
supabase secrets set RAZORPAY_KEY_SECRET=your_secret_key
```

**Important:** Use test keys for testing, live keys for production.

### 3.6 Verify Edge Function

Test the function:
```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/razorpay-create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "currency": "INR", "receipt": "test"}'
```

Should return a Razorpay order object.

## Part 4: Local Development Setup

### 4.1 Install Dependencies

```bash
cd d:/internship
npm install
```

### 4.2 Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
VITE_APP_URL=http://localhost:5173
VITE_WHATSAPP_NUMBER=9098855355
VITE_ENROLLMENT_FEE=50000
```

### 4.3 Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and test the complete flow:
1. Fill student profile
2. Select domain
3. Complete payment (use Razorpay test cards)
4. Verify success screen

**Razorpay Test Cards:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Part 5: Production Deployment (Vercel)

### 5.1 Prepare for Production

1. Update environment variables for production:
   - Use live Razorpay keys (if ready)
   - Update `VITE_APP_URL` to your domain

2. Test production build locally:
   ```bash
   npm run build
   npm run preview
   ```

### 5.2 Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: internship-enrollment
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to https://vercel.com
2. Click "New Project"
3. Import Git repository (or upload folder)
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

### 5.3 Add Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
   - `VITE_APP_URL` (your Vercel URL)
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_ENROLLMENT_FEE`
3. Apply to: Production, Preview, Development
4. Click "Save"

### 5.4 Redeploy

After adding environment variables:
```bash
vercel --prod
```

Or trigger redeploy in Vercel dashboard.

## Part 6: Post-Deployment Verification

### 6.1 Test Production App

1. Visit your Vercel URL
2. Complete full enrollment flow:
   - ✅ Profile form validation works
   - ✅ Resume upload to Supabase Storage
   - ✅ Domain selection
   - ✅ Payment with Razorpay
   - ✅ Success screen with QR code
   - ✅ WhatsApp share button works

### 6.2 Verify Database

1. Go to Supabase dashboard → Table Editor
2. Check `enrollments` table
3. Verify test enrollment appears

### 6.3 Check Performance

1. Run Lighthouse audit (Chrome DevTools)
2. Target scores:
   - Performance: 95+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 95+

### 6.4 Mobile Testing

1. Test on real mobile device
2. Verify:
   - Responsive layout
   - Touch interactions
   - Payment flow on mobile
   - WhatsApp sharing

## Part 7: Going Live

### 7.1 Switch to Live Razorpay Keys

1. Complete Razorpay KYC
2. Get live API keys
3. Update Vercel environment variables
4. Update Edge Function secrets:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxxxx
   supabase secrets set RAZORPAY_KEY_SECRET=live_secret
   ```
5. Redeploy

### 7.2 Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `VITE_APP_URL` environment variable
5. Redeploy

### 7.3 Enable Production Features

- Set up email notifications (via Supabase Edge Functions)
- Configure WhatsApp Business API (optional)
- Set up analytics (Google Analytics, Vercel Analytics)
- Enable error tracking (Sentry)

## Troubleshooting

### Edge Function Not Working

```bash
# Check function logs
supabase functions logs razorpay-create-order

# Redeploy
supabase functions deploy razorpay-create-order --no-verify-jwt
```

### Environment Variables Not Loading

- Ensure all variables start with `VITE_`
- Redeploy after adding variables
- Clear browser cache

### Payment Failing

- Verify Razorpay keys are correct
- Check Edge Function secrets
- Test with Razorpay test cards first
- Check browser console for errors

### Resume Upload Failing

- Verify Storage bucket exists
- Check RLS policies
- Ensure file size < 5MB

## Security Checklist

- [ ] Never commit `.env` to git
- [ ] Use environment variables for all secrets
- [ ] Enable RLS on Supabase tables
- [ ] Use HTTPS only (Vercel provides this)
- [ ] Validate all inputs on backend
- [ ] Keep dependencies updated

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring

- Check Supabase dashboard for database usage
- Monitor Razorpay dashboard for payments
- Review Vercel analytics for traffic
- Set up uptime monitoring (UptimeRobot, Pingdom)

---

**Deployment Complete! 🎉**

Your internship enrollment application is now live and ready to accept enrollments.
