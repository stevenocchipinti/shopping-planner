# Deployment Guide

## Overview

This guide explains how to set up a staging Firebase hosting site for testing the rewritten app before deploying to production.

---

## Firebase Project Structure

**Project:** `shopping-list-app-de905`

**Hosting Sites:**
- **Production:** `shoppingplanner` → https://shoppingplanner.web.app
- **Staging:** `shoppingplanner-beta` → https://shoppingplanner-beta.web.app (to be created)

**Firestore Database:**
- Shared between both sites (same data)
- Allows testing new app with production data
- Changes made in staging affect production data (use with caution)

---

## Setup Staging Site

### Step 1: Create Staging Site in Firebase Console

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `shopping-list-app-de905`
3. Navigate to **Hosting** in left sidebar
4. Click **Add another site**
5. Enter site ID: `shoppingplanner-beta`
6. Click **Create**

### Step 2: Configure Firebase CLI Targets

The `.firebaserc` file needs to be updated to include the staging target:

```json
{
  "projects": {
    "default": "shopping-list-app-de905"
  },
  "targets": {
    "shopping-list-app-de905": {
      "hosting": {
        "shoppingplanner": [
          "shoppingplanner"
        ],
        "shoppingplanner-beta": [
          "shoppingplanner-beta"
        ]
      }
    }
  }
}
```

Run these commands to set up targets:

```bash
# Set production target
firebase target:apply hosting shoppingplanner shoppingplanner

# Set staging target  
firebase target:apply hosting shoppingplanner-beta shoppingplanner-beta
```

### Step 3: Update firebase.json

Update `firebase.json` to support multiple hosting targets:

```json
{
  "hosting": [
    {
      "target": "shoppingplanner",
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "shoppingplanner-beta",
      "public": "dist",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

---

## Deployment Commands

### Deploy to Staging Only

```bash
# Build the app
yarn build

# Deploy to staging
firebase deploy --only hosting:shoppingplanner-beta
```

### Deploy to Production Only

```bash
# Build the app
yarn build

# Deploy to production
firebase deploy --only hosting:shoppingplanner
```

### Deploy to Both Sites

```bash
# Build the app
yarn build

# Deploy to both
firebase deploy --only hosting
```

---

## Package.json Scripts

Add these convenience scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "deploy:staging": "yarn build && firebase deploy --only hosting:shoppingplanner-beta",
    "deploy:prod": "yarn build && firebase deploy --only hosting:shoppingplanner",
    "deploy:both": "yarn build && firebase deploy --only hosting"
  }
}
```

**Usage:**
```bash
yarn deploy:staging   # Deploy to beta site
yarn deploy:prod      # Deploy to production site  
yarn deploy:both      # Deploy to both sites
```

---

## Testing Workflow

### Phase 1: Initial Staging Deploy

1. Complete Phase 1-5 of development
2. Build production bundle: `yarn build`
3. Deploy to staging: `yarn deploy:staging`
4. Open staging URL: https://shoppingplanner-beta.web.app
5. Test all features

### Phase 2: Compatibility Testing

**Test with Production Data:**

