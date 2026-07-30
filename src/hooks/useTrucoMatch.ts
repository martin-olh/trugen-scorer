import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trucoMatchRepository } from '../data/repositories/trucoMatchRepository';
import type { ID, TrucoMatch, TrucoTarget } from '../data/types';
import { applyTrucoScore } from '../services/trucoTally';

export function useTrucoMatches() {
  return useQuery({
    queryKey: ['trucoMatches'],
    queryFn: () => trucoMatchRepository.getAll(),
  });
}

export function useTrucoMatch(id: ID | undefined) {
  return useQuery({
    queryKey: ['trucoMatch', id],
    queryFn: () => trucoMatchRepository.getById(id!),
    enabled: !!id,
  });
}

export function useCreateTrucoMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ players, targetScore }: { players: [ID, ID]; targetScore: TrucoTarget }) =>
      trucoMatchRepository.create(players, targetScore),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trucoMatches'] }),
  });
}

export function useSetTrucoScore(matchId: ID) {
  const queryClient = useQueryClient();
  const queryKey = ['trucoMatch', matchId];

  return useMutation({
    mutationFn: ({ playerId, score }: { playerId: ID; score: number }) =>
      trucoMatchRepository.setScore(matchId, playerId, score),
    onMutate: async ({ playerId, score }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TrucoMatch>(queryKey);
      if (previous) {
        queryClient.setQueryData(queryKey, applyTrucoScore(previous, playerId, score));
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSuccess: (match) => {
      queryClient.setQueryData(queryKey, match);
      queryClient.invalidateQueries({ queryKey: ['trucoMatches'] });
    },
  });
}
