# Task Timer and Email Reminder Features

## Overview
This task manager now includes a comprehensive timer and email reminder system that helps you stay on top of your deadlines.

## Features Implemented

### 1. **Task Deadlines**
- Add optional deadlines when creating tasks using a date-time picker
- Deadlines are displayed with a countdown timer on each task
- Visual indicators show:
  - ⏰ Normal status (more than 1 hour remaining)
  - 🟠 Urgent status (less than 1 hour remaining)
  - 🔴 Overdue status (deadline passed)

### 2. **Email Reminders**
- Register your email address through the "Set Email" button
- Automatic email reminders are triggered 1 hour before task deadlines
- Email address is saved in local storage for persistence
- Browser notifications are shown when reminders are triggered

### 3. **Real-time Countdown**
- Tasks display time remaining in a human-readable format:
  - Days and hours for distant deadlines
  - Hours and minutes for approaching deadlines
  - Minutes for imminent deadlines
- Countdown updates automatically every minute

### 4. **Visual Feedback**
- Color-coded deadline indicators
- Smooth animations and transitions
- Clear visual distinction between normal, urgent, and overdue tasks
- Completed tasks hide their deadline information

## How to Use

### Setting Up Email Reminders
1. Click the "Set Email" button in the header
2. Enter your email address in the dialog
3. Click "Save Email"
4. Your email will be stored and used for all future reminders

### Creating a Task with a Deadline
1. Type your task in the input field
2. Optionally, select a date and time in the "Deadline" field below
3. Click "Add" to create the task
4. The task will appear with a countdown timer showing time remaining

### Reminder System
- The system checks for upcoming deadlines every minute
- When a task is within 1 hour of its deadline, a reminder is triggered
- You'll receive:
  - A browser notification (if permitted)
  - A toast notification in the app
  - Console log with reminder details

## Technical Implementation

### Files Modified/Created
1. **`src/components/EmailSettings.tsx`** - Email configuration dialog
2. **`src/components/TaskInput.tsx`** - Updated with deadline picker
3. **`src/components/TaskItem.tsx`** - Updated with countdown display
4. **`src/pages/Index.tsx`** - Integrated all reminder features
5. **`src/services/reminderService.ts`** - Core reminder logic

### How Reminders Work
The `reminderService` runs in the background and:
1. Checks all tasks every minute
2. Identifies tasks approaching their deadlines (within 1 hour)
3. Prevents duplicate reminders using localStorage
4. Triggers notifications and email reminders

### Email Integration (Production Setup)
The current implementation uses console.log and browser notifications. For production email sending, you can integrate:

#### Option 1: EmailJS (Client-side)
```bash
npm install @emailjs/browser
```

Update `reminderService.ts` to use EmailJS:
```typescript
import emailjs from '@emailjs/browser';

emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  {
    to_email: email,
    task_text: task.text,
    deadline: new Date(task.deadline!).toLocaleString(),
  },
  'YOUR_PUBLIC_KEY'
);
```

#### Option 2: Backend API
Create a backend endpoint that sends emails using SendGrid, AWS SES, or similar:
```typescript
fetch('/api/send-reminder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email,
    taskText: task.text,
    deadline: task.deadline
  })
});
```

### Browser Notifications
The app requests notification permission on load. To enable:
1. When prompted by your browser, click "Allow"
2. Notifications will appear when reminders are triggered
3. This works even when the browser tab is in the background

## Testing the Feature

### Quick Test (1 minute reminder)
1. Set your email in the settings
2. Create a task with a deadline 2 minutes from now
3. Wait 1 minute
4. You should receive a browser notification and toast

### Production Considerations
- Currently, reminders only work when the browser tab is open
- For persistent reminders, consider:
  - Service workers for background processing
  - Backend scheduled jobs (cron)
  - Push notification services

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Notification API supported in all major browsers

## Future Enhancements
- [ ] Recurring tasks and reminders
- [ ] Multiple reminder intervals (1 day before, 1 hour before, etc.)
- [ ] SMS reminders
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Custom reminder intervals per task
- [ ] Email templates with customizable content
- [ ] Task categories and priority levels
- [ ] Weekly digest emails

## Support
For issues or questions, please refer to the main README or create an issue in the repository.
