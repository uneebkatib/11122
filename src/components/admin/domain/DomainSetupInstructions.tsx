
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const DomainSetupInstructions = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isAdmin ? "Global Domain Management" : "Custom Domain Setup"}</CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Manage global domains that all users can use for temporary email addresses."
            : "Configure your custom domain for premium users to receive emails."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>1. Add your domain</AlertTitle>
          <AlertDescription>
            Enter your domain name below (e.g., example.com). Make sure you own or have control over this domain.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>2. Configure DNS Records</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Add these DNS records to your domain provider's settings:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>MX Record: Priority 10, points to our mail server (will be shown after adding domain)</li>
              <li>TXT Record: For domain verification (will be shown after adding domain)</li>
              <li>These changes may take 24-48 hours to propagate</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>3. Verify Domain</AlertTitle>
          <AlertDescription>
            After DNS records are configured, click the verify button. The system will check your DNS configuration.
            {!isAdmin && " Custom domains are only available for premium users."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
