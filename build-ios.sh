#!/bin/bash
# NovaWriter iOS Build Script
# This exports Replit secrets as environment variables before building

set -e  # Exit on any error

echo "🔧 Checking required environment variables..."

# Check that required secrets are set
if [ -z "$VITE_STRIPE_PUBLIC_KEY" ]; then
  echo "❌ ERROR: VITE_STRIPE_PUBLIC_KEY is not set!"
  echo "   This secret is required for Stripe payments to work in the iOS app."
  echo "   Make sure the secret is configured in Replit."
  exit 1
fi

echo "✅ VITE_STRIPE_PUBLIC_KEY found: ${VITE_STRIPE_PUBLIC_KEY:0:20}..."

echo "🔧 Exporting environment variables for iOS build..."

# CRITICAL: Export these BEFORE npm run build
# Vite will bake these into the JavaScript bundle at build time
export VITE_STRIPE_PUBLIC_KEY="$VITE_STRIPE_PUBLIC_KEY"
export VITE_API_BASE_URL="https://novawriter.org"

echo "✅ Environment variables set:"
echo "   - VITE_STRIPE_PUBLIC_KEY: ${VITE_STRIPE_PUBLIC_KEY:0:20}..."
echo "   - VITE_API_BASE_URL: $VITE_API_BASE_URL"
echo "📦 Building frontend..."

# Build the frontend with environment variables embedded
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Frontend built successfully"
  echo "📱 Syncing with Capacitor..."
  
  # Sync the built files to iOS
  npx cap sync ios
  
  if [ $? -eq 0 ]; then
    echo "✅ iOS app ready!"
    echo ""
    echo "📥 Next steps:"
    echo "1. Right-click the 'ios' folder in Replit"
    echo "2. Select 'Download'"
    echo "3. Open ios/App/App.xcworkspace in Xcode"
    echo "4. Build and run!"
  else
    echo "❌ Capacitor sync failed"
    exit 1
  fi
else
  echo "❌ Build failed"
  exit 1
fi
