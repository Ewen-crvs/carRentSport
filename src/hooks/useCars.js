// Hooks React Query — Voitures
// Cache et gestion d'état automatiques

import { useQuery } from '@tanstack/react-query';
import { getAllCars, getCarById, getCarsByCategory, searchCars, getCategories } from '../services/carService';
import { fetchCarSpecs } from '../services/apiService';

/**
 * Hook pour toutes les voitures
 */
export const useCars = () => {
    return useQuery({
        queryKey: ['cars'],
        queryFn: getAllCars,
    });
};

/**
 * Hook pour une voiture par ID
 */
export const useCarById = (carId) => {
    return useQuery({
        queryKey: ['car', carId],
        queryFn: () => getCarById(carId),
        enabled: !!carId,
    });
};

/**
 * Hook pour voitures par catégorie
 */
export const useCarsByCategory = (category) => {
    return useQuery({
        queryKey: ['cars', 'category', category],
        queryFn: () => getCarsByCategory(category),
    });
};

/**
 * Hook pour recherche de voitures
 */
export const useSearchCars = (query) => {
    return useQuery({
        queryKey: ['cars', 'search', query],
        queryFn: () => searchCars(query),
        enabled: query.trim().length > 0,
    });
};

/**
 * Hook pour les catégories
 */
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    });
};

/**
 * Hook pour les specs API externes d'une voiture
 */
export const useCarSpecs = (make, model) => {
    return useQuery({
        queryKey: ['carSpecs', make, model],
        queryFn: () => fetchCarSpecs(make, model),
        enabled: !!make,
        staleTime: 30 * 60 * 1000, // 30 minutes (données stables)
        retry: false, // Pas de retry si l'API échoue
    });
};
