
import { useState, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface EmailBoxProps {
  duration?: number;
}

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
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
    setMessages([]); // Clear messages when new email is generated
    
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
    // In a real implementation, this would fetch emails from your email server
    toast({
      title: "Checking inbox...",
      description: "Please wait while we fetch your messages",
    });
    // TODO: Implement actual email fetching logic
  };

  useEffect(() => {
    if (!isLoadingDomains) {
      generateEmail();
    }
  }, [isLoadingDomains]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Your Temporary Email</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-gray-50 rounded border">{email}</div>
            <Button variant="outline" size="icon" onClick={copyEmail}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={generateEmail}>New Email</Button>
            <Button variant="outline" onClick={checkInbox}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Inbox
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Inbox</h3>
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{message.subject}</p>
                    <p className="text-sm text-gray-500">{message.from}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
