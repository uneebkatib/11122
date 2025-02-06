
import { Trash2, RefreshCcw, History } from "lucide-react";
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
            <RefreshCcw className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Generate new email</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setEmail("")}
            disabled={!email}
          >
            <Trash2 className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Delete current email</span>
          </Button>

          {previousEmails.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <History className="h-5 w-5 text-gray-500" />
                  <span className="sr-only">Previous emails</span>
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
          ) : email || "Click the refresh button to generate a new email"}
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full" 
          onClick={copyEmail}
          disabled={!email}
        >
          <span className="sr-only">Copy email address</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gray-500"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
