
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminPanel } from "@/components/AdminPanel";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();

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
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <AdminPanel />
    </div>
  );
};

export default Admin;
