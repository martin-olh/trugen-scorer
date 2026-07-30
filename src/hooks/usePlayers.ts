import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { playerRepository } from '../data/repositories/playerRepository';

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: () => playerRepository.getAll(),
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => playerRepository.create(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}

export function useRemovePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => playerRepository.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}
