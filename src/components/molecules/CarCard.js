// Molecule — CarCard
// Style maquette : carte sombre avec image, infos et bouton — NativeWind

import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const CarCard = ({ car, onPress, isFavorite, onToggleFavorite }) => (
    <Pressable
        onPress={onPress}
        className="rounded-app-xl overflow-hidden mb-4 shadow-md active:scale-[0.98]"
    >
        {/* Image avec fond rose */}
        <View className="relative h-40 bg-car-bg">
            <Image
                source={{ uri: car.image }}
                className="w-full h-full"
                resizeMode="cover"
            />
            {/* Bouton favori */}
            <Pressable
                onPress={(e) => {
                    e.stopPropagation?.();
                    onToggleFavorite?.(car.id);
                }}
                className="absolute top-3 right-3 w-[34px] h-[34px] rounded-full bg-black/30 items-center justify-center active:scale-[0.85]"
            >
                <Feather
                    name="heart"
                    size={16}
                    color={isFavorite ? '#FF3B30' : 'rgba(255,255,255,0.7)'}
                />
            </Pressable>
            {!car.available && (
                <View className="absolute top-3 left-3 bg-error/90 px-2.5 py-0.5 rounded-full">
                    <Text className="text-app-xs font-semibold text-white">Indisponible</Text>
                </View>
            )}
        </View>

        {/* Contenu sombre */}
        <View className="bg-surface-dark p-4 gap-2.5">
            <Text className="text-app-lg font-bold text-text-on-dark tracking-tight" numberOfLines={1}>
                {car.name}
            </Text>

            {/* Infos rapides */}
            <View className="flex-row gap-4">
                <View className="flex-row items-center gap-1">
                    <Feather name="battery-charging" size={12} color="#AEAEB2" />
                    <Text className="text-app-xs text-text-on-dark-muted">{car.horsepower} ch</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Feather name="user" size={12} color="#AEAEB2" />
                    <Text className="text-app-xs text-text-on-dark-muted">{car.seats} places</Text>
                </View>
            </View>

            {/* Prix et bouton */}
            <View className="flex-row justify-between items-center mt-1">
                <Text className="text-app-xl font-bold text-text-on-dark tracking-tight">
                    {car.price}€<Text className="text-app-sm font-normal text-text-on-dark-muted">/jour</Text>
                </Text>
                <View className="bg-surface px-5 py-2.5 rounded-full">
                    <Text className="text-app-sm font-semibold text-text-primary">Réserver</Text>
                </View>
            </View>
        </View>
    </Pressable>
);
