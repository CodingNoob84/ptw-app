import { EditPermit } from '@/components/applicant/editpermit';
import { getPermitDetails } from '@/dbqueries/project';
import { getUserWithReporting, UserWithReporting } from '@/dbqueries/user';
import { createClient } from '@/supabase/server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function EditPermitPage({
  params,
}: {
  params: Promise<{ permitId: string }>;
}) {
  const { permitId } = await params;
  const supabase = await createClient();
  const queryClient = new QueryClient();

  const userData: UserWithReporting = await queryClient.ensureQueryData({
    queryKey: ['userinfo'],
    queryFn: () => getUserWithReporting(supabase),
  });

  const userId = userData.user.id;

  await queryClient.prefetchQuery({
    queryKey: ['permit', permitId],
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
