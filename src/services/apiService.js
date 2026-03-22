// Service API externe — API Ninjas Cars
// Enrichissement des données voitures avec specs réelles

const API_KEY = process.env.EXPO_PUBLIC_API_NINJAS_KEY;
const BASE_URL = 'https://api.api-ninjas.com/v1/cars';

/**
 * Recherche de specs techniques d'une voiture via API Ninjas
 * @param {string} make - Marque (ex: "porsche")
 * @param {string} model - Modèle (ex: "911", optionnel)
 * @returns {Promise<Object[]>}
 */
export const fetchCarSpecs = async (make, model) => {
    if (!API_KEY) return [];

    try {
        let url = `${BASE_URL}?make=${encodeURIComponent(make.toLowerCase())}`;
        if (model) {
            url += `&model=${encodeURIComponent(model.toLowerCase())}`;
        }

        const response = await fetch(url, {
            headers: { 'X-Api-Key': API_KEY },
        });

        if (!response.ok) {
            console.warn(`API Ninjas ${response.status} pour ${make} ${model || ''}`);
            return [];
        }

        const data = await response.json();
        return data.map(formatCarSpec);
    } catch (error) {
        console.warn('API Ninjas indisponible:', error.message);
        return []; // Retourne tableau vide au lieu de throw — l'app continue
    }
};

/**
 * Recherche voitures par marque
 * @param {string} make - Marque (ex: "porsche")
 * @returns {Promise<Object[]>}
 */
export const fetchCarsByMake = async (make) => {
    if (!API_KEY) return [];

    try {
        const response = await fetch(`${BASE_URL}?make=${encodeURIComponent(make.toLowerCase())}`, {
            headers: { 'X-Api-Key': API_KEY },
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.map(formatCarSpec);
    } catch (error) {
        console.warn('API Ninjas indisponible:', error.message);
        return [];
    }
};

/**
 * Formate les données de l'API en objet propre
 */
const formatCarSpec = (spec) => ({
    make: spec.make,
    model: spec.model,
    year: spec.year,
    fuel_type: spec.fuel_type,
    transmission: spec.transmission,
    cylinders: spec.cylinders,
    displacement: spec.displacement,
    drive: spec.drive,
    class: spec.class,
});
