import { Shield, Clock, Trash } from "lucide-react";

export const Features = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold text-center mb-12">Why Choose TempMail</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
          <p className="text-gray-600">Your temporary emails are completely anonymous and secure.</p>
        </div>
        <div className="text-center">
          <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">10 Minute Duration</h3>
          <p className="text-gray-600">Emails automatically delete after 10 minutes.</p>
        </div>
        <div className="text-center">
          <Trash className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Traces Left</h3>
          <p className="text-gray-600">All data is permanently deleted after expiration.</p>
        </div>
      </div>
    </div>
  );
};