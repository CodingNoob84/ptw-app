import { PermitDetailsPage } from "@/components/permit/permit-details-page";
import { Button } from "@/components/ui/button";
import { getPermitDetails } from "@/dbqueries/project";
import { getUserWithReporting, UserWithReporting } from "@/dbqueries/user";
import { createClient } from "@/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function PermitDetailPage({
  params,
}: {
  params: Promise<{ permitId: string }>;
}) {
  const { permitId } = await params;

  // Create Supabase client and QueryClient for hydration
  const supabase = await createClient();
  const queryClient = new QueryClient();

  // Get the current user with reporting hierarchy
  const userData: UserWithReporting = await queryClient.ensureQueryData({
    queryKey: ["userinfo"],
    queryFn: () => getUserWithReporting(supabase),
  });

  const userId = userData.user.id;

  // Now fetch the permit details using userId + permitId
  await queryClient.prefetchQuery({
    queryKey: ["permit", permitId],
    queryFn: () => getPermitDetails(permitId, supabase),
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PermitDetailsPage userId={userId} permitId={permitId} />
      </HydrationBoundary>
    </div>
  );
}
