// Hook personnalisé — Gestion des favoris
// Sépare la logique métier (AsyncStorage) de l'interface

import { useState, useEffect, useCallback } from 'react';
import {
    getFavoriteIds,
    toggleFavorite as toggleFavoriteService,
} from '../services/storageService';
import { getCarById } from '../services/carService';

/**
 * Hook pour gérer les voitures favorites
 * États : loading / success / error
 */
export const useFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteCars, setFavoriteCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les favoris au montage
    const loadFavorites = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const ids = await getFavoriteIds();
            setFavoriteIds(ids);

            // Charger les détails de chaque voiture favorite
            const cars = await Promise.all(
                ids.map(async (id) => {
                    try {
                        return await getCarById(id);
                    } catch {
                        return null;
                    }
                })
            );
            setFavoriteCars(cars.filter(Boolean));
        } catch (err) {
            setError('Impossible de charger les favoris.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    // Basculer l'état favori d'une voiture
    const toggleFavorite = useCallback(
        async (carId) => {
            try {
                const newState = await toggleFavoriteService(carId);

                if (newState) {
                    setFavoriteIds((prev) => [...prev, carId]);
                    try {
                        const car = await getCarById(carId);
                        setFavoriteCars((prev) => [...prev, car]);
                    } catch { }
                } else {
                    setFavoriteIds((prev) => prev.filter((id) => id !== carId));
                    setFavoriteCars((prev) => prev.filter((c) => c.id !== carId));
                }

                return newState;
            } catch (err) {
                setError('Impossible de modifier le favori.');
                throw err;
            }
        },
        []
    );

    // Vérifier si une voiture est en favori
    const isFavorite = useCallback(
        (carId) => favoriteIds.includes(carId),
        [favoriteIds]
    );

    return {
        favoriteCars,
        favoriteIds,
        loading,
        error,
        toggleFavorite,
        isFavorite,
        refresh: loadFavorites,
    };
};
