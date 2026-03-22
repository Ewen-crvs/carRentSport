// Organism — CarList
// Liste de voitures utilisant FlatList — NativeWind

import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { CarCard } from '../molecules/CarCard';

export const CarList = ({
    cars,
    loading,
    error,
    onCarPress,
    isFavorite,
    onToggleFavorite,
    ListHeaderComponent,
    emptyMessage = 'Aucune voiture trouvée.',
}) => {
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <ActivityIndicator size="large" color="#8E8E93" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-6">
                <Text className="text-app-md text-error text-center">{error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <CarCard
                    car={item}
                    onPress={() => onCarPress(item)}
                    isFavorite={isFavorite?.(item.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            )}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={
                <View className="py-16 items-center">
                    <Text className="text-app-md text-text-muted text-center">{emptyMessage}</Text>
                </View>
            }
        />
    );
};
