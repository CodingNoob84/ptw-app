import { Header } from "@/components/layouts/header";
import { getUserWithReporting } from "@/dbqueries/user";

import { createClient } from "@/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["userinfo"],
    queryFn: () => getUserWithReporting(supabase),
  });
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {children}
        </HydrationBoundary>
      </main>
    </div>
  );
}
