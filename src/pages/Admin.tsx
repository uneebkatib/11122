
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPanel } from "@/components/AdminPanel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/katib');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error || !profile?.is_admin) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel.",
            variant: "destructive",
          });
          navigate('/katib');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/katib');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminPanel />
    </div>
  );
};

export default Admin;
