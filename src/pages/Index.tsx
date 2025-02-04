import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EmailBox />
      <Features />
    </div>
  );
};

export default Index;