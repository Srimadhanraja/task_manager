import { useState } from "react";
import { Mail, Settings, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMAIL_CONFIG } from '@/config/emailConfig';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EmailSettingsProps {
  email: string | null;
  onEmailChange: (email: string) => void;
}

const EmailSettings = ({ email, onEmailChange }: EmailSettingsProps) => {
  const [tempEmail, setTempEmail] = useState(email || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (tempEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail)) {
      onEmailChange(tempEmail);
      setIsOpen(false);
      toast({
        title: "Email saved",
        description: "You'll receive reminders at this email address.",
      });
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const handleTestEmail = async () => {
    if (!tempEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      console.log('Sending test email to:', tempEmail);

      const formData = new FormData();
      formData.append('access_key', EMAIL_CONFIG.WEB3FORMS_ACCESS_KEY);
      formData.append('subject', 'Test Email from Velvet Tasks');
      formData.append('from_name', EMAIL_CONFIG.FROM_NAME);
      formData.append('email', tempEmail);
      formData.append('message', `
Hello!

This is a test email from Velvet Tasks.

Task: This is a test task
Deadline: ${new Date().toLocaleString()}

If you received this email, your email reminders are working correctly!

Best regards,
Velvet Tasks
      `);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      console.log('Email response:', data);

      if (data.success) {
        toast({
          title: "Test email sent! ✅",
          description: `Check your inbox at ${tempEmail}`,
        });
      } else {
        toast({
          title: "Failed to send email ❌",
          description: data.message || 'Unknown error',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Detailed email error:', error);
      const errorMessage = error?.message || 'Unknown error';
      toast({
        title: "Failed to send email ❌",
        description: `${errorMessage}. Check browser console for details.`,
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Mail className="w-4 h-4" />
          {email ? "Change Email" : "Set Email"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Email Settings
          </DialogTitle>
          <DialogDescription>
            Enter your email to receive task reminders when deadlines approach.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
            />
          </div>
          {email && (
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-medium">{email}</span>
            </p>
          )}
          <Button 
            variant="secondary" 
            className="w-full gap-2"
            onClick={handleTestEmail}
            disabled={isSendingTest}
          >
            <Send className="w-4 h-4" />
            {isSendingTest ? "Sending..." : "Send Test Email"}
          </Button>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Email</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSettings;
