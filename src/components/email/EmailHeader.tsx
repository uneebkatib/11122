
import { Copy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmail } from "@/contexts/EmailContext";

export const EmailHeader = () => {
  const { email, generateRandomEmail, copyEmail, isLoadingAdminDomains } = useEmail();

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-full shadow-lg flex items-center justify-between p-2 px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={generateRandomEmail}
          disabled={isLoadingAdminDomains}
        >
          <Plus className="h-5 w-5 text-gray-500" />
        </Button>
        
        <div className="flex-1 mx-4 text-center font-mono text-lg text-gray-700">
          {email || "Generating email..."}
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full" 
          onClick={copyEmail}
          disabled={!email}
        >
          <Copy className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};
