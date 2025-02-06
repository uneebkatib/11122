
import { useState } from "react";
import { Crown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailHeader } from "./email/EmailHeader";
import { EmailInbox } from "./email/EmailInbox";
import { PremiumFeatures } from "./email/PremiumFeatures";
import { CustomEmailDialog } from "./email/CustomEmailDialog";
import { EmailBoxProps } from "@/types/email";
import { EmailProvider } from "@/contexts/EmailContext";
import { useEmail } from "@/contexts/EmailContext";

export const EmailBox = ({ duration = 600, allowAnonymous = false }: EmailBoxProps) => {
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showCustomEmailDialog, setShowCustomEmailDialog] = useState(false);
  const { adminDomains, setEmail } = useEmail();

  const defaultDomain = adminDomains?.[0]?.domain;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <h1 className="text-5xl font-bold text-center text-gray-800 mt-12">
          Your Temporary Email Address
        </h1>

        <EmailProvider>
          <EmailHeader />
          
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCustomEmailDialog(true)}
              disabled={!defaultDomain}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Custom Email
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowPremiumDialog(true)}
            >
              <Crown className="h-4 w-4 mr-2" />
              Custom Domain (Premium)
            </Button>
          </div>

          <EmailInbox />
          
          {defaultDomain && (
            <CustomEmailDialog
              open={showCustomEmailDialog}
              onOpenChange={setShowCustomEmailDialog}
              domain={defaultDomain}
              onEmailCreated={setEmail}
            />
          )}
        </EmailProvider>
      </div>

      <PremiumFeatures 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog}
      />
    </div>
  );
};
