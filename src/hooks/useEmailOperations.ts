
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MAX_EMAILS, DAILY_EMAIL_LIMIT, DAILY_LIMIT_KEY, LAST_RESET_DATE_KEY } from "@/constants/emailLimits";

export const useEmailOperations = (
  adminDomains: any[],
  email: string,
  setEmail: (email: string) => void,
  previousEmails: string[],
  setPreviousEmails: (emails: string[]) => void,
  setShowPremiumDialog: (show: boolean) => void
) => {
  const [dailyCount, setDailyCount] = useState(() => {
    const count = localStorage.getItem(DAILY_LIMIT_KEY);
    return count ? parseInt(count) : 0;
  });

  const { toast } = useToast();

  // Save daily count to localStorage
  useEffect(() => {
    localStorage.setItem(DAILY_LIMIT_KEY, dailyCount.toString());
  }, [dailyCount]);

  // Check and reset daily count if needed
  useEffect(() => {
    const lastResetDate = localStorage.getItem(LAST_RESET_DATE_KEY);
    const today = new Date().toDateString();

    if (lastResetDate !== today) {
      setDailyCount(0);
      localStorage.setItem(DAILY_LIMIT_KEY, '0');
      localStorage.setItem(LAST_RESET_DATE_KEY, today);
    }
  }, []);

  const generateRandomEmail = () => {
    if (!adminDomains?.length) {
      console.error('No domains available for email generation');
      toast({
        title: "Error",
        description: "No domains available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (previousEmails.length >= MAX_EMAILS) {
      toast({
        title: "Limit Reached",
        description: `You can only generate up to ${MAX_EMAILS} emails. Please delete an existing email first.`,
        variant: "destructive",
      });
      return;
    }

    if (dailyCount >= DAILY_EMAIL_LIMIT) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached your daily email generation limit. Upgrade to premium for unlimited emails!",
        variant: "destructive",
      });
      setShowPremiumDialog(true);
      return;
    }
    
    const random = Math.random().toString(36).substring(2, 10);
    const randomDomain = adminDomains[Math.floor(Math.random() * adminDomains.length)];
    console.log('Selected domain for new email:', randomDomain);
    const newEmail = `${random}@${randomDomain.domain}`;
    
    // Add current email to previous emails if it exists
    if (email && !previousEmails.includes(email)) {
      setPreviousEmails(prev => [email, ...prev].slice(0, MAX_EMAILS));
    }
    
    setEmail(newEmail);
    setDailyCount(prev => prev + 1);
    console.log('Generated new email:', newEmail);
    
    toast({
      title: "New Email Created",
      description: newEmail,
    });
  };

  const copyEmail = () => {
    if (!email) return;
    
    navigator.clipboard.writeText(email);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard",
    });
  };

  return {
    generateRandomEmail,
    copyEmail,
    dailyCount
  };
};
