
export interface Email {
  id: string;
  from_email: string;
  subject: string;
  body: string;
  received_at: string;
  is_read: boolean;
  email_type?: 'temporary' | 'custom';
  created_by?: string;
  created_at?: string;
  retention_period?: string;
  will_expire_at?: string;
  is_expired?: boolean;
}

export interface EmailBoxProps {
  duration?: number;
  allowAnonymous?: boolean;
}

export interface CustomEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: string;
  onEmailCreated: (email: string) => void;
}

export interface EmailDisplayProps {
  email: Email;
}
