
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, X, RefreshCw } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CustomDomain {
  id: string;
  domain: string;
  verification_token: string;
  is_verified: boolean;
  verified_at: string | null;
  mx_record: string | null;
  verification_status: 'pending' | 'verified' | 'failed';
  last_verification_attempt: string | null;
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
    const mxRecord = `mx.${newDomain}`;
    
    const { error } = await supabase
      .from('custom_domains')
      .insert([
        {
          domain: newDomain,
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
      <Card>
        <CardHeader>
          <CardTitle>Domain Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to configure your custom domain for email receiving:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>1. Add your domain</AlertTitle>
            <AlertDescription>
              Enter your domain name below (e.g., example.com)
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertTitle>2. Configure DNS Records</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Add these records to your domain's DNS settings:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>MX Record: Priority 10, pointing to our mail server</li>
                <li>TXT Record: For domain verification</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTitle>3. Verify Domain</AlertTitle>
            <AlertDescription>
              After adding DNS records, click the verify button. This process may take up to 24 hours due to DNS propagation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input
          placeholder="Enter domain (e.g., example.com)"
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
            <TableHead>Status</TableHead>
            <TableHead>DNS Records</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customDomains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell>{domain.domain}</TableCell>
              <TableCell>
                {domain.verification_status === 'verified' ? (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                ) : domain.verification_status === 'failed' ? (
                  <span className="text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    Failed
                  </span>
                ) : (
                  <span className="text-yellow-600 flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Pending
                  </span>
                )}
              </TableCell>
              <TableCell className="space-y-2">
                <div>
                  <p className="text-sm font-medium">MX Record:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {domain.mx_record}
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium">TXT Record:</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {domain.verification_token}
                  </code>
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                {domain.verification_status !== 'verified' && (
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
