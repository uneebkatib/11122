
export interface CustomDomain {
  id: string;
  domain: string;
  verification_token: string;
  verification_status: 'pending' | 'verified' | 'failed';
  verified_at: string | null;
  mx_record: string | null;
  last_verification_attempt: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  is_global?: boolean;
}
