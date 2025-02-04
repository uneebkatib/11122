
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddDomainFormProps {
  newDomain: string;
  onDomainChange: (value: string) => void;
  onSubmit: () => void;
}

export const AddDomainForm = ({
  newDomain,
  onDomainChange,
  onSubmit,
}: AddDomainFormProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter domain (e.g., example.com)"
        value={newDomain}
        onChange={(e) => onDomainChange(e.target.value)}
      />
      <Button onClick={onSubmit}>
        <Plus className="mr-2 h-4 w-4" />
        Add Domain
      </Button>
    </div>
  );
};
