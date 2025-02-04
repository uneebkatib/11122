
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface EmailBoxProps {
  duration?: number;
}

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
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

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2>Current Email: {email}</h2>
      </div>
      <div className="space-y-2">
        <Button onClick={generateEmail}>Generate New Email</Button>
      </div>
    </div>
  );
};
