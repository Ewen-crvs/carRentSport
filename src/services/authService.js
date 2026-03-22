// Service d'authentification — Appwrite
// Register, Login, Logout, Get current user

import { ID } from 'react-native-appwrite';
import { account } from '../config/appwrite';

/**
 * Créer un nouveau compte + login automatique
 */
export const register = async (email, password, name) => {
    try {
        await account.create(ID.unique(), email, password, name);
        // Login automatique après inscription
        return await login(email, password);
    } catch (error) {
        throw formatError(error);
    }
};

/**
 * Connexion par email/mot de passe
 */
export const login = async (email, password) => {
    try {
        await account.createEmailPasswordSession(email, password);
        return await getCurrentUser();
    } catch (error) {
        throw formatError(error);
    }
};

/**
 * Déconnexion — supprime la session courante
 */
export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw formatError(error);
    }
};

/**
 * Récupère l'utilisateur connecté
 * @returns {Promise<Object|null>}
 */
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return {
            id: user.$id,
            name: user.name,
            email: user.email,
            createdAt: user.$createdAt,
        };
    } catch {
        return null;
    }
};

/**
 * Formate les erreurs Appwrite pour l'affichage
 */
const formatError = (error) => {
    const messages = {
        'user_already_exists': 'Un compte avec cet email existe déjà.',
        'invalid_credentials': 'Email ou mot de passe incorrect.',
        'general_argument_invalid': 'Veuillez vérifier les informations saisies.',
        'user_invalid_credentials': 'Email ou mot de passe incorrect.',
    };

    const message = messages[error.type] || error.message || 'Une erreur est survenue.';
    return new Error(message);
};
