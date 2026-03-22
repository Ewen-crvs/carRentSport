// Service de stockage local — AsyncStorage wrapper
// Gestion des favoris avec persistance locale

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@carrent_favorites';

/**
 * Récupère la liste des IDs des voitures favorites
 * @returns {Promise<string[]>}
 */
export const getFavoriteIds = async () => {
    try {
        const json = await AsyncStorage.getItem(FAVORITES_KEY);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Erreur lecture favoris:', error);
        return [];
    }
};

/**
 * Ajoute une voiture aux favoris
 * @param {string} carId
 */
export const addFavorite = async (carId) => {
    try {
        const favorites = await getFavoriteIds();
        if (!favorites.includes(carId)) {
            favorites.push(carId);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch (error) {
        console.error('Erreur ajout favori:', error);
        throw error;
    }
};

/**
 * Retire une voiture des favoris
 * @param {string} carId
 */
export const removeFavorite = async (carId) => {
    try {
        const favorites = await getFavoriteIds();
        const updated = favorites.filter((id) => id !== carId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Erreur suppression favori:', error);
        throw error;
    }
};

/**
 * Vérifie si une voiture est en favori
 * @param {string} carId
 * @returns {Promise<boolean>}
 */
export const isFavorite = async (carId) => {
    const favorites = await getFavoriteIds();
    return favorites.includes(carId);
};

/**
 * Bascule l'état favori d'une voiture
 * @param {string} carId
 * @returns {Promise<boolean>} nouvel état
 */
export const toggleFavorite = async (carId) => {
    const isFav = await isFavorite(carId);
    if (isFav) {
        await removeFavorite(carId);
        return false;
    } else {
        await addFavorite(carId);
        return true;
    }
};
