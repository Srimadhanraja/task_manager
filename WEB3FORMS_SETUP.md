# Web3Forms Email Setup - SIMPLE! 🚀

Your app now uses **Web3Forms** instead of EmailJS - it's much simpler!

## Quick Setup (2 minutes)

### Step 1: Get Your Free Access Key

1. Go to **[https://web3forms.com](https://web3forms.com)**
2. Scroll down and enter your email in the form
3. Click "Get Access Key"
4. Check your email - you'll receive your access key instantly

### Step 2: Add Key to Your App

1. Open `src/config/emailConfig.ts`
2. Replace `'YOUR_ACCESS_KEY_HERE'` with your actual access key:

```typescript
export const EMAIL_CONFIG = {
  WEB3FORMS_ACCESS_KEY: 'abc123-your-actual-key-here',
  FROM_NAME: 'Velvet Tasks',
};
```

### Step 3: Test It!

1. Run your app: `npm run dev`
2. Click the Settings icon (⚙️)
3. Enter your email address
4. Click "Send Test Email"
5. Check your inbox! 📧

## That's It! ✅

No templates to configure, no service connections, no complex setup.

## Features

- ✅ **Free tier**: 250 submissions per month
- ✅ **No account required**: Just get an access key
- ✅ **Instant delivery**: Emails arrive within seconds
- ✅ **No spam folder issues**: Better deliverability than EmailJS
- ✅ **Simple API**: Just one endpoint, no SDKs needed

## How It Works

When a task deadline approaches (within 1 hour):
1. A browser notification appears
2. An email is automatically sent to your configured address
3. The email includes task details and deadline

## Troubleshooting

**Not receiving emails?**
- Check spam/junk folder
- Verify you copied the access key correctly (no extra spaces)
- Make sure you entered a valid email address in settings
- Check browser console (F12) for error messages

**Want to customize?**
- Edit the email message in `src/services/reminderService.ts`
- Change the subject line in the same file
- Modify the FROM_NAME in `emailConfig.ts`

## Upgrade to Pro (Optional)

Need more than 250 emails/month? Upgrade at [web3forms.com/pricing](https://web3forms.com/pricing) for:
- Unlimited submissions
- Custom branding
- File attachments
- Priority support

---

**That's all! Much simpler than EmailJS, right?** 😎
