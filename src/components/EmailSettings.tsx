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
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
}

const EmailSettings = ({ emails, onEmailsChange }: EmailSettingsProps) => {
  const [newEmail, setNewEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const { toast } = useToast();

  const handleAddEmail = () => {
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      if (emails.includes(newEmail)) {
        toast({
          title: "Email already added",
          description: "This email is already in the list.",
          variant: "destructive",
        });
        return;
      }
      onEmailsChange([...emails, newEmail]);
      setNewEmail("");
      toast({
        title: "Email added",
        description: "Reminders will be sent to this email.",
      });
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    onEmailsChange(emails.filter(e => e !== emailToRemove));
    toast({
      title: "Email removed",
      description: "This email will no longer receive reminders.",
    });
  };

  const handleTestEmail = async () => {
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      console.log('=== EMAIL TEST DEBUG ===');
      console.log('Recipient email:', newEmail);
      console.log('Access key:', EMAIL_CONFIG.WEB3FORMS_ACCESS_KEY);
      console.log('From name:', EMAIL_CONFIG.FROM_NAME);

      const formData = new FormData();
      formData.append('access_key', EMAIL_CONFIG.WEB3FORMS_ACCESS_KEY);
      formData.append('name', EMAIL_CONFIG.FROM_NAME);
      formData.append('email', newEmail); // Recipient email
      formData.append('subject', 'Test Email from Velvet Tasks');
      formData.append('message', `Hello!

This is a test email from Velvet Tasks.

Task: This is a test task
Deadline: ${new Date().toLocaleString()}

If you received this email, your email reminders are working correctly!

Best regards,
Velvet Tasks`);

      console.log('Sending request to Web3Forms...');
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('✅ SUCCESS! Email sent');
        toast({
          title: "Test email sent! ✅",
          description: `Check your inbox at ${newEmail}. It may take 1-2 minutes to arrive.`,
        });
      } else {
        console.error('❌ FAILED:', data);
        toast({
          title: "Failed to send email ❌",
          description: data.message || 'Invalid access key or API error. Check console.',
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
          {emails.length > 0 ? `Emails (${emails.length})` : "Add Emails"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Email Reminders
          </DialogTitle>
          <DialogDescription>
            Add email addresses to receive task reminders. All emails will be notified when deadlines approach.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Add Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
              />
              <Button onClick={handleAddEmail} size="sm">
                Add
              </Button>
            </div>
          </div>
          
          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Registered Emails ({emails.length})</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-2 rounded border bg-muted/50"
                  >
                    <span className="text-sm font-medium truncate">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                      className="h-6 px-2 text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button 
            variant="secondary" 
            className="w-full gap-2"
            onClick={handleTestEmail}
            disabled={isSendingTest || !newEmail}
          >
            <Send className="w-4 h-4" />
            {isSendingTest ? "Sending..." : "Send Test Email"}
          </Button>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailSettings;
