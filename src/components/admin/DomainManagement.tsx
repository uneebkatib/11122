
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DomainManagement = () => {
  const [domain, setDomain] = useState("");
  const { toast } = useToast();

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('domains')
      .insert([
        {
          domain,
          is_active: true,
          is_global: true,
          verification_status: 'pending'
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Domain added successfully",
    });
    
    setDomain("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddDomain} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter domain (e.g., example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Add Domain</Button>
      </form>
    </div>
  );
};
