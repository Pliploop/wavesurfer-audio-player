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

## 🔄 How It Works

1. **Local Development**: Uses `.env` file
2. **GitHub Actions Build**: Uses GitHub Secrets as environment variables
3. **Production**: Built with real credentials embedded in the bundle
4. **Deployment**: Single job builds and deploys to GitHub Pages automatically

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

### Local Development Issues
- Create `.env` file in project root
- Restart development server after adding `.env`
- Check that `.env` is in `.gitignore`

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
