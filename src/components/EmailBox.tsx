import { useState, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EmailBox = () => {
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateEmail();
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const generateEmail = () => {
    const random = Math.random().toString(36).substring(7);
    setEmail(`${random}@tempmail.dev`);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email copied to clipboard",
      duration: 2000,
    });
  };

  const refreshInbox = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Inbox refreshed",
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">Your Temporary Email Address</h1>
        <p className="text-gray-600 text-center mb-6">
          This is your unique temporary email address. Copy it and send an email. It will
          automatically delete when it expires, leaving no trace.
        </p>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">{formatTime(timeLeft)}</span>
            <span className="font-medium text-gray-900">{email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyEmail}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Copy email"
            >
              <Copy className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={refreshInbox}
              className={`p-2 hover:bg-gray-200 rounded-full transition-colors ${
                loading ? "animate-spin" : ""
              }`}
              title="Refresh inbox"
              disabled={loading}
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
          <div className="text-center text-gray-500">
            <p className="mb-2">Waiting for incoming emails...</p>
            <RefreshCw className="h-6 w-6 mx-auto animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
};