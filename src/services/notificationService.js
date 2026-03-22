// Service de notifications — avec fallback Expo Go
// Les notifications natives ne marchent pleinement que dans un dev build

import { Platform } from 'react-native';

let Notifications = null;
try {
    Notifications = require('expo-notifications');
} catch (e) {
    console.log('expo-notifications non disponible');
}

/**
 * Configure le handler de notifications
 */
export const setupNotificationHandler = () => {
    if (!Notifications) return;
    try {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowInForeground: true,
            }),
        });
    } catch (e) {
        console.log('Notification handler non configuré:', e.message);
    }
};

/**
 * Demande les permissions de notification
 */
export const requestNotificationPermissions = async () => {
    if (!Notifications) return false;
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    } catch (e) {
        console.log('Permissions notifications non disponibles:', e.message);
        return false;
    }
};

/**
 * Planifie une notification locale de réservation
 */
export const scheduleBookingNotification = async (carName, totalPrice) => {
    if (!Notifications) return;
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🚗 Réservation confirmée !',
                body: `Votre ${carName} est réservée — ${totalPrice}€ total.`,
                data: { type: 'booking', carName },
                sound: true,
            },
            trigger: { seconds: 1 },
        });
    } catch (e) {
        console.log('Notification non envoyée:', e.message);
    }
};

/**
 * Planifie une notification locale pour l'ajout aux favoris
 */
export const scheduleFavoriteNotification = async (carName) => {
    if (!Notifications) return;
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '❤️ Ajouté aux favoris',
                body: `${carName} a été ajouté à vos favoris.`,
                data: { type: 'favorite', carName },
                sound: false,
            },
            trigger: { seconds: 1 },
        });
    } catch (e) {
        console.log('Notification non envoyée:', e.message);
    }
};
