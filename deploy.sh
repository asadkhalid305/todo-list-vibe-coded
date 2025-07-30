#!/bin/bash

# Simple deployment script for GitHub Pages
# This script builds the app and deploys it to gh-pages branch

echo "🚀 Starting deployment to GitHub Pages..."

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Deploy to GitHub Pages
    echo "🌐 Deploying to GitHub Pages..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment completed successfully!"
        echo "🔗 Your app will be available at: https://asadkhalid305.github.io/todo-list-vibe-coded/"
        echo "⏳ Note: It may take a few minutes for changes to appear"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
