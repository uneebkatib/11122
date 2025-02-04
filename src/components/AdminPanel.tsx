
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DomainManagement } from "./admin/DomainManagement";
import { EmailManagement } from "./admin/EmailManagement";
import { WelcomeSection } from "./admin/WelcomeSection";
import { AnnouncementBanner } from "./admin/AnnouncementBanner";
import { AppSettings } from "./admin/AppSettings";
import { EngineSettings } from "./admin/EngineSettings";

export const AdminPanel = () => {
  return (
    <div className="container mx-auto py-6">
      <AnnouncementBanner />
      <WelcomeSection />
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="app" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="app">App</TabsTrigger>
              <TabsTrigger value="engine">Engine</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="themes">Themes</TabsTrigger>
            </TabsList>

            <TabsContent value="app">
              <AppSettings />
            </TabsContent>

            <TabsContent value="engine">
              <EngineSettings />
            </TabsContent>

            <TabsContent value="domains">
              <DomainManagement />
            </TabsContent>

            <TabsContent value="emails">
              <EmailManagement />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Email Expiration (minutes)</label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Emails Per IP</label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="themes">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Customize the appearance of your TMail instance. Changes will be applied globally.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Color</label>
                      <Input type="color" defaultValue="#4F46E5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Font Family</label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Open Sans</option>
                      </select>
                    </div>
                    <Button>Apply Theme</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
