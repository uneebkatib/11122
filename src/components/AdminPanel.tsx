import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

export const AdminPanel = () => {
  const [newDomain, setNewDomain] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();

  // Mock data - replace with actual data management later
  const [domains, setDomains] = useState([
    "tempmail.dev",
    "temp-mail.org"
  ]);

  const [emails, setEmails] = useState([
    { address: "test@tempmail.dev", created: "2024-03-15", expires: "2024-03-15 10:30" },
    { address: "demo@temp-mail.org", created: "2024-03-15", expires: "2024-03-15 11:00" }
  ]);

  const handleAddDomain = () => {
    if (!newDomain) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }
    setDomains([...domains, newDomain]);
    setNewDomain("");
    toast({
      title: "Success",
      description: "Domain added successfully",
    });
  };

  const handleDeleteDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
    toast({
      title: "Success",
      description: "Domain deleted successfully",
    });
  };

  const handleAddEmail = () => {
    if (!newEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    const now = new Date();
    const expires = new Date(now.getTime() + 10 * 60000); // 10 minutes from now
    setEmails([...emails, {
      address: newEmail,
      created: now.toISOString().split('T')[0],
      expires: expires.toLocaleString(),
    }]);
    setNewEmail("");
    toast({
      title: "Success",
      description: "Email added successfully",
    });
  };

  const handleDeleteEmail = (address: string) => {
    setEmails(emails.filter(e => e.address !== address));
    toast({
      title: "Success",
      description: "Email deleted successfully",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="domains" className="space-y-4">
            <TabsList>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="emails">Email Addresses</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="domains" className="space-y-4">
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
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={domain}>
                      <TableCell>{domain}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteDomain(domain)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="emails" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Button onClick={handleAddEmail}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow key={email.address}>
                      <TableCell>{email.address}</TableCell>
                      <TableCell>{email.created}</TableCell>
                      <TableCell>{email.expires}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEmail(email.address)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Email Expiration (minutes)</label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Emails Per IP</label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};