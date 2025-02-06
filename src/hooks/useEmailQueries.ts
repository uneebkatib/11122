
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Email } from "@/types/email";

export const useEmailQueries = (email: string) => {
  const { toast } = useToast();

  const { data: adminDomains, isLoading: isLoadingAdminDomains } = useQuery({
    queryKey: ['adminDomains'],
    queryFn: async () => {
      console.log('Starting domain fetch...');
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('is_active', true)
        .eq('verification_status', 'verified')
        .eq('is_global', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching domains:', error);
        toast({
          title: "Error",
          description: "Could not fetch domains. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
      
      if (!data || data.length === 0) {
        console.warn('No domains found or domains array is empty:', data);
        return [];
      }

      console.log('Successfully fetched domains:', data);
      return data;
    },
    retry: 3,
    initialData: [], 
    refetchInterval: 5000,
  });

  const { data: emails, isLoading: isLoadingEmails, refetch: refetchEmails } = useQuery({
    queryKey: ['emails', email],
    queryFn: async () => {
      if (!email) return [];
      
      console.log('Fetching emails for:', email);
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('temp_email', email)
        .order('received_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching emails:', error);
        toast({
          title: "Error",
          description: "Could not fetch emails. Please try again later.",
          variant: "destructive",
        });
        return [];
      }

      console.log('Emails fetched successfully:', data);
      return data as Email[];
    },
    enabled: !!email,
    refetchInterval: 5000,
  });

  return {
    adminDomains: adminDomains || [],
    isLoadingAdminDomains,
    emails,
    isLoadingEmails,
    refetchEmails
  };
};
