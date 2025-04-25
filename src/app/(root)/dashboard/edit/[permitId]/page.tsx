import { EditPermit } from "@/components/applicant/editpermit";
import { getPermitDetails } from "@/dbqueries/project";
import { getUserWithReporting, UserWithReporting } from "@/dbqueries/user";
import { createClient } from "@/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function EditPermitPage({
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
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditPermit userId={userId} permitId={permitId} />
      </HydrationBoundary>
    </div>
  );
}
