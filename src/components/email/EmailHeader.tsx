
import { Copy, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEmail } from "@/contexts/EmailContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const EmailHeader = () => {
  const { 
    email, 
    generateRandomEmail, 
    copyEmail, 
    isLoadingAdminDomains,
    previousEmails,
    setEmail,
    adminDomains
  } = useEmail();

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-full shadow-lg flex items-center justify-between p-2 px-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={generateRandomEmail}
            disabled={isLoadingAdminDomains || !adminDomains?.length}
          >
            <Plus className="h-5 w-5 text-gray-500" />
          </Button>

          {previousEmails.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <History className="h-5 w-5 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px]">
                {previousEmails.map((prevEmail, index) => (
                  <DropdownMenuItem 
                    key={index}
                    onClick={() => setEmail(prevEmail)}
                    className="flex items-center justify-between"
                  >
                    <span className="font-mono">{prevEmail}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <div className="flex-1 mx-4 text-center font-mono text-lg text-gray-700 truncate">
          {isLoadingAdminDomains ? (
            "Loading domains..."
          ) : !adminDomains?.length ? (
            "No domains available"
          ) : email || "Creating new email..."}
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
