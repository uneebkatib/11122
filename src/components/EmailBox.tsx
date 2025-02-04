
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Mail, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CustomEmailDialog } from "./email/CustomEmailDialog";
import { EmailDisplay } from "./email/EmailDisplay";
import { EmailBoxProps, Email } from "@/types/email";

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  // Query admin domains for temporary email addresses
  const { data: adminDomains, isLoading: isLoadingAdminDomains } = useQuery({
    queryKey: ['adminDomains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query custom domains for premium users
  const { data: customDomains, isLoading: isLoadingCustomDomains } = useQuery({
    queryKey: ['customDomains'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('custom_domains')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_verified', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: emails, isLoading: isLoadingEmails, refetch: refetchEmails } = useQuery({
    queryKey: ['emails', email],
    queryFn: async () => {
      if (!email) return [];
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('temp_email', email)
        .order('received_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data as Email[];
    },
    enabled: !!email,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (adminDomains?.length && !email) {
      generateRandomEmail();
    }
  }, [adminDomains, email]);

  const generateRandomEmail = () => {
    if (!adminDomains?.length) {
      toast({
        title: "Error",
        description: "No domains available. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    const random = Math.random().toString(36).substring(2, 10); // Generate longer random string
    const randomDomain = adminDomains[Math.floor(Math.random() * adminDomains.length)];
    const newEmail = `${random}@${randomDomain.domain}`;
    setEmail(newEmail);
    
    toast({
      title: "New Email Created",
      description: newEmail,
    });
  };

  const createCustomEmail = (username: string, domain: string) => {
    if (!username || !domain) {
      toast({
        title: "Error",
        description: "Please enter a username and select a domain",
        variant: "destructive",
      });
      return;
    }

    const newEmail = `${username}@${domain}`;
    setEmail(newEmail);
    
    toast({
      title: "New Email Created",
      description: newEmail,
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard",
    });
  };

  useEffect(() => {
    if (!email) return;

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
          refetchEmails();
          toast({
            title: "New Email Received!",
            description: `From: ${payload.new.from_email}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [email, refetchEmails]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-12">
        <h1 className="text-5xl font-bold text-center text-gray-800 mt-12">
          Your Temporary Email Address
        </h1>

        <div className="relative w-full max-w-2xl mx-auto">
          <div className="bg-white rounded-full shadow-lg flex items-center justify-between p-2 px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => refetchEmails()}
              disabled={isLoadingEmails}
            >
              <RefreshCw className="h-5 w-5 text-gray-500" />
            </Button>
            
            <div className="flex-1 mx-4 text-center font-mono text-lg text-gray-700">
              {email || "Click + to generate an email"}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={generateRandomEmail}
                disabled={isLoadingAdminDomains}
              >
                <Plus className="h-5 w-5 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full" 
                onClick={copyEmail}
                disabled={!email}
              >
                <Copy className="h-5 w-5 text-gray-500" />
              </Button>
              <CustomEmailDialog 
                domains={customDomains || []} 
                onCreateEmail={createCustomEmail}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Inbox</h2>
          </div>
          
          {isLoadingEmails ? (
            <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Checking for new emails...</p>
            </div>
          ) : !email ? (
            <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
              <Mail className="h-12 w-12 mb-4 opacity-20" />
              <p>Generating email address...</p>
            </div>
          ) : emails?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
              <Mail className="h-12 w-12 mb-4 opacity-20" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {emails?.map((mail) => (
                <EmailDisplay key={mail.id} email={mail} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
