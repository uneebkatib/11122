
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PremiumFeatures } from "@/components/email/PremiumFeatures";
import { useEmailQueries } from "@/hooks/useEmailQueries";
import { useEmailOperations } from "@/hooks/useEmailOperations";
import { EmailContextType } from "@/types/emailContext";
import { MAX_EMAILS } from "@/constants/emailLimits";

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export { MAX_EMAILS } from "@/constants/emailLimits";

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem('currentEmail');
    return savedEmail || "";
  });
  
  const [previousEmails, setPreviousEmails] = useState<string[]>(() => {
    const savedEmails = localStorage.getItem('previousEmails');
    return savedEmails ? JSON.parse(savedEmails) : [];
  });

  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  // Get email queries
  const { 
    adminDomains, 
    isLoadingAdminDomains, 
    emails, 
    isLoadingEmails, 
    refetchEmails 
  } = useEmailQueries(email);

  // Get email operations
  const { generateRandomEmail, copyEmail } = useEmailOperations(
    adminDomains,
    email,
    setEmail,
    previousEmails,
    setPreviousEmails,
    setShowPremiumDialog
  );

  // Save current email to localStorage
  useEffect(() => {
    if (email) {
      localStorage.setItem('currentEmail', email);
    }
  }, [email]);

  // Save previous emails to localStorage
  useEffect(() => {
    localStorage.setItem('previousEmails', JSON.stringify(previousEmails));
  }, [previousEmails]);

  // Generate email immediately when domains are available
  useEffect(() => {
    if (!email && adminDomains.length > 0 && previousEmails.length < MAX_EMAILS) {
      console.log('Generating initial email with domains:', adminDomains);
      generateRandomEmail();
    } else if (!email && !isLoadingAdminDomains && adminDomains.length === 0) {
      console.warn('No domains available for initial email generation');
    }
  }, [adminDomains, email, isLoadingAdminDomains]);

  // Setup realtime subscription
  useEffect(() => {
    if (!email) return;

    console.log('Setting up realtime subscription for:', email);
    const channel = supabase
      .channel('emails-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emails',
          filter: `temp_email=eq.${email}`,
        },
        (payload) => {
          console.log('New email received:', payload);
          refetchEmails();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [email, refetchEmails]);

  return (
    <EmailContext.Provider 
      value={{ 
        email, 
        setEmail, 
        generateRandomEmail, 
        copyEmail,
        adminDomains,
        isLoadingAdminDomains,
        emails,
        isLoadingEmails,
        refetchEmails,
        previousEmails,
        setPreviousEmails
      }}
    >
      {children}
      <PremiumFeatures open={showPremiumDialog} onOpenChange={setShowPremiumDialog} />
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};
