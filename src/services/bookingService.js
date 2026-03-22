// Service de réservations — Appwrite Database
// CRUD sur la collection CarBook

import { ID, Query } from 'react-native-appwrite';
import { databases, DATABASE_ID, CARBOOK_COLLECTION_ID } from '../config/appwrite';

/**
 * Créer une réservation
 * @param {Object} bookingData
 * @returns {Promise<Object>}
 */
export const createBooking = async (bookingData) => {
    try {
        const document = await databases.createDocument(
            DATABASE_ID,
            CARBOOK_COLLECTION_ID,
            ID.unique(),
            {
                userId: bookingData.userId,
                carId: bookingData.carId,
                carName: bookingData.carName,
                carImage: bookingData.carImage || '',
                pricePerDay: bookingData.pricePerDay,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                totalPrice: bookingData.totalPrice,
                status: 'confirmed',
                agencyId: bookingData.agencyId || '',
                agencyName: bookingData.agencyName || '',
                extraKm: bookingData.extraKm || 0,
                extraKmPrice: bookingData.extraKmPrice || 0,
            }
        );
        return formatBooking(document);
    } catch (error) {
        console.error('Erreur création réservation:', error);
        throw new Error('Impossible de créer la réservation.');
    }
};

/**
 * Récupérer les réservations d'un utilisateur
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
export const getUserBookings = async (userId) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            CARBOOK_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.orderDesc('$createdAt'),
            ]
        );
        return response.documents.map(formatBooking);
    } catch (error) {
        console.error('Erreur récupération réservations:', error);
        throw new Error('Impossible de charger les réservations.');
    }
};

/**
 * Récupérer une réservation par ID
 * @param {string} bookingId
 * @returns {Promise<Object>}
 */
export const getBookingById = async (bookingId) => {
    try {
        const document = await databases.getDocument(
            DATABASE_ID,
            CARBOOK_COLLECTION_ID,
            bookingId
        );
        return formatBooking(document);
    } catch (error) {
        console.error('Erreur récupération réservation:', error);
        throw new Error('Impossible de charger la réservation.');
    }
};

/**
 * Annuler une réservation
 * @param {string} bookingId
 * @returns {Promise<Object>}
 */
export const cancelBooking = async (bookingId) => {
    try {
        const document = await databases.updateDocument(
            DATABASE_ID,
            CARBOOK_COLLECTION_ID,
            bookingId,
            { status: 'cancelled' }
        );
        return formatBooking(document);
    } catch (error) {
        console.error('Erreur annulation réservation:', error);
        throw new Error('Impossible d\'annuler la réservation.');
    }
};

/**
 * Formate un document Appwrite en objet booking propre
 */
const formatBooking = (doc) => ({
    id: doc.$id,
    userId: doc.userId,
    carId: doc.carId,
    carName: doc.carName,
    carImage: doc.carImage,
    pricePerDay: doc.pricePerDay,
    startDate: doc.startDate,
    endDate: doc.endDate,
    totalPrice: doc.totalPrice,
    status: doc.status,
    agencyId: doc.agencyId,
    agencyName: doc.agencyName,
    extraKm: doc.extraKm || 0,
    extraKmPrice: doc.extraKmPrice || 0,
    createdAt: doc.$createdAt,
});
