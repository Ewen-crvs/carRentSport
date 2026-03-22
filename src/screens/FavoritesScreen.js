// Screen — FavoritesScreen
// Liste des favoris — NativeWind

import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Header } from '../components/organisms/Header';
import { CarList } from '../components/organisms/CarList';
import { useFavorites } from '../hooks/useFavorites';

const FavoritesScreen = ({ navigation }) => {
    const { favoriteCars, loading, error, isFavorite, toggleFavorite, refresh } = useFavorites();

    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const handleCarPress = useCallback(
        (car) => {
            navigation.navigate('HomeStack', {
                screen: 'CarDetail',
                params: { carId: car.id },
            });
        },
        [navigation]
    );

    const EmptyState = () => (
        <View className="flex-1 justify-center items-center px-16">
            <View className="w-24 h-24 rounded-full bg-surface items-center justify-center mb-6 shadow-sm">
                <Feather name="heart" size={48} color="#E5E5EA" />
            </View>
            <Text className="text-app-xl font-bold text-text-primary tracking-tight mb-2">
                Aucun favori
            </Text>
            <Text className="text-app-md text-text-muted text-center leading-6">
                Appuyez sur le cœur d'une voiture pour l'ajouter à vos favoris
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-bg">
            <Header title="Favoris" subtitle="Vos voitures sauvegardées" />
            {!loading && favoriteCars.length === 0 && !error ? (
                <EmptyState />
            ) : (
                <CarList
                    cars={favoriteCars}
                    loading={loading}
                    error={error}
                    onCarPress={handleCarPress}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    emptyMessage="Aucun favori pour le moment."
                />
            )}
        </View>
    );
};

export default FavoritesScreen;
