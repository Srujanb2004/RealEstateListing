import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import propertyService from '../services/propertyService'
import favoriteService from '../services/favoriteService'

export function useProperties(filters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.list(filters),
  })
}

export function useProperty(id) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.get(id),
    enabled: Boolean(id),
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: () => propertyService.myListings(),
  })
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.list(),
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ propertyId, isSaved }) => {
      if (isSaved) return favoriteService.remove(propertyId)
      return favoriteService.add(propertyId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => propertyService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-listings'] }),
  })
}

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => propertyService.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
      queryClient.invalidateQueries({ queryKey: ['property', String(variables.id)] })
    },
  })
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => propertyService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-listings'] }),
  })
}
