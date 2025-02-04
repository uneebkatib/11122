
import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";
import { PricingPlans } from "@/components/PricingPlans";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <EmailBox />
      <Features />
      <PricingPlans />
    </div>
  );
};

export default Index;
