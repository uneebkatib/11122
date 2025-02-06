
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Mail, Plus, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CustomEmailDialog } from "./email/CustomEmailDialog";
import { EmailDisplay } from "./email/EmailDisplay";
import { EmailBoxProps, Email } from "@/types/email";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginDialog } from "./auth/LoginDialog";

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { toast } = useToast();

  // Query admin domains for temporary email addresses
  const { data: adminDomains, isLoading: isLoadingAdminDomains } = useQuery({
    queryKey: ['adminDomains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching domains:', error);
        throw error;
      }
      return data || [];
    },
    retry: 3,
  });

  // Query emails with auto-refresh
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
        throw error;
      }
      return data as Email[];
    },
    enabled: !!email,
    refetchInterval: 5000,
  });

  const generateRandomEmail = () => {
    if (!adminDomains?.length) {
      toast({
        title: "Error",
        description: "No domains available. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    const random = Math.random().toString(36).substring(2, 10);
    const randomDomain = adminDomains[Math.floor(Math.random() * adminDomains.length)];
    const newEmail = `${random}@${randomDomain.domain}`;
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

  // Generate email on component mount
  useEffect(() => {
    if (!email && adminDomains?.length) {
      generateRandomEmail();
    }
  }, [adminDomains]);

  // Setup realtime subscription
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
          console.log('New email received:', payload);
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
              onClick={generateRandomEmail}
              disabled={isLoadingAdminDomains}
            >
              <Plus className="h-5 w-5 text-gray-500" />
            </Button>
            
            <div className="flex-1 mx-4 text-center font-mono text-lg text-gray-700">
              {email || "Generating email..."}
            </div>

            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full" 
              onClick={copyEmail}
              disabled={!email}
            >
              <Copy className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Inbox</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchEmails()}
              disabled={isLoadingEmails}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
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

          <div className="p-4 border-t">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowPremiumDialog(true)}
            >
              <Crown className="h-4 w-4 mr-2" />
              Create Custom Email (Premium)
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Features Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Unlock powerful features to enhance your email experience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Premium Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <p>Create custom email addresses</p>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <p>Use your own domain</p>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <p>Extended email storage</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setShowPremiumDialog(false);
                    setShowLoginDialog(true);
                  }}
                >
                  Upgrade Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
      />
    </div>
  );
};
