// Context d'authentification global
// Fournit l'état user + actions auth à toute l'app

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    login as loginService,
    register as registerService,
    logout as logoutService,
    getCurrentUser,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier la session au démarrage
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            setIsLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = useCallback(async (email, password) => {
        const userData = await loginService(email, password);
        setUser(userData);
        return userData;
    }, []);

    const signUp = useCallback(async (email, password, name) => {
        const userData = await registerService(email, password, name);
        setUser(userData);
        return userData;
    }, []);

    const signOut = useCallback(async () => {
        await logoutService();
        setUser(null);
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
