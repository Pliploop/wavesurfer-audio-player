#!/bin/bash

# 🚀 WaveSurfer Audio Player Deployment Script
# This script automates the deployment process for GitHub Pages

echo "🚀 Starting deployment process..."

# Check if we have uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ You have uncommitted changes. Please commit or stash them first."
    echo "   Current status:"
    git status --short
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Step 1: Push to main branch
echo "📤 Step 1: Pushing to main branch..."
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo "   Switching to main branch..."
    git checkout main
fi

echo "   Pushing to main..."
git push origin main

if [[ $? -ne 0 ]]; then
    echo "❌ Failed to push to main. Aborting deployment."
    exit 1
fi
echo "✅ Successfully pushed to main"

# Step 2: Switch to gh-pages branch
echo "🔄 Step 2: Switching to gh-pages branch..."
git checkout gh-pages

if [[ $? -ne 0 ]]; then
    echo "❌ Failed to switch to gh-pages branch. Creating it..."
    git checkout -b gh-pages
fi

# Step 3: Pull from main
echo "📥 Step 3: Pulling latest changes from main..."
git pull origin main

if [[ $? -ne 0 ]]; then
    echo "❌ Failed to pull from main. Aborting deployment."
    exit 1
fi
echo "✅ Successfully pulled from main"

# Step 4: Push to gh-pages (triggers deployment)
echo "🚀 Step 4: Pushing to gh-pages (triggers GitHub Actions deployment)..."
git push origin gh-pages

if [[ $? -ne 0 ]]; then
    echo "❌ Failed to push to gh-pages. Aborting deployment."
    exit 1
fi
echo "✅ Successfully pushed to gh-pages"

# Step 5: Return to main branch
echo "🏠 Step 5: Returning to main branch..."
git checkout main

echo ""
echo "🎉 Deployment process completed successfully!"
echo "📱 Your app will be deployed to GitHub Pages shortly."
echo "🔍 Check the Actions tab in your repository for deployment status."
echo ""
echo "🌐 Live URL: https://juj.github.io/wavesurfer-audio-player/"
