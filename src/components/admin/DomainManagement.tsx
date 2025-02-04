
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomDomain {
  id: string;
  domain: string;
  verification_token: string;
  is_verified: boolean;
  verified_at: string | null;
}

export const DomainManagement = () => {
  const [newDomain, setNewDomain] = useState("");
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomDomains();
  }, []);

  const loadCustomDomains = async () => {
    const { data, error } = await supabase
      .from('custom_domains')
      .select('*')
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

    const verificationToken = Math.random().toString(36).substring(2, 15);
    
    const { error } = await supabase
      .from('custom_domains')
      .insert([
        {
          domain: newDomain,
          verification_token: verificationToken,
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
    // In a real implementation, this would check DNS records
    // For demo purposes, we'll just mark it as verified
    const { error } = await supabase
      .from('custom_domains')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter new domain"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
        />
        <Button onClick={handleAddDomain}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Verification Token</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customDomains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>{domain.domain}</TableCell>
              <TableCell>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {domain.verification_token}
                </code>
              </TableCell>
              <TableCell>
                {domain.is_verified ? (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="text-yellow-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    Unverified
                  </span>
                )}
              </TableCell>
              <TableCell className="space-x-2">
                {!domain.is_verified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerifyDomain(domain)}
                  >
                    Verify
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteDomain(domain.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
