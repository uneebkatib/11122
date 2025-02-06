
import { Email } from "./email";

export interface EmailContextType {
  email: string;
  setEmail: (email: string) => void;
  generateRandomEmail: () => void;
  copyEmail: () => void;
  adminDomains: any[];
  isLoadingAdminDomains: boolean;
  emails: Email[] | undefined;
  isLoadingEmails: boolean;
  refetchEmails: () => void;
  previousEmails: string[];
  setPreviousEmails: (emails: string[]) => void;
}
