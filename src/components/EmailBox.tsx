
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Mail, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface EmailBoxProps {
  duration?: number;
}

interface Email {
  id: string;
  from_email: string;
  subject: string;
  body: string;
  received_at: string;
  is_read: boolean;
}

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const [customUsername, setCustomUsername] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const { toast } = useToast();

  const { data: domains, isLoading: isLoadingDomains } = useQuery({
    queryKey: ['domains'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
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

  // Generate random email on component mount
  useEffect(() => {
    if (domains?.length) {
      generateRandomEmail();
    }
  }, [domains]);

  const generateRandomEmail = () => {
    if (!domains?.length) {
      toast({
        title: "Error",
        description: "No domains available. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    const random = Math.random().toString(36).substring(7);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const newEmail = `${random}@${randomDomain.domain}`;
    setEmail(newEmail);
    setSelectedEmail(null);
    
    toast({
      title: "New Email Created",
      description: newEmail,
    });
  };

  const createCustomEmail = () => {
    if (!customUsername || !selectedDomain) {
      toast({
        title: "Error",
        description: "Please enter a username and select a domain",
        variant: "destructive",
      });
      return;
    }

    const newEmail = `${customUsername}@${selectedDomain}`;
    setEmail(newEmail);
    setSelectedEmail(null);
    setCustomUsername("");
    setSelectedDomain("");
    
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

  // Set up realtime subscription for new emails
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
        {/* Title */}
        <h1 className="text-5xl font-bold text-center text-gray-800 mt-12">
          Your Temporary Email Address
        </h1>

        {/* Email Display Section */}
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
              {email || "Generating email..."}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full" 
                onClick={copyEmail}
                disabled={!email}
              >
                <Copy className="h-5 w-5 text-gray-500" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full"
                  >
                    <Plus className="h-5 w-5 text-gray-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Custom Email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter username"
                        value={customUsername}
                        onChange={(e) => setCustomUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Select onValueChange={setSelectedDomain} value={selectedDomain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {domains?.map((domain) => (
                            <SelectItem key={domain.id} value={domain.domain}>
                              @{domain.domain}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" onClick={createCustomEmail}>
                      Create Email
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Inbox Section */}
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
                <div key={mail.id} className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700">
                      {mail.subject || "(no subject)"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      From: {mail.from_email}
                    </p>
                    <time className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(mail.received_at), { addSuffix: true })}
                    </time>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {mail.body}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
