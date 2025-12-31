import { EMAIL_CONFIG } from '@/config/emailConfig';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  deadline?: Date;
}

interface ReminderConfig {
  email: string;
  tasks: Task[];
}

// This service checks for upcoming deadlines and sends email reminders
export class ReminderService {
  private checkInterval: number | null = null;
  private readonly CHECK_INTERVAL_MS = 60000; // Check every minute
  private readonly REMINDER_THRESHOLD_MS = 3600000; // 1 hour before deadline

  start(config: ReminderConfig, onReminder: (task: Task) => void) {
    // Clear any existing interval
    this.stop();

    console.log('🚀 Reminder service started');
    console.log('📧 Email configured:', config.email);
    console.log('📋 Tasks to monitor:', config.tasks.length);

    // Start checking for reminders
    this.checkInterval = window.setInterval(() => {
      this.checkReminders(config, onReminder);
    }, this.CHECK_INTERVAL_MS);

    // Also check immediately
    this.checkReminders(config, onReminder);
  }

  stop() {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private checkReminders(config: ReminderConfig, onReminder: (task: Task) => void) {
    const now = new Date().getTime();
    const { email, tasks } = config;

    if (!email) {
      console.log('⚠️ No email configured, skipping reminder check');
      return;
    }

    const tasksWithDeadlines = tasks.filter(t => !t.completed && t.deadline);
    console.log(`🔍 Checking ${tasksWithDeadlines.length} tasks for reminders...`);

    tasks.forEach((task) => {
      if (task.completed || !task.deadline) return;

      const deadlineTime = new Date(task.deadline).getTime();
      const timeUntilDeadline = deadlineTime - now;
      const hoursUntil = Math.floor(timeUntilDeadline / 3600000);
      const minutesUntil = Math.floor((timeUntilDeadline % 3600000) / 60000);

      // Log each task's status
      if (timeUntilDeadline > 0) {
        console.log(`⏰ "${task.text}" - ${hoursUntil}h ${minutesUntil}m until deadline`);
      }

      // Check if task is within reminder threshold and hasn't passed
      if (
        timeUntilDeadline > 0 &&
        timeUntilDeadline <= this.REMINDER_THRESHOLD_MS
      ) {
        // Check if we've already sent a reminder for this task
        const reminderKey = `reminder_sent_${task.id}_${deadlineTime}`;
        const alreadySent = localStorage.getItem(reminderKey);

        if (!alreadySent) {
          console.log(`📨 Sending reminder for "${task.text}"`);
          this.sendEmailReminder(email, task);
          localStorage.setItem(reminderKey, "true");
          onReminder(task);
        } else {
          console.log(`✅ Reminder already sent for "${task.text}"`);
        }
      }
    });
  }

  private async sendEmailReminder(email: string, task: Task) {
    console.log(`Sending reminder to ${email} for task: ${task.text}`);
    console.log(`Deadline: ${task.deadline}`);

    // Send browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Task Reminder", {
        body: `Task "${task.text}" is due soon! Deadline: ${new Date(
          task.deadline!
        ).toLocaleString()}`,
        icon: "/favicon.ico",
      });
    }

    // Send actual email using Web3Forms
    try {
      const formData = new FormData();
      formData.append('access_key', EMAIL_CONFIG.WEB3FORMS_ACCESS_KEY);
      formData.append('subject', `Task Reminder: ${task.text}`);
      formData.append('from_name', EMAIL_CONFIG.FROM_NAME);
      formData.append('email', email);
      formData.append('message', `
Hello!

This is a reminder about your task:

Task: ${task.text}
Deadline: ${new Date(task.deadline!).toLocaleString()}

Don't forget to complete it on time!

Best regards,
Velvet Tasks
      `);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Email reminder sent successfully:', data);
      } else {
        console.error('❌ Email failed:', data);
      }
    } catch (error: any) {
      console.error('❌ Failed to send email reminder:', error);
      console.error('Error details:', error?.message);
      // Still show notification even if email fails
    }
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }
}

export const reminderService = new ReminderService();
