
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Loader2, Mail, Plus, Trash2 } from "lucide-react";
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
    refetchInterval: 5000,
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Email Management Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 p-3 rounded-lg font-mono text-sm truncate">
            {email}
          </div>
          <Button variant="outline" size="icon" onClick={copyEmail} title="Copy Email">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={generateEmail} title="New Email">
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refetchEmails()}
            disabled={isLoadingEmails}
            title="Refresh Inbox"
          >
            {isLoadingEmails ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Inbox Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid md:grid-cols-2 divide-x">
          {/* Email List */}
          <div className="h-[600px] overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Inbox</h2>
            </div>
            {isLoadingEmails ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Checking for new emails...</p>
              </div>
            ) : emails?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
                <Mail className="h-12 w-12 mb-4 opacity-20" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {emails?.map((mail) => (
                  <button
                    key={mail.id}
                    onClick={() => setSelectedEmail(mail)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedEmail?.id === mail.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{mail.subject || "(no subject)"}</p>
                        <p className="text-sm text-gray-500 truncate">{mail.from_email}</p>
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(mail.received_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Email Content */}
          <div className="h-[600px] overflow-y-auto p-4">
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
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Mail className="h-12 w-12 mb-4 opacity-20" />
                <p>Select an email to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
