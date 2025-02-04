import { useState, useEffect } from "react";
import { Copy, RefreshCw, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface EmailBoxProps {
  duration?: number;
}

export const EmailBox = ({ duration = 600 }: EmailBoxProps) => {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateEmail();
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateEmail = () => {
    const random = Math.random().toString(36).substring(7);
    setEmail(`${random}@tempmail.dev`);
    setTimeLeft(duration);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copied to clipboard",
      description: "You can now paste it anywhere",
      duration: 2000,
    });
  };

  const refreshInbox = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Inbox refreshed",
        description: "Your inbox is up to date",
        duration: 2000,
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Temporary Email Address</CardTitle>
          <CardDescription>
            This email will expire in {formatTime(timeLeft)}. All messages will be permanently deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={email}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyEmail}
                title="Copy email"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={generateEmail}
                title="Generate new email"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={refreshInbox}
                disabled={loading}
                className={loading ? "animate-spin" : ""}
                title="Refresh inbox"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Time remaining: {formatTime(timeLeft)}</span>
              </div>
              <span className="text-muted-foreground">Auto-delete when expired</span>
            </div>

            <div className="mt-6 border-2 border-dashed rounded-lg p-8">
              <div className="text-center text-muted-foreground">
                <p className="mb-2">Your inbox is empty</p>
                <RefreshCw className="h-6 w-6 mx-auto animate-spin" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};