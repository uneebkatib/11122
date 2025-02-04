
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
        .order('received_at', { ascending: false });
      
      if (error) throw error;
      return data as Email[];
    },
    enabled: !!email,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const generateEmail = () => {
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
      title: "Email Generated",
      description: "Your temporary email has been created",
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Copied!",
      description: "Email address copied to clipboard",
    });
  };

  const checkInbox = () => {
    refetchEmails();
    toast({
      title: "Checking inbox...",
      description: "Refreshing your messages",
    });
  };

  useEffect(() => {
    if (!isLoadingDomains) {
      generateEmail();
    }
  }, [isLoadingDomains]);

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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold mb-4">Your Temporary Email</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg border font-mono text-sm">
              {email}
            </div>
            <Button variant="outline" size="icon" onClick={copyEmail}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={generateEmail}>New Email</Button>
            <Button variant="outline" onClick={checkInbox} disabled={isLoadingEmails}>
              {isLoadingEmails ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Check Inbox
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 divide-x">
          <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
            <h3 className="font-medium text-gray-500 px-2">Inbox</h3>
            {emails?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {emails?.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedEmail(mail)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedEmail?.id === mail.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50 border-transparent"
                    } border`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{mail.subject || "(no subject)"}</p>
                        <p className="text-sm text-gray-500 truncate">{mail.from_email}</p>
                      </div>
                      <time className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(mail.received_at), { addSuffix: true })}
                      </time>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 max-h-[600px] overflow-y-auto">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEmail.subject || "(no subject)"}</h3>
                    <p className="text-sm text-gray-500">From: {selectedEmail.from_email}</p>
                    <time className="text-xs text-gray-400">
                      {new Date(selectedEmail.received_at).toLocaleString()}
                    </time>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEmail(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none">
                  {selectedEmail.body}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select an email to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
