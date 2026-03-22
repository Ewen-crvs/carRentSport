// Hook personnalisé — Géolocalisation
// Sépare la logique de localisation de l'interface
// États : loading / success / error

import { useState, useEffect, useCallback } from 'react';
import {
    getCurrentLocation,
    getDefaultLocation,
} from '../services/locationService';

/**
 * Hook pour gérer la géolocalisation
 * Retourne la position, le statut, et une fonction de rafraîchissement
 */
export const useLocation = () => {
    const [location, setLocation] = useState(getDefaultLocation());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const fetchLocation = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getCurrentLocation();

            setLocation({
                latitude: result.latitude,
                longitude: result.longitude,
            });

            if (result.error) {
                setError(result.error);
                setPermissionDenied(result.isDefault);
            } else {
                setPermissionDenied(false);
            }
        } catch (err) {
            setError('Impossible de récupérer votre position.');
            setLocation(getDefaultLocation());
            setPermissionDenied(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    return {
        location,
        loading,
        error,
        permissionDenied,
        retry: fetchLocation,
    };
};
