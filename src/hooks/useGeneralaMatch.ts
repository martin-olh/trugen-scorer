import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generalaMatchRepository } from '../data/repositories/generalaMatchRepository';
import type { GeneralaCategory, GeneralaMatch, ID } from '../data/types';

export function useGeneralaMatches() {
  return useQuery({
    queryKey: ['generalaMatches'],
    queryFn: () => generalaMatchRepository.getAll(),
  });
}

export function useGeneralaMatch(id: ID | undefined) {
  return useQuery({
    queryKey: ['generalaMatch', id],
    queryFn: () => generalaMatchRepository.getById(id!),
    enabled: !!id,
  });
}

export function useCreateGeneralaMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (players: ID[]) => generalaMatchRepository.create(players),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generalaMatches'] }),
  });
}

export function useSetGeneralaScore(matchId: ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      playerId,
      category,
      value,
    }: {
      playerId: ID;
      category: GeneralaCategory;
      value: number;
    }) => generalaMatchRepository.setScore(matchId, playerId, category, value),
    onSuccess: (match) => queryClient.setQueryData(['generalaMatch', matchId], match),
  });
}

export function useSetGeneralaTiros(matchId: ID) {
  const queryClient = useQueryClient();
  const queryKey = ['generalaMatch', matchId];

  return useMutation({
    mutationFn: ({ playerId, value }: { playerId: ID; value: number }) =>
      generalaMatchRepository.setTiros(matchId, playerId, value),
    onMutate: async ({ playerId, value }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<GeneralaMatch>(queryKey);
      if (previous) {
        queryClient.setQueryData(queryKey, {
          ...previous,
          tiros: { ...previous.tiros, [playerId]: Math.max(0, value) },
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (match) => queryClient.setQueryData(queryKey, match),
  });
}

export function useFinishGeneralaMatch(matchId: ID) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generalaMatchRepository.finish(matchId),
    onSuccess: (match) => {
      queryClient.setQueryData(['generalaMatch', matchId], match);
      queryClient.invalidateQueries({ queryKey: ['generalaMatches'] });
    },
  });
}
