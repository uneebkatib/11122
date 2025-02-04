
import { User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session!.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="w-full bg-[#1A1F2C] border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-semibold">
              <span className="text-[#9b87f5]">Jemp</span>
              <span className="text-[#4CAF50]">Mail</span>
            </span>
          </div>
          
          <nav className="flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#2A2F3C] border-gray-700 text-gray-200">
                  <DropdownMenuItem className="text-sm hover:bg-gray-700">
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm hover:bg-gray-700">
                    Plan: {profile?.subscription_tier || 'free'}
                  </DropdownMenuItem>
                  {profile?.is_admin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-gray-700">
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-700">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
