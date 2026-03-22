// Service de géolocalisation — expo-location wrapper
// Gestion des permissions et récupération de position

import * as Location from 'expo-location';

// Position par défaut (Paris) en cas de refus de permission
const DEFAULT_LOCATION = {
    latitude: 48.8566,
    longitude: 2.3522,
};

/**
 * Demande la permission de géolocalisation
 * @returns {Promise<{ granted: boolean, message?: string }>}
 */
export const requestLocationPermission = async () => {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
            return { granted: true };
        }

        return {
            granted: false,
            message:
                'La permission de géolocalisation a été refusée. Activez-la dans les réglages pour voir les agences proches de vous.',
        };
    } catch (error) {
        return {
            granted: false,
            message: 'Impossible de vérifier les permissions de localisation.',
        };
    }
};

/**
 * Récupère la position actuelle de l'utilisateur
 * @returns {Promise<{ latitude: number, longitude: number, error?: string }>}
 */
export const getCurrentLocation = async () => {
    try {
        const permission = await requestLocationPermission();

        if (!permission.granted) {
            return {
                ...DEFAULT_LOCATION,
                error: permission.message,
                isDefault: true,
            };
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            isDefault: false,
        };
    } catch (error) {
        return {
            ...DEFAULT_LOCATION,
            error: 'Impossible de récupérer votre position. Position par défaut utilisée.',
            isDefault: true,
        };
    }
};

/**
 * Retourne la position par défaut (Paris)
 */
export const getDefaultLocation = () => ({ ...DEFAULT_LOCATION });
