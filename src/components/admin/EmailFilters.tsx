
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FilterForm } from "./filters/FilterForm";
import { FiltersTable } from "./filters/FiltersTable";

interface EmailFilter {
  id: string;
  filter_type: string;
  pattern: string;
  is_active: boolean;
  created_at: string;
}

export const EmailFilters = () => {
  const [filters, setFilters] = useState<EmailFilter[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    const { data, error } = await supabase
      .from('email_filters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load filters",
        variant: "destructive",
      });
      return;
    }

    setFilters(data || []);
  };

  return (
    <div className="space-y-4">
      <FilterForm onFilterAdded={loadFilters} />
      <FiltersTable filters={filters} onFilterUpdated={loadFilters} />
    </div>
  );
};
