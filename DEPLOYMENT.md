# 🚀 Deployment Guide

## GitHub Pages Deployment with Spotify API

This guide explains how to deploy the app to GitHub Pages with Spotify API integration.

## 🔐 Setting Up GitHub Secrets

### 1. Go to Repository Settings
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### 2. Add Spotify API Secrets
Add these two secrets:

| Secret Name | Value |
|-------------|-------|
| `SPOTIFY_CLIENT_ID` | `f5c5ff5156b549c6a912a8398d6b982e` |
| `SPOTIFY_CLIENT_SECRET` | `f9b8beb1311c49dea12b1f632055cbc6` |

**Important**: The GitHub Actions workflow automatically adds the `REACT_APP_` prefix to these secrets during the build process.

### 3. How to Add a Secret
1. Click **New repository secret**
2. Enter the secret name (e.g., `SPOTIFY_CLIENT_ID`)
3. Enter the secret value
4. Click **Add secret**

## 🔧 Fixing Environment Protection Rules

If you get an error about missing environment or deployment failures:

### 1. Go to Repository Settings
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Environments**

### 2. Configure github-pages Environment
1. Click on **github-pages** environment
2. **Uncheck** "Required reviewers" if enabled
3. **Uncheck** "Wait timer" if enabled
4. **Uncheck** "Deployment branches" restrictions if enabled
5. Click **Save protection rules**

### 3. Alternative: Create New Environment
If the above doesn't work:
1. Click **New environment**
2. Name it `github-pages`
3. Leave all protection rules **unchecked**
4. Click **Configure environment**

## 🔄 How It Works

1. **Local Development**: Uses `.env` file
2. **GitHub Actions Build**: Uses GitHub Secrets as environment variables
3. **Production**: Built with real credentials embedded in the bundle
4. **Deployment**: Single job builds and deploys to GitHub Pages automatically

## 🚀 Automated Deployment

### Option 1: Using the Deployment Script (Recommended)
```bash
# Run the automated deployment script
npm run deploy:auto

# Or run it directly
./deploy.sh
```

### Option 2: Manual Deployment
```bash
# Step 1: Push to main
git push origin main

# Step 2: Switch to gh-pages
git checkout gh-pages

# Step 3: Pull from main
git pull origin main

# Step 4: Push to gh-pages (triggers deployment)
git push origin gh-pages

# Step 5: Return to main
git checkout main
```

## 📝 Environment Variables

The build process automatically includes these environment variables:

```bash
REACT_APP_SPOTIFY_CLIENT_ID=f5c5ff5156b549c6a912a8398d6b982e
REACT_APP_SPOTIFY_CLIENT_SECRET=f9b8beb1311c49dea12b1f632055cbc6
```

## 🚨 Security Notes

- ✅ **GitHub Secrets are encrypted** and never visible in logs
- ✅ **Environment variables are embedded** in the build bundle
- ✅ **Source code remains clean** without hardcoded credentials
- ⚠️ **Build artifacts contain credentials** (this is normal for client-side apps)

## 🔧 Troubleshooting

### Build Fails with "Spotify API not configured"
- Check that both secrets are set in GitHub
- Ensure secret names match exactly: `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- Verify the values are correct

### Deployment Fails with "Missing environment"
- Follow the "Fixing Environment Protection Rules" section above
- Ensure the `github-pages` environment exists and has no protection rules
- Check that the environment name matches exactly in the workflow

### Local Development Issues
- Create `.env` file in project root
- Restart development server after adding `.env`
- Check that `.env` is in `.gitignore`

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
