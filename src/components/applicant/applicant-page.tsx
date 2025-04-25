"use client";
import { PermitCard } from "@/components/applicant/permit-card";
import { PermitsSkeleton } from "@/components/applicant/permits-skeleton";
import { Button } from "@/components/ui/button";
import { getUserPermits } from "@/dbqueries/project";
import { getUserWithReporting } from "@/dbqueries/user";
import { createClient } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const ApplicantPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const { data: userdata } = useQuery({
    queryKey: ["userinfo"],
    queryFn: () => getUserWithReporting(supabase),
  });
  const userId = userdata?.user?.id as string;
  const { data: permits, isLoading } = useQuery({
    queryKey: ["allpermits", userId],
    queryFn: () => getUserPermits(userId, supabase),
    enabled: !!userId,
  });

  //console.log("allpermits", permits);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Permits</h1>
        {userdata?.user.role == "applicant" && (
          <Button
            onClick={() => router.push("/dashboard/create")}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Permit
          </Button>
        )}
      </div>

      {isLoading && !permits ? (
        <PermitsSkeleton />
      ) : permits && permits.length > 0 ? (
        <div className="space-y-4">
          {permits.map((permit) => (
            <PermitCard key={permit.permit_id} permit={permit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            No permits found
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first permit to get started
          </p>
        </div>
      )}
    </div>
  );
};
