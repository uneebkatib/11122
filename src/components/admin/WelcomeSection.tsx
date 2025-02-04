
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WelcomeSection = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to TMail Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Manage your temporary email domains and addresses from this central dashboard.
          Use the tabs below to access different management features.
        </p>
      </CardContent>
    </Card>
  );
};
