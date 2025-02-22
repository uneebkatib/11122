
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Timer, Package, Bitcoin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UserSettings = () => {
  const { toast } = useToast();
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: subscription, error: subscriptionError } = useQuery({
    queryKey: ['user-subscription'],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, pricing_plans(*)')
        .eq('user_id', session!.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Subscription query error:', error);
        return null;
      }
      return data;
    }
  });

  const handleCryptoPayment = async () => {
    if (!cryptoAddress || !session?.user) return;
    
    setIsProcessing(true);
    try {
      // First, check if there's an existing subscription
      if (!subscription) {
        // Get the premium plan ID
        const { data: premiumPlan } = await supabase
          .from('pricing_plans')
          .select('id')
          .eq('name', 'Premium')
          .single();

        if (!premiumPlan) throw new Error('Premium plan not found');

        const { error: createError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: session.user.id,
            plan_id: premiumPlan.id,
            status: 'pending_payment',
            payment_method: 'crypto',
            crypto_payment_address: cryptoAddress,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (createError) throw createError;
      } else {
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            payment_method: 'crypto',
            crypto_payment_address: cryptoAddress,
            status: 'pending_payment'
          })
          .eq('user_id', session.user.id);

        if (updateError) throw updateError;
      }

      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          user_id: session.user.id,
          subscription_id: subscription?.id,
          amount: 4.99,
          currency: 'USD',
          payment_method: 'crypto',
          status: 'pending'
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Payment Instructions",
        description: "Please send the payment to the provided crypto address. Your subscription will be activated once the payment is confirmed.",
      });

    } catch (error) {
      console.error('Error processing crypto payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!session) return null;

  if (subscriptionError) {
    console.error('Error fetching subscription:', subscriptionError);
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Your Subscription
            {subscription?.status === 'active' && (
              <Badge variant="default" className="ml-2">Active</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Current Plan</div>
                <div className="font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {subscription?.pricing_plans?.name || 'Free Plan'}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  {subscription?.status || 'Active'}
                </div>
              </div>
            </div>

            {subscription?.current_period_end && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">Next billing date</div>
                <div className="font-medium">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </div>
              </div>
            )}

            {!subscription && (
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bitcoin className="h-4 w-4" />
                  Upgrade to Premium using Cryptocurrency
                </div>
                <Input
                  placeholder="Enter your crypto wallet address"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                />
                <Button 
                  className="w-full"
                  onClick={handleCryptoPayment}
                  disabled={isProcessing || !cryptoAddress}
                >
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProcessing ? 'Processing...' : 'Pay with Crypto'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

