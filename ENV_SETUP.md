# Environment Variables Setup

Your Web3Forms access key and other sensitive configuration are now stored in the `.env` file, which is not tracked by Git for security.

## Quick Setup

1. **The `.env` file is already created** with your current access key
2. **For new developers:**
   - Copy `.env.example` to `.env`
   - Get a free access key from [web3forms.com](https://web3forms.com)
   - Update `VITE_WEB3FORMS_ACCESS_KEY` in `.env`

## Environment Variables

- `VITE_WEB3FORMS_ACCESS_KEY` - Your Web3Forms access key (required)
- `VITE_FROM_NAME` - The sender name shown in emails (default: "Velvet Tasks")

## Important Notes

- ✅ `.env` is in `.gitignore` - your keys stay private
- ✅ `.env.example` is tracked - shows what variables are needed
- ⚠️ Never commit `.env` to GitHub
- 🔄 Restart dev server after changing `.env` values

## Deployment (Netlify/Vercel)

When deploying, add these environment variables in your hosting platform's dashboard:
1. Go to your project settings
2. Add `VITE_WEB3FORMS_ACCESS_KEY` with your access key
3. Add `VITE_FROM_NAME` with your preferred sender name
4. Redeploy the app
