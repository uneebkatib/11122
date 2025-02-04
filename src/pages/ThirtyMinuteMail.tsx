import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";

const ThirtyMinuteMail = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EmailBox duration={1800} /> {/* 30 minutes in seconds */}
      <Features />
    </div>
  );
};

export default ThirtyMinuteMail;