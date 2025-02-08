
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Bitcoin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PRICING_PLANS = [
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 4,
    period: 'month',
    features: [
      'Extended email storage',
      'Priority support',
      'Pay with cryptocurrency',
      'Premium features access'
    ]
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: 40,
    period: 'year',
    features: [
      'All Premium features',
      'Save $8 annually',
      'Extended email storage',
      'Priority support',
      'Pay with cryptocurrency'
    ]
  }
];

export const PricingPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    navigate('/settings');
    toast({
      title: "Crypto Payment",
      description: "You'll be redirected to complete your payment using cryptocurrency.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16" id="pricing">
      <h2 className="text-3xl font-bold text-center mb-4">Premium Plans</h2>
      <p className="text-center text-muted-foreground mb-12">
        Choose your preferred billing period
      </p>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {PRICING_PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /{plan.period}
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
                onClick={() => handleSubscribe(plan.id)}
              >
                <span className="flex items-center gap-2">
                  <Bitcoin className="h-4 w-4" />
                  Subscribe with Crypto
                </span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
