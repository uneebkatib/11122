
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Clock, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface EmailBoxProps {
  duration?: number;
}

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [loading, setLoading] = useState(false);
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

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
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
    setTimeLeft(duration);
    
    toast({
      title: "Email Generated",
      description: "Your temporary email has been created",
    });
  };

  useEffect(() => {
    if (!isLoadingDomains) {
      generateEmail();
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isLoadingDomains, domains]);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copied to clipboard",
      description: "You can now paste it anywhere",
      duration: 2000,
    });
  };

  const refreshInbox = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Inbox refreshed",
        description: "Your inbox is up to date",
        duration: 2000,
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isPremium = profile?.subscription_tier === 'premium';

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Your Temporary Email
                {isPremium && <Star className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <CardDescription>
                This email will expire in {formatTime(timeLeft)}. Messages will be permanently deleted.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={email}
                readOnly
                className="font-mono bg-background"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyEmail}
                title="Copy email"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={generateEmail}
                title="Generate new email"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={refreshInbox}
                disabled={loading}
                className={loading ? "animate-spin" : ""}
                title="Refresh inbox"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Time remaining: {formatTime(timeLeft)}</span>
              </div>
              <span className="text-muted-foreground">Auto-delete when expired</span>
            </div>

            <Tabs defaultValue="inbox" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="inbox">
                <div className="mt-6 border-2 border-dashed rounded-lg p-8">
                  <div className="text-center text-muted-foreground">
                    <p className="mb-2">Your inbox is empty</p>
                    <p className="text-sm">Waiting for new messages...</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium">Available Domains</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {domains?.map((domain) => (
                        <div key={domain.id} className="px-3 py-2 bg-muted rounded text-sm">
                          @{domain.domain}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

