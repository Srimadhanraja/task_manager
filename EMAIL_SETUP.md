# Email Setup Guide for Velvet Tasks

Your app is now configured to send **real email reminders**! Follow these steps to set up EmailJS:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the instructions to connect your email
5. **Copy your Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Use this template content:

```
Subject: Task Reminder from Velvet Tasks

Hello!

This is a reminder about your task:

Task: {{task_text}}
Deadline: {{deadline}}

Don't forget to complete it on time!

Best regards,
{{from_name}}
```

4. **Copy your Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `aBcDeFgHiJkLmNoPqR`)
3. Copy it

## Step 5: Update Configuration

Open `src/config/emailConfig.ts` and replace the placeholders:

```typescript
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_abc123',      // Your Service ID
  TEMPLATE_ID: 'template_xyz789',    // Your Template ID
  PUBLIC_KEY: 'aBcDeFgHiJkLmNoPqR',  // Your Public Key
};
```

## Step 6: Test It!

1. Enter your email in the app settings
2. Create a task with a deadline in the next hour
3. Wait for the reminder (or adjust the threshold in `reminderService.ts`)
4. Check your email inbox!

## Troubleshooting

- **No email received?** Check EmailJS dashboard for error logs
- **"Failed to send email"?** Verify your Service ID, Template ID, and Public Key
- **Gmail blocking?** Enable "Less secure app access" or use App Password
- **Free tier limit?** EmailJS free plan allows 100 emails/month

## Template Variables

Your template should include these variables:
- `{{to_email}}` - Recipient's email (automatically filled)
- `{{task_text}}` - The task description
- `{{deadline}}` - When the task is due
- `{{from_name}}` - Sender name (Velvet Tasks)

---

**Need Help?** Visit [EmailJS Documentation](https://www.emailjs.com/docs/)
