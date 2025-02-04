
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const DomainSetupInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Setup Instructions</CardTitle>
        <CardDescription>
          Follow these steps to configure your custom domain for email receiving:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle>1. Add your domain</AlertTitle>
          <AlertDescription>
            Enter your domain name below (e.g., example.com)
          </AlertDescription>
        </Alert>
        
        <Alert>
          <AlertTitle>2. Configure DNS Records</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Add these records to your domain's DNS settings:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>MX Record: Priority 10, pointing to our mail server</li>
              <li>TXT Record: For domain verification</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertTitle>3. Verify Domain</AlertTitle>
          <AlertDescription>
            After adding DNS records, click the verify button. This process may take up to 24 hours due to DNS propagation.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
