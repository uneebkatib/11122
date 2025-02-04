
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, RefreshCw, Trash2 } from "lucide-react";
import { CustomDomain } from "@/types/domain";

interface DomainTableProps {
  domains: CustomDomain[];
  onVerify: (domain: CustomDomain) => void;
  onDelete: (id: string) => void;
}

export const DomainTable = ({ domains, onVerify, onDelete }: DomainTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>DNS Records</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {domains.map((domain) => (
          <TableRow key={domain.id}>
            <TableCell>{domain.domain}</TableCell>
            <TableCell>
              {domain.verification_status === 'verified' ? (
                <span className="text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Verified
                </span>
              ) : domain.verification_status === 'failed' ? (
                <span className="text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  Failed
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Pending
                </span>
              )}
            </TableCell>
            <TableCell className="space-y-2">
              <div>
                <p className="text-sm font-medium">MX Record:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {domain.mx_record}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium">TXT Record:</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {domain.verification_token}
                </code>
              </div>
            </TableCell>
            <TableCell className="space-x-2">
              {domain.verification_status !== 'verified' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVerify(domain)}
                >
                  Verify
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(domain.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
