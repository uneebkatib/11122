
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface CustomEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: string;
  onEmailCreated: (email: string) => void;
}

export const CustomEmailDialog = ({ 
  open, 
  onOpenChange, 
  domain,
  onEmailCreated 
}: CustomEmailDialogProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateEmail = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const emailAddress = `${username}@${domain}`;
      
      // Save custom email
      const { error } = await supabase
        .from('custom_emails')
        .insert({
          email_address: emailAddress,
          domain: domain,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom email created successfully",
      });
      
      onEmailCreated(emailAddress);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create custom email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Email</DialogTitle>
          <DialogDescription>
            Choose your custom email username. Domain will be {domain}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-2">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
              <span className="text-gray-500">@{domain}</span>
            </div>
          </div>
          <Button 
            onClick={handleCreateEmail}
            disabled={isLoading || !username}
          >
            {isLoading ? "Creating..." : "Create Email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
