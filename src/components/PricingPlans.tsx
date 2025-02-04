
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PricingPlans = () => {
  const { data: plans } = useQuery({
    queryKey: ['pricing-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('price');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-16" id="pricing">
      <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
      <p className="text-center text-muted-foreground mb-12">
        Choose the plan that best fits your needs
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  {plan.duration_days > 0 ? `/month` : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 flex-1 mb-6">
                {(plan.features as string[]).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full">
                {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
