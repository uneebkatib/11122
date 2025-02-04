import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DomainSetupInstructions } from "./domain/DomainSetupInstructions";
import { AddDomainForm } from "./domain/AddDomainForm";
import { DomainTable } from "./domain/DomainTable";
import type { CustomDomain } from "@/types/domain";

export const DomainManagement = () => {
  const [newDomain, setNewDomain] = useState("");
  const [globalDomains, setGlobalDomains] = useState<CustomDomain[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadGlobalDomains();
  }, []);

  const loadGlobalDomains = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to manage domains",
        variant: "destructive",
      });
      return;
    }

    // Load global domains that admins can manage
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('is_global', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load global domains",
        variant: "destructive",
      });
      return;
    }

    // Map the domains data to match CustomDomain type
    const mappedDomains: CustomDomain[] = data.map(d => ({
      id: d.id,
      domain: d.domain,
      verification_token: d.verification_token || '',
      verification_status: d.verification_status as 'pending' | 'verified' | 'failed',
      verified_at: d.verified_at,
      mx_record: d.mx_record,
      last_verification_attempt: d.last_verification_attempt,
      is_verified: d.verification_status === 'verified',
      is_active: d.is_active,
      is_global: d.is_global
    }));

    setGlobalDomains(mappedDomains);
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
      .from('domains')
      .insert([
        {
          domain: newDomain,
          verification_token: verificationToken,
          mx_record: mxRecord,
          verification_status: 'pending',
          is_global: true,
          is_active: true
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

    await loadGlobalDomains();
    setNewDomain("");
    toast({
      title: "Success",
      description: "Domain added successfully",
    });
  };

  const handleVerifyDomain = async (domain: CustomDomain) => {
    const { error } = await supabase
      .from('domains')
      .update({
        verification_status: 'verified',
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

    await loadGlobalDomains();
    toast({
      title: "Success",
      description: "Domain verified successfully",
    });
  };

  const handleDeleteDomain = async (id: string) => {
    const { error } = await supabase
      .from('domains')
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

    await loadGlobalDomains();
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
        domains={globalDomains}
        onVerify={handleVerifyDomain}
        onDelete={handleDeleteDomain}
      />
    </div>
  );
};
