
import { Header } from "@/components/Header";
import { UserSettings } from "@/components/UserSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, subscription_tier')
        .eq('id', session!.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <UserSettings />
        
        {profile?.subscription_tier === 'premium' && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>IMAP Configuration Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Set up your email client using these IMAP settings:
                  </p>
                  <div className="grid gap-4">
                    <div>
                      <p className="font-medium">Server: imap.jempmail.com</p>
                      <p className="text-sm text-muted-foreground">Port: 993 (SSL/TLS)</p>
                    </div>
                    <div>
                      <p className="font-medium">Username: [Your JempMail Email]</p>
                      <p className="text-sm text-muted-foreground">Password: [Your Account Password]</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Note: SSL/TLS encryption is required for secure connection.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

