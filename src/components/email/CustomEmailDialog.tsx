
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CustomEmailDialogProps } from "@/types/email";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const CustomEmailDialog = ({ domains, onCreateEmail }: CustomEmailDialogProps) => {
  const [customUsername, setCustomUsername] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreateEmail = () => {
    onCreateEmail(customUsername, selectedDomain);
    setCustomUsername("");
    setSelectedDomain("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
        >
          <Plus className="h-5 w-5 text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Custom Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter username"
              value={customUsername}
              onChange={(e) => setCustomUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Select onValueChange={setSelectedDomain} value={selectedDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains?.map((domain) => (
                  <SelectItem key={domain.id} value={domain.domain}>
                    @{domain.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Alert>
            <AlertTitle>Domain Verification Instructions</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">To verify your domain, add these DNS records:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Add an MX record pointing to our mail server</li>
                <li>Add a TXT record for domain verification</li>
                <li>Wait for DNS propagation (up to 24-48 hours)</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Button className="w-full" onClick={handleCreateEmail}>
            Create Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
