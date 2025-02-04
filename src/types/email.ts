
export interface Email {
  id: string;
  from_email: string;
  subject: string;
  body: string;
  received_at: string;
  is_read: boolean;
}

export interface EmailBoxProps {
  duration?: number;
}

export interface CustomEmailDialogProps {
  domains: any[];
  onCreateEmail: (username: string, domain: string) => void;
}

export interface EmailDisplayProps {
  email: Email;
}
