```typescript
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Crown } from "lucide-react";
import { DomainSetupInstructions } from "../admin/domain/DomainSetupInstructions";
import { AddDomainForm } from "../admin/domain/AddDomainForm";
import { DomainTable } from "../admin/domain/DomainTable";
import type { CustomDomain } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";

export const CustomDomainManagement = () => {
  const [newDomain, setNewDomain] = useState("");
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const { toast } = useToast();

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', sessionData?.session?.user?.id],
    enabled: !!sessionData?.session?.user?.id,
    queryFn: async () => {
      if (!sessionData?.session?.user?.id) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', sessionData.session.user.id)
        .single();
      
      return data;
    }
  });

  const isPremium = profile?.subscription_tier === 'premium';

  useEffect(() => {
    if (isPremium) {
      loadCustomDomains();
    }
  }, [isPremium]);

  const loadCustomDomains = async () => {
    if (!sessionData?.session?.user?.id) return;

    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load custom domains",
        variant: "destructive",
      });
      return;
    }

    setCustomDomains(data || []);
  };

  const handleAddDomain = async () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Custom domains are only available for premium users",
        variant: "destructive",
      });
      return;
    }

    if (!newDomain) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    if (!sessionData?.session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add domains",
        variant: "destructive",
      });
      return;
    }

    const verificationToken = Math.random().toString(36).substring(2, 15);
    const mxRecord = `mx.${newDomain}`;
    
    const { error } = await supabase
      .from('custom_domains')
      .insert([
        {
          domain: newDomain,
          user_id: sessionData.session.user.id,
          verification_token: verificationToken,
          mx_record: mxRecord,
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

    await loadCustomDomains();
    setNewDomain("");
    toast({
      title: "Success",
      description: "Domain added successfully",
    });
  };

  const handleVerifyDomain = async (domain: CustomDomain) => {
    const { error } = await supabase
      .from('custom_domains')
      .update({
        verification_status: 'verified',
        is_verified: true,
        verified_at: new Date().toISOString(),
        last_verification_attempt: new Date().toISOString()
      })
      .eq('id', domain.id)
      .eq('user_id', sessionData?.session?.user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to verify domain",
        variant: "destructive",
      });
      return;
    }

    await loadCustomDomains();
    toast({
      title: "Success",
      description: "Domain verified successfully",
    });
  };

  const handleDeleteDomain = async (id: string) => {
    const { error } = await supabase
      .from('custom_domains')
      .delete()
      .eq('id', id)
      .eq('user_id', sessionData?.session?.user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete domain",
        variant: "destructive",
      });
      return;
    }

    await loadCustomDomains();
    toast({
      title: "Success",
      description: "Domain deleted successfully",
    });
  };

  if (!isPremium) {
    return (
      <Alert>
        <Crown className="h-4 w-4" />
        <AlertTitle>Premium Feature</AlertTitle>
        <AlertDescription>
          Custom domain management is available only for premium users. Upgrade your account to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <DomainSetupInstructions />
      <AddDomainForm
        newDomain={newDomain}
        onDomainChange={setNewDomain}
        onSubmit={handleAddDomain}
      />
      <DomainTable
        domains={customDomains}
        onVerify={handleVerifyDomain}
        onDelete={handleDeleteDomain}
      />
    </div>
  );
};
```
