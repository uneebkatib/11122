import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export const DomainManagement = () => {
  const [newDomain, setNewDomain] = useState("");
  const [domains, setDomains] = useState([
    "tempmail.dev",
    "temp-mail.org"
  ]);
  const { toast } = useToast();

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
    </div>
  );
};