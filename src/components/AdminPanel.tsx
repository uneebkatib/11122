
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainManagement } from "./admin/DomainManagement";
import { EmailManagement } from "./admin/EmailManagement";
import { EmailFilters } from "./admin/EmailFilters";
import { EngineSettings } from "./admin/EngineSettings";
import { MailServerSettings } from "./admin/MailServerSettings";
import { IMAPServerSettings } from "./admin/IMAPServerSettings";

export const AdminPanel = () => {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Service Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="domains" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-6">
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="engine">Engine Settings</TabsTrigger>
              <TabsTrigger value="smtp">SMTP Servers</TabsTrigger>
              <TabsTrigger value="imap">IMAP Servers</TabsTrigger>
            </TabsList>

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

            <TabsContent value="smtp">
              <Card>
                <CardHeader>
                  <CardTitle>SMTP Server Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <MailServerSettings />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imap">
              <Card>
                <CardHeader>
                  <CardTitle>IMAP Server Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <IMAPServerSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
