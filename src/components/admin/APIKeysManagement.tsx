
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Copy, Check } from "lucide-react";
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

interface APIKey {
  id: string;
  name: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export const APIKeysManagement = () => {
  const [newKeyName, setNewKeyName] = useState("");
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
      return;
    }

    setApiKeys(data || []);
  };

  const handleCreateKey = async () => {
    if (!newKeyName) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive",
      });
      return;
    }

    const newKey = Math.random().toString(36).substring(2) + 
                  Math.random().toString(36).substring(2);
    
    const { error } = await supabase
      .from('api_keys')
      .insert([
        {
          name: newKeyName,
          key_hash: newKey, // In a real app, this should be hashed
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
      return;
    }

    await loadAPIKeys();
    setNewKeyName("");
    toast({
      title: "Success",
      description: "API key created successfully. Make sure to copy your key now!",
    });
    // In a real app, show the actual API key to the user here
  };

  const handleRevokeKey = async (id: string) => {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
      return;
    }

    await loadAPIKeys();
    toast({
      title: "Success",
      description: "API key revoked successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter key name"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
        <Button onClick={handleCreateKey}>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>{key.name}</TableCell>
              <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
              </TableCell>
              <TableCell>
                <span className={key.is_active ? "text-green-500" : "text-red-500"}>
                  {key.is_active ? "Active" : "Revoked"}
                </span>
              </TableCell>
              <TableCell className="space-x-2">
                {key.is_active && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
