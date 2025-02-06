
import { RefreshCw, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailDisplay } from "./EmailDisplay";
import { useEmail } from "@/contexts/EmailContext";

export const EmailInbox = () => {
  const { email, emails, isLoadingEmails, refetchEmails } = useEmail();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Inbox</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchEmails()}
          disabled={isLoadingEmails}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {isLoadingEmails ? (
        <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Checking for new emails...</p>
        </div>
      ) : !email ? (
        <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
          <Mail className="h-12 w-12 mb-4 opacity-20" />
          <p>Generating email address...</p>
        </div>
      ) : emails?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
          <Mail className="h-12 w-12 mb-4 opacity-20" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {emails?.map((mail) => (
            <EmailDisplay key={mail.id} email={mail} />
          ))}
        </div>
      )}
    </div>
  );
};
