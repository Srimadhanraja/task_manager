# Using Email Reminders on Netlify 📧

## Important: How Email Reminders Work

Your task app sends email reminders **1 hour before** a task's deadline. Here's what you need to know:

### ✅ What Works on Netlify:
- Task creation and management
- Email settings configuration
- Test email sending
- All UI features

### ⚠️ Important Limitations:

**Email reminders require the browser tab to stay open** because:
1. The reminder service runs in the browser (client-side JavaScript)
2. It checks every minute for upcoming deadlines
3. When it finds a task due within 1 hour, it sends the email

**This means:**
- ❌ Closing the browser tab = no reminders
- ❌ Computer sleep mode = no reminders
- ✅ Browser tab open = reminders work perfectly

### 🔧 How to Use on Netlify:

1. **Open your Netlify app** in a browser tab
2. **Configure your email** (Settings icon)
3. **Add tasks with deadlines**
4. **Keep the tab open** (can be in background)
5. Reminders will be sent automatically!

### 💡 Tips for Best Results:

1. **Pin the tab** in your browser (right-click tab → "Pin Tab")
2. **Bookmark the site** for quick access
3. **Check console logs** (F12) to see reminder status
4. **Test it first** with a deadline 30 minutes away

### 🧪 Testing:

1. Set a task deadline for **30 minutes from now**
2. Keep the browser tab open
3. Wait and watch the console (F12)
4. You'll see logs like:
   ```
   🔍 Checking 1 tasks for reminders...
   ⏰ "Test task" - 0h 25m until deadline
   📨 Sending reminder for "Test task"
   ✅ Email reminder sent successfully
   ```

### 🚀 Want True Background Reminders?

For reminders that work even when the browser is closed, you'd need:
- A backend server (Node.js, Python, etc.)
- Scheduled cron jobs
- Database to store tasks

This current version is perfect for:
- ✅ Daily use with browser open
- ✅ Quick task management
- ✅ Immediate reminders
- ✅ Zero backend costs

### 📊 Console Logs:

Open browser console (F12) to see:
- 🚀 When reminder service starts
- 📧 Your configured email
- 🔍 Periodic checks (every minute)
- ⏰ Time until each deadline
- 📨 When emails are sent
- ✅ Confirmation of sent reminders

### 🐛 Troubleshooting:

**Not receiving emails?**
1. Open browser console (F12)
2. Look for error messages
3. Check if reminder service started: `🚀 Reminder service started`
4. Verify email is configured: `📧 Email configured: your@email.com`
5. Make sure access key is correct in `emailConfig.ts`

**Task disappeared after refresh?**
- Tasks are now saved to localStorage
- They persist across page refreshes
- Clear localStorage to reset

---

**Summary:** Keep the browser tab open, and reminders will work perfectly on Netlify! 🎉
