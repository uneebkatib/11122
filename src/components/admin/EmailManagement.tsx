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

export const EmailManagement = () => {
  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([
    { address: "test@tempmail.dev", created: "2024-03-15", expires: "2024-03-15 10:30" },
    { address: "demo@temp-mail.org", created: "2024-03-15", expires: "2024-03-15 11:00" }
  ]);
  const { toast } = useToast();

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
    const expires = new Date(now.getTime() + 10 * 60000);
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
    <div className="space-y-4">
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
    </div>
  );
};