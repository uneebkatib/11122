
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IMAPServer {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'TLS' | 'SSL' | 'NONE';
  is_active: boolean;
}

const defaultServer: IMAPServer = {
  id: '',
  host: '',
  port: 993,
  username: '',
  password: '',
  encryption: 'TLS',
  is_active: true
};

export const IMAPServerSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newServer, setNewServer] = useState<IMAPServer>(defaultServer);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: imapServers, isLoading } = useQuery({
    queryKey: ['imapServers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imap_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as IMAPServer[];
    }
  });

  const addServer = useMutation({
    mutationFn: async (server: Omit<IMAPServer, 'id'>) => {
      const { data, error } = await supabase
        .from('imap_configs')
        .insert([server])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imapServers'] });
      setNewServer(defaultServer);
      toast({
        title: "Success",
        description: "IMAP server added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add IMAP server: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteServer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('imap_configs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imapServers'] });
      toast({
        title: "Success",
        description: "IMAP server deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete IMAP server: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    const serverData = {
      ...newServer,
      port: Number(newServer.port)
    };
    addServer.mutate(serverData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>IMAP Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>IMAP Servers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hostname</Label>
              <Input
                value={newServer.host}
                onChange={(e) => setNewServer({ ...newServer, host: e.target.value })}
                placeholder="imap.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Port</Label>
              <Input
                type="number"
                value={newServer.port}
                onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) || 993 })}
                placeholder="993"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={newServer.username}
                onChange={(e) => setNewServer({ ...newServer, username: e.target.value })}
                placeholder="username@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newServer.password}
                  onChange={(e) => setNewServer({ ...newServer, password: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Encryption</Label>
            <Select
              value={newServer.encryption}
              onValueChange={(value: 'TLS' | 'SSL' | 'NONE') => 
                setNewServer({ ...newServer, encryption: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select encryption type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TLS">TLS</SelectItem>
                <SelectItem value="SSL">SSL</SelectItem>
                <SelectItem value="NONE">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={addServer.isPending}
        >
          {addServer.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Add IMAP Server
        </Button>

        {imapServers && imapServers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Configured Servers</h3>
            <div className="space-y-4">
              {imapServers.map((server) => (
                <Card key={server.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{server.host}</p>
                        <p className="text-sm text-gray-500">
                          {server.username} • Port {server.port} • {server.encryption}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteServer.mutate(server.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
