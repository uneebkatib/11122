
import { Shield, Clock, Trash, Lock, Zap, RefreshCcw, User, Users } from "lucide-react";

export const Features = () => {
  return (
    <div className="container mx-auto px-4 py-16" id="features">
      <h2 className="text-3xl font-bold text-center mb-4">Why Choose JempMail</h2>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Protect your privacy with our secure, temporary email service. Perfect for testing, signing up, or avoiding spam.
      </p>
      
      {/* User Types and Retention Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <User className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Anonymous Users</h3>
          <p className="text-center text-muted-foreground">15-minute email retention</p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
          <p className="text-center text-muted-foreground">24-hour email retention</p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Clock className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Auto-Deletion</h3>
          <p className="text-center text-muted-foreground">Emails automatically deleted after retention period</p>
        </div>
      </div>
      
      {/* Additional Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
          <p className="text-center text-muted-foreground">Your temporary emails are completely anonymous and secure.</p>
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
      </div>
    </div>
  );
};
