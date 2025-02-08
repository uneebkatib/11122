
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
      
      // Check if email already exists
      const { data: existingEmail, error: checkError } = await supabase
        .from('custom_emails')
        .select('email_address')
        .eq('email_address', emailAddress)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingEmail) {
        toast({
          title: "Error",
          description: "This email address is already taken",
          variant: "destructive",
        });
        return;
      }

      // Create custom email
      const { error } = await supabase
        .from('custom_emails')
        .insert({
          email_address: emailAddress,
          domain: domain,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom email created successfully",
      });
      
      onEmailCreated(emailAddress);
      onOpenChange(false);
      setUsername("");
    } catch (error: any) {
      console.error('Error in handleCreateEmail:', error);
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
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="Enter username"
                pattern="[a-z0-9._-]+"
                title="Only lowercase letters, numbers, dots, underscores, and hyphens are allowed"
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
