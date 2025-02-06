
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Email } from "@/types/email";

interface EmailContextType {
  email: string;
  setEmail: (email: string) => void;
  generateRandomEmail: () => void;
  copyEmail: () => void;
  adminDomains: any[];
  isLoadingAdminDomains: boolean;
  emails: Email[] | undefined;
  isLoadingEmails: boolean;
  refetchEmails: () => void;
  previousEmails: string[];
  setPreviousEmails: (emails: string[]) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

const MAX_EMAILS = 3;

export const EmailProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem('currentEmail');
    return savedEmail || "";
  });
  
  const [previousEmails, setPreviousEmails] = useState<string[]>(() => {
    const savedEmails = localStorage.getItem('previousEmails');
    return savedEmails ? JSON.parse(savedEmails) : [];
  });
  
  const { toast } = useToast();

  // Save current email to localStorage whenever it changes
  useEffect(() => {
    if (email) {
      localStorage.setItem('currentEmail', email);
    }
  }, [email]);

  // Save previous emails to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('previousEmails', JSON.stringify(previousEmails));
  }, [previousEmails]);

  // Query active domains (public access enabled via RLS)
  const { data: adminDomains, isLoading: isLoadingAdminDomains } = useQuery({
    queryKey: ['adminDomains'],
    queryFn: async () => {
      console.log('Starting domain fetch...');
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('is_active', true)
        .eq('verification_status', 'verified')
        .eq('is_global', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching domains:', error);
        toast({
          title: "Error",
          description: "Could not fetch domains. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
      
      if (!data || data.length === 0) {
        console.warn('No domains found or domains array is empty:', data);
        return [];
      }

      console.log('Successfully fetched domains:', data);
      return data;
    },
    retry: 3,
    initialData: [], 
    refetchInterval: 5000,
  });

  // Query emails with auto-refresh and enhanced logging
  const { data: emails, isLoading: isLoadingEmails, refetch: refetchEmails } = useQuery({
    queryKey: ['emails', email],
    queryFn: async () => {
      if (!email) return [];
      
      console.log('Fetching emails for:', email);
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('temp_email', email)
        .order('received_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching emails:', error);
        toast({
          title: "Error",
          description: "Could not fetch emails. Please try again later.",
          variant: "destructive",
        });
        return [];
      }

      console.log('Emails fetched successfully:', data);
      return data as Email[];
    },
    enabled: !!email,
    refetchInterval: 5000,
  });

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
    
    const random = Math.random().toString(36).substring(2, 10);
    const randomDomain = adminDomains[Math.floor(Math.random() * adminDomains.length)];
    console.log('Selected domain for new email:', randomDomain);
    const newEmail = `${random}@${randomDomain.domain}`;
    
    // Add current email to previous emails if it exists
    if (email && !previousEmails.includes(email)) {
      setPreviousEmails(prev => [email, ...prev].slice(0, MAX_EMAILS));
    }
    
    setEmail(newEmail);
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

  // Generate email immediately when domains are available
  useEffect(() => {
    if (!email && adminDomains && adminDomains.length > 0 && previousEmails.length < MAX_EMAILS) {
      console.log('Generating initial email with domains:', adminDomains);
      generateRandomEmail();
    } else if (!email && !isLoadingAdminDomains && (!adminDomains || adminDomains.length === 0)) {
      console.warn('No domains available for initial email generation');
    }
  }, [adminDomains, email, isLoadingAdminDomains]);

  // Setup realtime subscription with enhanced logging
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
          toast({
            title: "New Email Received!",
            description: `From: ${payload.new.from_email}`,
          });
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
        adminDomains: adminDomains || [],
        isLoadingAdminDomains,
        emails,
        isLoadingEmails,
        refetchEmails,
        previousEmails,
        setPreviousEmails
      }}
    >
      {children}
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
