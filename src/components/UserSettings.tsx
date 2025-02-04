
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
      const { data: { publicURL }, error: storageError } = await supabase
        .storage
        .from('qr-codes')
        .getPublicUrl('payment-address.png');

      if (storageError) throw storageError;

      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .update({
          payment_method: 'crypto',
          crypto_payment_address: cryptoAddress,
          status: 'pending_payment'
        })
        .eq('user_id', session.user.id);

      if (subscriptionError) throw subscriptionError;

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

            {!subscription && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
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
