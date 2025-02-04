
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MailServerSettings } from "./MailServerSettings";

interface MailServerConfig {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  is_active: boolean;
}

const defaultConfig: MailServerConfig = {
  id: '',
  smtp_host: '',
  smtp_port: 587,
  smtp_username: '',
  smtp_password: '',
  is_active: true
};

export const EngineSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [config, setConfig] = useState<MailServerConfig>(defaultConfig);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mailConfig, isLoading } = useQuery({
    queryKey: ['mailServerConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mail_server_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as MailServerConfig | null;
    }
  });

  useEffect(() => {
    if (mailConfig) {
      setConfig(mailConfig);
    }
  }, [mailConfig]);

  const updateConfig = useMutation({
    mutationFn: async (newConfig: Partial<MailServerConfig>) => {
      const { data, error } = await supabase
        .from('mail_server_config')
        .upsert({
          ...config,
          ...newConfig,
          id: config.id || undefined
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mailServerConfig'] });
      toast({
        title: "Settings saved",
        description: "Mail server configuration has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save mail server configuration: " + error.message,
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    updateConfig.mutate(config);
  };

  const copyToClipboard = (text: string | undefined, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SMTP Settings</CardTitle>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Default SMTP Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input
                value={config.smtp_host}
                onChange={(e) => setConfig({ ...config, smtp_host: e.target.value })}
                placeholder="smtp.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>SMTP Port</Label>
              <Input
                type="number"
                value={config.smtp_port}
                onChange={(e) => setConfig({ ...config, smtp_port: parseInt(e.target.value) || 587 })}
                placeholder="587"
              />
            </div>

            <div className="space-y-2">
              <Label>SMTP Username</Label>
              <Input
                value={config.smtp_username}
                onChange={(e) => setConfig({ ...config, smtp_username: e.target.value })}
                placeholder="username@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>SMTP Password</Label>
              <div className="flex gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={config.smtp_password}
                  onChange={(e) => setConfig({ ...config, smtp_password: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(config.smtp_password, "SMTP Password")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={updateConfig.isPending}
          >
            {updateConfig.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save SMTP Settings
          </Button>
        </CardContent>
      </Card>

      <MailServerSettings />
    </div>
  );
};
