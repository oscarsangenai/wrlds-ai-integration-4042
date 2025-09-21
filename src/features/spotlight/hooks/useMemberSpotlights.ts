import { useQuery } from '@tanstack/react-query';
import { getMemberSpotlights } from '../api';
import { MemberSpotlight } from '../types';

export const useMemberSpotlights = () => {
  return useQuery<MemberSpotlight[], Error>({
    queryKey: ['memberSpotlights'],
    queryFn: getMemberSpotlights,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: (failureCount, error: Error & { status?: number }) => {
      const status = typeof error.status === 'number' ? error.status : undefined;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
  });
};