import { GoToDashboard } from "@/components/home/goto-dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/supabase/server";
import {
  Briefcase,
  Building,
  Clock,
  Mail,
  Shield,
  User,
} from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("authid", auth.user?.id)
    .single();

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500";
      case "manager":
        return "bg-blue-500";
      case "safetyaccessor":
        return "bg-green-500";
      case "applicant":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "manager":
        return <Building className="h-4 w-4" />;
      case "safetyaccessor":
        return <Briefcase className="h-4 w-4" />;
      case "applicant":
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src="/images/noavatar.jpg" alt={user.firstname} />
              <AvatarFallback className="text-3xl">
                {user.firstname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                Welcome, {user.firstname} {user.lastname}!
              </CardTitle>
              <div className="flex items-center justify-center space-x-2">
                <Badge
                  className={`${getRoleBadgeColor(
                    user.role
                  )} text-white flex items-center space-x-1`}
                >
                  {getRoleIcon(user.role)}
                  <span>
                    {user.role
                      ? user.role.charAt(0).toUpperCase() +
                        user.role.slice(1).replace(/([A-Z])/g, " $1")
                      : "Pending Approval"}
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium text-sm font-mono">
                  {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <GoToDashboard />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
