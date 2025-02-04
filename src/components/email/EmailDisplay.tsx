
import { formatDistanceToNow } from "date-fns";
import { EmailDisplayProps } from "@/types/email";

export const EmailDisplay = ({ email }: EmailDisplayProps) => {
  return (
    <div className="p-6 space-y-4">
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
      <div className="prose prose-sm max-w-none text-gray-600">
        {email.body}
      </div>
    </div>
  );
};
