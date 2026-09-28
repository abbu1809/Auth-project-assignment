import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../services/api';

export const useProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: productsApi.list });

export const useProductMutations = () => {
  const queryClient = useQueryClient();
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ['products'] });
  return {
    create: useMutation({
      mutationFn: ({ values, files }) => productsApi.create(values, files),
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: ({ id, values, files }) =>
        productsApi.update(id, values, files),
      onSuccess: refresh,
    }),
    remove: useMutation({ mutationFn: productsApi.remove, onSuccess: refresh }),
  };
};
