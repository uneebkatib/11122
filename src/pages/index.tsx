
import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";
import { PricingPlans } from "@/components/PricingPlans";

const Index = () => {
  console.log("Rendering Index page");
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <EmailBox allowAnonymous={true} />
      <Features />
      <PricingPlans />
    </div>
  );
};

export default Index;

