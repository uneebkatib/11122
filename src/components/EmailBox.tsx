
import { useState } from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailHeader } from "./email/EmailHeader";
import { EmailInbox } from "./email/EmailInbox";
import { PremiumFeatures } from "./email/PremiumFeatures";
import { EmailBoxProps } from "@/types/email";

export const EmailBox = ({ duration = 600, allowAnonymous = false }: EmailBoxProps) => {
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <h1 className="text-5xl font-bold text-center text-gray-800 mt-12">
          Your Temporary Email Address
        </h1>

        <EmailHeader />
        <EmailInbox />
        
        <div className="text-center">
          <Button
            className="mx-auto"
            variant="outline"
            onClick={() => setShowPremiumDialog(true)}
          >
            <Crown className="h-4 w-4 mr-2" />
            Create Custom Email (Premium)
          </Button>
        </div>
      </div>

      <PremiumFeatures 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog}
      />
    </div>
  );
};
