
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainManagement } from "./admin/DomainManagement";
import { EmailManagement } from "./admin/EmailManagement";
import { WelcomeSection } from "./admin/WelcomeSection";
import { AnnouncementBanner } from "./admin/AnnouncementBanner";
import { AppSettings } from "./admin/AppSettings";
import { EngineSettings } from "./admin/EngineSettings";
import { APIKeysManagement } from "./admin/APIKeysManagement";
import { EmailFilters } from "./admin/EmailFilters";
import { LanguageSelector } from "./admin/LanguageSelector";

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
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="app">
              <AppSettings />
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Language Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LanguageSelector />
                  </CardContent>
                </Card>
              </div>
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

            <TabsContent value="filters">
              <EmailFilters />
            </TabsContent>

            <TabsContent value="api">
              <APIKeysManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
