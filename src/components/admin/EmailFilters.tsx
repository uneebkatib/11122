
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailFilter {
  id: string;
  filter_type: string;
  pattern: string;
  is_active: boolean;
  created_at: string;
}

export const EmailFilters = () => {
  const [filters, setFilters] = useState<EmailFilter[]>([]);
  const [newPattern, setNewPattern] = useState("");
  const [filterType, setFilterType] = useState<string>("spam");
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

    await loadFilters();
    setNewPattern("");
    toast({
      title: "Success",
      description: "Filter added successfully",
    });
  };

  const handleToggleFilter = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('email_filters')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to toggle filter",
        variant: "destructive",
      });
      return;
    }

    await loadFilters();
    toast({
      title: "Success",
      description: "Filter updated successfully",
    });
  };

  const handleDeleteFilter = async (id: string) => {
    const { error } = await supabase
      .from('email_filters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete filter",
        variant: "destructive",
      });
      return;
    }

    await loadFilters();
    toast({
      title: "Success",
      description: "Filter deleted successfully",
    });
  };

  return (
    <div className="space-y-4">
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Pattern</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filters.map((filter) => (
            <TableRow key={filter.id}>
              <TableCell className="capitalize">{filter.filter_type}</TableCell>
              <TableCell>{filter.pattern}</TableCell>
              <TableCell>
                <Button
                  variant={filter.is_active ? "default" : "secondary"}
                  size="sm"
                  onClick={() => handleToggleFilter(filter.id, filter.is_active)}
                >
                  {filter.is_active ? "Active" : "Inactive"}
                </Button>
              </TableCell>
              <TableCell>{new Date(filter.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteFilter(filter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
