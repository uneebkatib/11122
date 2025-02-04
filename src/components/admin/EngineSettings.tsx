import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const EngineSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engine Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Engine Type</Label>
            <Select defaultValue="tmail">
              <SelectTrigger>
                <SelectValue placeholder="Select engine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tmail">TMail Delivery</SelectItem>
                <SelectItem value="imap">Self-managed IMAP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Delivery Authentication Key</Label>
            <div className="flex gap-2">
              <Input type="password" className="flex-1" />
              <Button variant="outline">Show</Button>
              <Button variant="outline">Copy</Button>
            </div>
          </div>
        </div>

        <Button className="w-full">Save Engine Settings</Button>
      </CardContent>
    </Card>
  );
};