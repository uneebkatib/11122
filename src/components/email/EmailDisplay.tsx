
import { formatDistanceToNow, formatDistance } from "date-fns";
import { EmailDisplayProps } from "@/types/email";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

export const EmailDisplay = ({ email }: EmailDisplayProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      if (email.will_expire_at) {
        const expiryDate = new Date(email.will_expire_at);
        const now = new Date();
        if (expiryDate > now) {
          setTimeLeft(formatDistance(expiryDate, now, { addSuffix: true }));
        } else {
          setTimeLeft("Expired");
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [email.will_expire_at]);

  return (
    <div className="p-6 space-y-4 border-b border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-700">
            {email.subject || "(no subject)"}
          </h3>
          <p className="text-sm text-gray-500">
            From: {email.from_email}
          </p>
          <time className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
          </time>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Timer className="h-3 w-3" />
          <span>{timeLeft}</span>
        </Badge>
      </div>
      <div className="prose prose-sm max-w-none text-gray-600">
        {email.body}
      </div>
    </div>
  );
};
