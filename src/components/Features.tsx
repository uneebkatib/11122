import { Shield, Clock, Trash, Lock, Zap, RefreshCcw } from "lucide-react";

export const Features = () => {
  return (
    <div className="container mx-auto px-4 py-16" id="features">
      <h2 className="text-3xl font-bold text-center mb-4">Why Choose TempMail</h2>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Protect your privacy with our secure, temporary email service. Perfect for testing, signing up, or avoiding spam.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
          <p className="text-center text-muted-foreground">Your temporary emails are completely anonymous and secure.</p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Clock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Auto-Expiring</h3>
          <p className="text-center text-muted-foreground">Emails automatically delete after the set time period.</p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Trash className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Traces Left</h3>
          <p className="text-center text-muted-foreground">All data is permanently deleted after expiration.</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Lock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">End-to-End Privacy</h3>
          <p className="text-center text-muted-foreground">Your data is encrypted and never shared with third parties.</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Zap className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Instant Setup</h3>
          <p className="text-center text-muted-foreground">No registration required. Get an email address instantly.</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <RefreshCcw className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Real-Time Updates</h3>
          <p className="text-center text-muted-foreground">Instant email delivery with real-time inbox updates.</p>
        </div>
      </div>
    </div>
  );
};