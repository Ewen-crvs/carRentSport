// Hooks React Query — Réservations
// CRUD réservations avec cache et mutations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, getUserBookings, cancelBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook pour les réservations de l'utilisateur connecté
 */
export const useUserBookings = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['bookings', user?.id],
        queryFn: () => getUserBookings(user.id),
        enabled: !!user?.id,
    });
};

/**
 * Hook mutation pour créer une réservation
 */
export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: (bookingData) =>
            createBooking({ ...bookingData, userId: user.id }),
        onSuccess: () => {
            // Invalider le cache des réservations
            queryClient.invalidateQueries({ queryKey: ['bookings', user?.id] });
        },
    });
};

/**
 * Hook mutation pour annuler une réservation
 */
export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings', user?.id] });
        },
    });
};
