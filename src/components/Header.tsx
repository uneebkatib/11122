
import { Mail, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

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
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, subscription_tier')
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
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">JempMail</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="text-sm">
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm">
                    Plan: {profile?.subscription_tier || 'free'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {profile?.is_admin && (
                    <DropdownMenuItem onSelect={() => navigate('/admin')} className="font-medium text-primary">
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate('/login')}>
                    Upgrade Plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} variant="outline">
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
