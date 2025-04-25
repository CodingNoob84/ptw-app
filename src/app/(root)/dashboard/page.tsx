import { ApplicantPage } from '@/components/applicant/applicant-page';

import { getUserWithReporting } from '@/dbqueries/user';
import { createClient } from '@/supabase/server';
import { QueryClient } from '@tanstack/react-query';

export default async function DashboardPage() {
  const supabase = await createClient();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['userinfo'],
    queryFn: () => getUserWithReporting(supabase),
  });

  return (
    <div className="max-w-5xl mx-auto">
      <ApplicantPage />
    </div>
  );
}
