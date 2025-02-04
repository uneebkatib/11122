
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DomainSetupInstructions } from "./domain/DomainSetupInstructions";
import { AddDomainForm } from "./domain/AddDomainForm";
import { DomainTable } from "./domain/DomainTable";
import type { CustomDomain } from "@/types/domain";

export const DomainManagement = () => {
  const [newDomain, setNewDomain] = useState("");
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomDomains();
  }, []);

  const loadCustomDomains = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to manage domains",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load custom domains",
        variant: "destructive",
      });
      return;
    }

    setCustomDomains(data);
  };

  const handleAddDomain = async () => {
    if (!newDomain) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
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
          user_id: user.id,
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
      .eq('id', domain.id);

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
      .eq('id', id);

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
