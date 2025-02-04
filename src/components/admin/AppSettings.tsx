import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const AppSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>App Name</Label>
            <Input placeholder="Temp Mail | Disposable Temporary Email Address" />
          </div>
          
          <div className="space-y-2">
            <Label>Logo</Label>
            <Input type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <Label>Favicon</Label>
            <Input type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Input type="color" />
          </div>

          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <Input type="color" />
          </div>

          <div className="space-y-2">
            <Label>Tertiary Color</Label>
            <Input type="color" />
          </div>

          <div className="space-y-2">
            <Label>Default Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Font Family (Headers)</Label>
            <Input defaultValue="Kadwa" placeholder="Use Google Fonts with exact name" />
          </div>

          <div className="space-y-2">
            <Label>Font Family (Body)</Label>
            <Input defaultValue="Poppins" placeholder="Use Google Fonts with exact name" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Disable Mailbox Slug from URL</Label>
              <p className="text-sm text-muted-foreground">
                If enabled, the /mailbox slug will be removed from your URL
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Mail ID Creation from URL</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to create email IDs directly from URL
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Custom Header for App (MailBox)</Label>
            <Textarea placeholder="Enter your HTML Code here" className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label>External Link Masking Service</Label>
            <Input defaultValue="hidereferrer.net" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Ad Block Detector</Label>
              <p className="text-sm text-muted-foreground">
                Block users with Ad Blocker enabled
              </p>
            </div>
            <Switch />
          </div>
        </div>

        <Button className="w-full">Save App Settings</Button>
      </CardContent>
    </Card>
  );
};