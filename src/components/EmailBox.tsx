
import { useState, useEffect } from "react";
import { Copy, RefreshCw, Trash2, LayoutGrid, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface EmailBoxProps {
  duration?: number;
}

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
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
  }, [isLoadingDomains]);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copied to clipboard",
      description: "You can now paste it anywhere",
      duration: 2000,
    });
  };

  const deleteEmail = () => {
    setEmail("");
    toast({
      title: "Email deleted",
      description: "Your temporary email has been deleted",
      duration: 2000,
    });
  };

  const refreshInbox = () => {
    toast({
      title: "Inbox refreshed",
      description: "Your inbox is up to date",
      duration: 2000,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <Card className="bg-[#1C1C1C] border-dashed border-gray-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Your Temporary or Disposable Email Address
          </CardTitle>
          <CardDescription className="text-[#4ADE80] text-lg">
            Emails are for a short period of time. Download your Important Emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Select value={email || undefined} onValueChange={setEmail}>
                <SelectTrigger className="flex-1 bg-[#2D2D2D] border-0 text-white">
                  <SelectValue placeholder="Select an email" />
                </SelectTrigger>
                <SelectContent>
                  {email && <SelectItem value={email}>{email}</SelectItem>}
                </SelectContent>
              </Select>
              <Button
                variant="secondary"
                size="icon"
                className="bg-[#6B7DDF] hover:bg-[#5A6BC7] text-white"
                onClick={copyEmail}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-[#4ADE80] hover:bg-[#3ECB70] text-white"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="secondary"
                className="bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white w-full"
                onClick={refreshInbox}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="secondary"
                className="bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white w-full"
                onClick={generateEmail}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Email
              </Button>
              <Button
                variant="secondary"
                className="bg-[#2D2D2D] hover:bg-[#3D3D3D] text-white w-full"
                onClick={deleteEmail}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

