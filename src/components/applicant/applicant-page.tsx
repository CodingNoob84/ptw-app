'use client';
import { PermitCard } from '@/components/applicant/permit-card';
import { PermitsSkeleton } from '@/components/applicant/permits-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserPermits } from '@/dbqueries/project';
import { getUserWithReporting } from '@/dbqueries/user';
import { createClient } from '@/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ApplicantPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [filter, setFilter] = useState('all');

  const { data: userdata } = useQuery({
    queryKey: ['userinfo'],
    queryFn: () => getUserWithReporting(supabase),
  });
  const userId = userdata?.user?.id as string;
  const { data: permits, isLoading } = useQuery({
    queryKey: ['allpermits', userId],
    queryFn: () => getUserPermits(userId, supabase),
    enabled: !!userId,
  });

  const filteredPermits = permits?.filter((permit) => {
    if (filter === 'all') return true;
    if (filter === 'sa-pending') return !permit.issa_completed;
    if (filter === 'sa-approved') return permit.issa_completed;
    if (filter === 'manager-pending') return !permit.ismanager_completed;
    if (filter === 'manager-approved') return permit.ismanager_completed;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My Permits</h1>
          {filteredPermits && (
            <Badge variant="secondary" className="text-sm">
              {filteredPermits && filteredPermits.length}{' '}
              {filteredPermits?.length === 1 ? 'Permit' : 'Permits'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter permits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Permits</SelectItem>
              <SelectItem value="sa-pending">SA Pending</SelectItem>
              <SelectItem value="sa-approved">SA Approved</SelectItem>
              <SelectItem value="manager-pending">Manager Pending</SelectItem>
              <SelectItem value="manager-approved">Manager Approved</SelectItem>
            </SelectContent>
          </Select>
          {userdata?.user.role == 'applicant' && (
            <Button
              onClick={() => router.push('/dashboard/create')}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Permit
            </Button>
          )}
        </div>
      </div>

      {isLoading && !permits ? (
        <PermitsSkeleton />
      ) : filteredPermits && filteredPermits.length > 0 ? (
        <div className="space-y-4">
          {filteredPermits.map((permit) => (
            <PermitCard key={permit.permit_id} permit={permit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No permits found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {filter !== 'all'
              ? 'No permits match the selected filter'
              : 'Create your first permit to get started'}
          </p>
        </div>
      )}
    </div>
  );
};
