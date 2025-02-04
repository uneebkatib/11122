
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainManagement } from "./admin/DomainManagement";
import { EmailManagement } from "./admin/EmailManagement";
import { EmailFilters } from "./admin/EmailFilters";
import { EngineSettings } from "./admin/EngineSettings";

export const AdminPanel = () => {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Service Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="emails" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="engine">Engine Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="emails">
              <Card>
                <CardHeader>
                  <CardTitle>Email Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmailManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domains">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <DomainManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="filters">
              <Card>
                <CardHeader>
                  <CardTitle>Email Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmailFilters />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engine">
              <Card>
                <CardHeader>
                  <CardTitle>Engine Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <EngineSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
