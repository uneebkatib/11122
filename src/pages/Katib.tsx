
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Admin from "./Admin";

const Katib = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== 'admin@jempmail.com') {
        navigate('/');
        return;
      }
    };

    checkAdmin();
  }, [navigate]);

  return <Admin />;
};

export default Katib;
