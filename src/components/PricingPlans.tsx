
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Bitcoin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '15-minute email retention (anonymous)',
      '24-hour email retention (logged in)',
      'Basic inbox features',
      'No credit card required'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4,
    features: [
      'All Free features',
      'Custom email addresses',
      'Use your own domain',
      'Extended email storage',
      'Priority support',
      'Pay with cryptocurrency'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 10,
    features: [
      'All Premium features',
      'Multiple user accounts',
      'Advanced analytics',
      'Custom integration support',
      'Dedicated account manager',
      'SLA guarantee'
    ]
  }
];

export const PricingPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const handleSubscribe = async (planId: string, price: number) => {
    if (!session && price > 0) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to this plan.",
      });
      navigate('/login', { state: { redirectTo: '/#pricing' } });
      return;
    }

    if (price === 0) {
      // Handle free plan subscription
      const { error } = await supabase.from('user_subscriptions').insert({
        user_id: session?.user.id,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to subscribe to the free plan. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "You've been successfully subscribed to the free plan!",
      });
    } else {
      // Navigate to settings for crypto payment
      navigate('/settings');
      toast({
        title: "Crypto Payment",
        description: "You'll be redirected to complete your payment using cryptocurrency.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16" id="pricing">
      <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
      <p className="text-center text-muted-foreground mb-12">
        Choose the plan that best fits your needs
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {PRICING_PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  {plan.price > 0 ? `/month` : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full"
                onClick={() => handleSubscribe(plan.id, plan.price)}
              >
                {plan.price === 0 ? 'Get Started' : (
                  <span className="flex items-center gap-2">
                    <Bitcoin className="h-4 w-4" />
                    Subscribe with Crypto
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