1. Open production list in old app (https://shoppingplanner.web.app/list/YOUR_LIST_ID)
2. Note the list ID from URL
3. Open same list in staging app (https://shoppingplanner-beta.web.app/list/YOUR_LIST_ID)
4. Verify all data displays correctly
5. Add item in staging app
6. Refresh old app → verify item appears
7. Add item in old app
8. Refresh staging app → verify item appears

**Test URL Compatibility:**

```bash
# These URLs should work identically in both apps:
https://shoppingplanner.web.app/list/abc123
https://shoppingplanner-beta.web.app/list/abc123

https://shoppingplanner.web.app/list/abc123/planner
https://shoppingplanner-beta.web.app/list/abc123/planner

https://shoppingplanner.web.app/list/abc123/catalogue
https://shoppingplanner-beta.web.app/list/abc123/catalogue

https://shoppingplanner.web.app/settings
https://shoppingplanner-beta.web.app/settings
```

### Phase 3: User Acceptance Testing

1. Share staging URL with test users
2. Gather feedback
3. Fix any issues
4. Redeploy to staging
5. Repeat until stable

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All features tested on staging
- [ ] Compatibility with production data verified
- [ ] No console errors or warnings
- [ ] Lighthouse scores meet targets (Performance > 90, Accessibility > 90)
- [ ] PWA installs successfully
- [ ] Offline behavior tested
- [ ] Cross-browser testing complete (Chrome, Safari, Firefox)
- [ ] Mobile device testing complete (iOS, Android)
- [ ] All URL routes work with deep links
- [ ] TypeScript compilation succeeds with no errors
- [ ] Bundle size is acceptable (compare to old app)

### Deployment Steps

1. **Final staging test:**
   ```bash
   yarn build
   yarn deploy:staging
   ```
   Verify everything works one last time

2. **Deploy to production:**
   ```bash
   yarn build
   yarn deploy:prod
   ```

3. **Verify production deployment:**
   - Open https://shoppingplanner.web.app
   - Test critical paths:
     - Home → redirects correctly
     - Add item to list
     - Toggle item done
     - Add to planner
     - Switch themes
   - Check console for errors
   - Test on mobile device

4. **Monitor:**
   - Firebase Console → Hosting → Usage graphs
   - Firebase Console → Firestore → Monitor for errors
   - User feedback channels

### Rollback Plan

If issues are discovered:

**Option 1: Quick fix**
1. Fix the bug
2. Rebuild: `yarn build`
3. Redeploy: `yarn deploy:prod`

**Option 2: Rollback to old app**
1. Checkout old codebase from git history:
   ```bash
   git checkout <commit-before-rewrite>
   ```
2. Build old app: `yarn build`
3. Deploy: `firebase deploy --only hosting:shoppingplanner`

**Option 3: Use Firebase Console**
1. Go to Firebase Console → Hosting
2. Select `shoppingplanner` site
3. Click "Release history"
4. Find previous deployment
5. Click "Rollback"

---

## Post-Deployment

### Monitoring

**Firebase Hosting Metrics:**
- Page views
- Bandwidth usage
- Geographic distribution

**Firebase Firestore Metrics:**
- Document reads/writes
- Storage usage
- Error rates

**Web Vitals (via Lighthouse CI or RUM):**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Cleanup

After stable production period (e.g., 1 week):

1. **Archive old codebase:**
   ```bash
   git tag old-app-archive
   git push origin old-app-archive
   ```

2. **Update README** to reference new architecture

3. **Optional: Remove staging site** (or keep for future development)

---

## Environment-Specific Configuration

### Environment Variables

Both staging and production use the same Firebase project, so the environment variables are identical:

```bash
# .env.local (same for both environments)
VITE_FIREBASE_API_KEY=AIzaSyCtgligqZSkUwWkWIAcMOW0nIW2mfgVdcw
VITE_FIREBASE_AUTH_DOMAIN=shopping-list-app-de905.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shopping-list-app-de905
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=975596815491
VITE_FIREBASE_APP_ID=<your-app-id>
```

**Note:** These values are **not sensitive** for client-side Firebase apps (they're included in the published bundle). Firebase security rules control access.

### Manifest URLs

The `manifest.json` `start_url` should be relative, not absolute:

```json
{
  "start_url": "/"
}
```

This ensures it works correctly on both staging and production URLs.

---

## Firebase Security Rules

Since both apps share the same Firestore database, security rules are critical:

**Current Rules (from old app):**
```javascript
// Firestore Security Rules
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read/write any list
    match /lists/{listId}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Security Model:**
- No authentication required
- Anyone with list ID can read/write
- "Security through obscurity" (list IDs are random UUIDs)
- This is intentional for easy sharing

**Recommendations:**
- Keep current open rules (matches old app behavior)
- List IDs are effectively private URLs
- No need for authentication for this use case

---

## Troubleshooting

### Issue: Staging site not found

**Solution:**
```bash
# Verify targets are set correctly
firebase target:clear hosting shoppingplanner-beta
firebase target:apply hosting shoppingplanner-beta shoppingplanner-beta

# Try deploying again
yarn deploy:staging
```

### Issue: Old deployment still showing

**Solution:**
```bash
# Clear browser cache
# Or use incognito/private window
# Or append ?v=2 to URL: https://shoppingplanner-beta.web.app/?v=2
```

### Issue: Firebase config not found

**Solution:**
```bash
# Ensure .env.local exists with Firebase config
# Verify VITE_ prefix on all variables
# Restart dev server after changing .env.local
```

### Issue: Routes not working (404 on refresh)

**Solution:**
```bash
# Verify firebase.json has rewrites configured:
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

### Issue: PWA not updating

**Solution:**
```bash
# Force service worker update
# In browser DevTools:
# Application → Service Workers → Unregister
# Then reload page
```

---

## Cost Considerations

Firebase hosting is generally free for small apps:

**Hosting Free Tier:**
- Storage: 10 GB
- Transfer: 360 MB/day (~10 GB/month)
- Custom domains: Free

**Firestore Free Tier:**
- Stored data: 1 GB
- Document reads: 50,000/day
- Document writes: 20,000/day
- Document deletes: 20,000/day

**Expected Usage:**
- Hosting: Minimal (simple SPA, small bundle)
- Firestore: Low (few users, small documents)
- Should stay within free tier

**Monitor usage:**
- Firebase Console → Usage and billing

---

## References

- Firebase Hosting docs: https://firebase.google.com/docs/hosting
- Firebase hosting multiple sites: https://firebase.google.com/docs/hosting/multisites
- Firebase CLI reference: https://firebase.google.com/docs/cli
- Vite build docs: https://vitejs.dev/guide/build.html
