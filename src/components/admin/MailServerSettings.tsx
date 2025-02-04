
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MailServer {
  id: string;
  domain: string;
  server_type: 'smtp' | 'imap' | 'pop3';
  hostname: string;
  port: number;
  username: string;
  password: string;
  use_tls: boolean;
  is_active: boolean;
}

const defaultServer: MailServer = {
  id: '',
  domain: '',
  server_type: 'smtp',
  hostname: '',
  port: 587,
  username: '',
  password: '',
  use_tls: true,
  is_active: true
};

export const MailServerSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newServer, setNewServer] = useState<MailServer>(defaultServer);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mailServers, isLoading } = useQuery({
    queryKey: ['mailServers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mail_servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MailServer[];
    }
  });

  const addServer = useMutation({
    mutationFn: async (server: Omit<MailServer, 'id'>) => {
      const { data, error } = await supabase
        .from('mail_servers')
        .insert([server])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailServers'] });
      setNewServer(defaultServer);
      toast({
        title: "Success",
        description: "Mail server added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add mail server: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteServer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mail_servers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailServers'] });
      toast({
        title: "Success",
        description: "Mail server deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete mail server: " + error.message,
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
          <CardTitle>Mail Servers</CardTitle>
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
        <CardTitle>Mail Servers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Domain</Label>
              <Input
                value={newServer.domain}
                onChange={(e) => setNewServer({ ...newServer, domain: e.target.value })}
                placeholder="example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Server Type</Label>
              <Select
                value={newServer.server_type}
                onValueChange={(value: 'smtp' | 'imap' | 'pop3') => 
                  setNewServer({ ...newServer, server_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select server type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="imap">IMAP</SelectItem>
                  <SelectItem value="pop3">POP3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hostname</Label>
              <Input
                value={newServer.hostname}
                onChange={(e) => setNewServer({ ...newServer, hostname: e.target.value })}
                placeholder="smtp.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Port</Label>
              <Input
                type="number"
                value={newServer.port}
                onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) || 587 })}
                placeholder="587"
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
        </div>

        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={addServer.isPending}
        >
          {addServer.isPending ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Add Mail Server
        </Button>

        {mailServers && mailServers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Configured Servers</h3>
            <div className="space-y-4">
              {mailServers.map((server) => (
                <Card key={server.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{server.domain}</p>
                        <p className="text-sm text-gray-500">
                          {server.server_type.toUpperCase()} • {server.hostname}:{server.port}
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
