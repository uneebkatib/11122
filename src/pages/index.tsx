
import { Header } from "@/components/Header";
import { EmailBox } from "@/components/EmailBox";
import { Features } from "@/components/Features";
import { PricingPlans } from "@/components/PricingPlans";
import { Shield, Clock, Users } from "lucide-react";

const Index = () => {
  console.log("Rendering Index page");
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Secure Temporary Email Service
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get instant disposable email addresses with JempMail. Perfect for testing, signing up, or avoiding spam.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Anonymous Users</h3>
            <p className="text-gray-600">15-minute email retention</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
            <p className="text-gray-600">24-hour email retention</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Auto-Deletion</h3>
            <p className="text-gray-600">Emails automatically deleted after retention period</p>
          </div>
        </div>
      </div>

      <EmailBox allowAnonymous={true} />
      <Features />
      <PricingPlans />
    </div>
  );
};

export default Index;
