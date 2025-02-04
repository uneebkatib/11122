
export interface CustomDomain {
  id: string;
  domain: string;
  verification_token: string;
  is_verified: boolean;
  verified_at: string | null;
  mx_record: string | null;
  verification_status: 'pending' | 'verified' | 'failed';
  last_verification_attempt: string | null;
}
