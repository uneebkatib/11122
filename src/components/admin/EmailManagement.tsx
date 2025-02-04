
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink } from "lucide-react";
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

interface Email {
  id: string;
  temp_email: string;
  from_email: string;
  subject: string | null;
  received_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
}

export const EmailManagement = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .order('received_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load emails",
        variant: "destructive",
      });
      return;
    }

    setEmails(data || []);
  };

  const handleDeleteEmail = async (id: string) => {
    const { error } = await supabase
      .from('emails')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete email",
        variant: "destructive",
      });
      return;
    }

    await loadEmails();
    toast({
      title: "Success",
      description: "Email deleted successfully",
    });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Temporary Email</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow key={email.id}>
              <TableCell>{email.temp_email}</TableCell>
              <TableCell>{email.from_email}</TableCell>
              <TableCell>{email.subject}</TableCell>
              <TableCell>
                {email.received_at ? new Date(email.received_at).toLocaleString() : '-'}
              </TableCell>
              <TableCell>
                {email.expires_at ? new Date(email.expires_at).toLocaleString() : '-'}
              </TableCell>
              <TableCell>
                <span className={email.is_expired ? "text-red-500" : "text-green-500"}>
                  {email.is_expired ? "Expired" : "Active"}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteEmail(email.id)}
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
