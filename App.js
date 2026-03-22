// Point d'entrée de l'application CarRentSport
// Providers : Auth + React Query + NativeWind + Notifications

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/context/AuthContext';
import { queryClient } from './src/config/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import { setupNotificationHandler, requestNotificationPermissions } from './src/services/notificationService';
import './global.css';

// Configurer le handler de notifications au démarrage
setupNotificationHandler();

export default function App() {
  useEffect(() => {
    // Demander les permissions de notification
    requestNotificationPermissions();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
