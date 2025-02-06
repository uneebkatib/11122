
import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";
import { PricingPlans } from "@/components/PricingPlans";
import { EmailProvider } from "@/contexts/EmailContext";

const Index = () => {
  console.log("Rendering Index page");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmailProvider>
        <EmailBox allowAnonymous={true} />
      </EmailProvider>
      <Features />
      <PricingPlans />
    </div>
  );
};

export default Index;
