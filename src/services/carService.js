// Service de données des voitures — Appwrite Database
// Toutes les données proviennent de la base Appwrite

import { Query } from 'react-native-appwrite';
import { databases, DATABASE_ID, CARS_COLLECTION_ID, AGENCIES_COLLECTION_ID } from '../config/appwrite';

const CATEGORIES = ['Tous', 'Sport', 'Luxury', 'Supercar', 'Electric'];

// ── Helpers ──────────────────────────────────

/** Transforme un document Appwrite en objet voiture propre */
const mapCarDoc = (doc) => ({
    id: doc.$id,
    name: doc.name,
    brand: doc.brand,
    category: doc.category,
    price: doc.price,
    rating: doc.rating,
    reviews: doc.reviews,
    seats: doc.seats,
    transmission: doc.transmission,
    fuel: doc.fuel,
    horsepower: doc.horsepower,
    acceleration: doc.acceleration,
    topSpeed: doc.topSpeed,
    image: doc.image,
    description: doc.description,
    available: doc.available,
    agencyId: doc.agencyId,
});

/** Transforme un document Appwrite en objet agence propre */
const mapAgencyDoc = (doc) => ({
    id: doc.$id,
    name: doc.name,
    latitude: doc.latitude,
    longitude: doc.longitude,
    address: doc.address,
});

// ── API publique ─────────────────────────────

export const getAllCars = async () => {
    const response = await databases.listDocuments(DATABASE_ID, CARS_COLLECTION_ID, [
        Query.limit(100),
    ]);
    return response.documents.map(mapCarDoc);
};

export const getCarById = async (id) => {
    const doc = await databases.getDocument(DATABASE_ID, CARS_COLLECTION_ID, id);
    return mapCarDoc(doc);
};

export const getCarsByCategory = async (category) => {
    if (category === 'Tous') return getAllCars();
    const response = await databases.listDocuments(DATABASE_ID, CARS_COLLECTION_ID, [
        Query.equal('category', category),
        Query.limit(100),
    ]);
    return response.documents.map(mapCarDoc);
};

export const searchCars = async (query) => {
    const q = query.toLowerCase();
    // Appwrite ne supporte pas le search full-text sur le plan gratuit,
    // on récupère tout et on filtre côté client
    const all = await getAllCars();
    return all.filter(
        (c) =>
            c.name.toLowerCase().includes(q) ||
            c.brand.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
    );
};

export const getCategories = () => {
    return Promise.resolve([...CATEGORIES]);
};

export const getRentalLocations = async () => {
    const [agenciesRes, carsRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, AGENCIES_COLLECTION_ID, [Query.limit(100)]),
        databases.listDocuments(DATABASE_ID, CARS_COLLECTION_ID, [
            Query.select(['agencyId']),
            Query.limit(500),
        ]),
    ]);

    // Compter les voitures par agence
    const carCounts = {};
    carsRes.documents.forEach((doc) => {
        carCounts[doc.agencyId] = (carCounts[doc.agencyId] || 0) + 1;
    });

    return agenciesRes.documents.map((doc) => ({
        ...mapAgencyDoc(doc),
        cars: carCounts[doc.$id] || 0,
    }));
};

export const getAgencyById = async (agencyId) => {
    const doc = await databases.getDocument(DATABASE_ID, AGENCIES_COLLECTION_ID, agencyId);
    return mapAgencyDoc(doc);
};

export const getCarsByAgency = async (agencyId) => {
    const response = await databases.listDocuments(DATABASE_ID, CARS_COLLECTION_ID, [
        Query.equal('agencyId', agencyId),
        Query.limit(100),
    ]);
    return response.documents.map(mapCarDoc);
};
