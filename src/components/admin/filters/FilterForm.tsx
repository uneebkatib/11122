
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FilterFormProps {
  onFilterAdded: () => Promise<void>;
}

export const FilterForm = ({ onFilterAdded }: FilterFormProps) => {
  const [newPattern, setNewPattern] = useState("");
  const [filterType, setFilterType] = useState<string>("spam");
  const { toast } = useToast();

  const handleAddFilter = async () => {
    if (!newPattern) {
      toast({
        title: "Error",
        description: "Please enter a pattern",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('email_filters')
      .insert([
        {
          filter_type: filterType,
          pattern: newPattern,
        }
      ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add filter",
        variant: "destructive",
      });
      return;
    }

    await onFilterAdded();
    setNewPattern("");
    toast({
      title: "Success",
      description: "Filter added successfully",
    });
  };

  return (
    <div className="flex gap-2">
      <Select
        value={filterType}
        onValueChange={setFilterType}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spam">Spam</SelectItem>
          <SelectItem value="domain">Domain</SelectItem>
          <SelectItem value="keyword">Keyword</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Enter pattern"
        value={newPattern}
        onChange={(e) => setNewPattern(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleAddFilter}>
        <Plus className="mr-2 h-4 w-4" />
        Add Filter
      </Button>
    </div>
  );
};
