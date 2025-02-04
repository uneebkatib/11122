
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmailMessageProps {
  subject: string;
  from: string;
  date: string;
  preview: string;
}

export const EmailMessage = ({ subject, from, date, preview }: EmailMessageProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">{subject}</CardTitle>
        </div>
        <CardDescription className="text-xs">{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium">From: {from}</p>
          <p className="text-sm text-muted-foreground">{preview}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm">Reply</Button>
          <Button variant="outline" size="sm">Forward</Button>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
};
