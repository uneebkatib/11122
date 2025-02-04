
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPanel } from "@/components/AdminPanel";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminPanel />
    </div>
  );
};

export default Admin;
