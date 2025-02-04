import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";

const TenMinuteMail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EmailBox duration={600} /> {/* 10 minutes in seconds */}
      <Features />
    </div>
  );
};

export default TenMinuteMail;