
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const UserSettings = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: subscription } = useQuery({
    queryKey: ['user-subscription'],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, pricing_plans(*)')
        .eq('user_id', session!.user.id)
        .single();
      
      if (error) return null;
      return data;
    }
  });

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Current Plan</div>
              <div className="font-medium">
                {subscription?.pricing_plans?.name || 'Free Plan'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="font-medium">
                {subscription?.status || 'Active'}
              </div>
            </div>
            {subscription?.current_period_end && (
              <div>
                <div className="text-sm text-muted-foreground">Next billing date</div>
                <div className="font-medium">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </div>
              </div>
            )}
            <Button variant="outline">
              {subscription ? 'Manage Subscription' : 'Upgrade Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
