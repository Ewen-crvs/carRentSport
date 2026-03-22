// Screen — CarDetailScreen
// Détail complet d'une voiture — NativeWind

import React, { useCallback } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCarById, useCarSpecs } from '../hooks/useCars';
import { useFavorites } from '../hooks/useFavorites';
import { Button } from '../components/atoms/Button';
import { IconButton } from '../components/atoms/IconButton';
import { Body, Caption } from '../components/atoms/Typography';
import { FeatureItem } from '../components/molecules/FeatureItem';
import { scheduleFavoriteNotification } from '../services/notificationService';

const CarDetailScreen = ({ route, navigation }) => {
    const { carId } = route.params;
    const insets = useSafeAreaInsets();

    const { data: car, isLoading, error } = useCarById(carId);

    // Extraire marque et modèle (ex: "Porsche 911 GT3" → make: "porsche", model: "911")
    const carMake = car?.name?.split(' ')[0] || '';
    const carModel = car?.name?.split(' ')[1] || '';
    const { data: apiSpecs, isLoading: specsLoading } = useCarSpecs(carMake, carModel);
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleToggleFavorite = useCallback(async () => {
        if (!car) return;
        try {
            const newState = await toggleFavorite(car.id);
            if (newState) {
                await scheduleFavoriteNotification(car.name);
            }
            Alert.alert(
                newState ? 'Ajouté aux favoris' : 'Retiré des favoris',
                newState
                    ? `${car.name} a été ajouté à vos favoris.`
                    : `${car.name} a été retiré de vos favoris.`
            );
        } catch { }
    }, [car, toggleFavorite]);



    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center p-6 bg-bg">
                <ActivityIndicator size="large" color="#8E8E93" />
            </View>
        );
    }

    if (error || !car) {
        return (
            <View className="flex-1 justify-center items-center p-6 bg-bg">
                <Text className="text-app-md text-error text-center">
                    {error?.message || 'Voiture introuvable.'}
                </Text>
                <Button
                    title="Retour"
                    variant="secondary"
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 16 }}
                />
            </View>
        );
    }

    const isFav = isFavorite(car.id);

    return (
        <View className="flex-1 bg-bg">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                {/* Image hero */}
                <View className="w-full h-[300px] relative bg-car-bg">
                    <Image source={{ uri: car.image }} className="w-full h-full" resizeMode="cover" />

                    {/* Navigation overlay */}
                    <View className="absolute top-0 left-0 right-0 flex-row justify-between px-5" style={{ paddingTop: insets.top + 8 }}>
                        <IconButton
                            name="arrow-left"
                            onPress={() => navigation.goBack()}
                            backgroundColor="rgba(255,255,255,0.9)"
                            color="#1C1C1E"
                        />
                        <IconButton
                            name="heart"
                            onPress={handleToggleFavorite}
                            backgroundColor="rgba(255,255,255,0.9)"
                            color={isFav ? '#FF3B30' : '#1C1C1E'}
                        />
                    </View>
                </View>

                {/* Contenu */}
                <View className="px-5 pt-6 gap-6">
                    {/* En-tête */}
                    <View className="gap-1">
                        <Text className="text-app-3xl font-bold text-text-primary tracking-tight">{car.name}</Text>
                        <View className="flex-row items-center gap-1">
                            <Feather name="star" size={14} color="#FF9500" />
                            <Text className="text-app-sm font-semibold text-text-primary ml-0.5">{car.rating}</Text>
                            <Text className="text-app-sm text-text-muted">· {car.reviews} avis</Text>
                        </View>
                    </View>

                    {/* Prix */}
                    <View className="flex-row justify-between items-center bg-surface rounded-app-lg p-5 shadow-sm">
                        <View>
                            <Text className="text-app-sm text-text-muted mb-1">Prix de location</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-app-3xl font-bold text-text-primary tracking-tight">{car.price}€</Text>
                                <Text className="text-app-lg text-text-muted ml-0.5">/jour</Text>
                            </View>
                        </View>
                        <View className="bg-accent px-4 py-2 rounded-full">
                            <Text className="text-app-sm font-semibold text-text-on-dark">{car.category}</Text>
                        </View>
                    </View>

                    {/* Features */}
                    <View className="gap-3">
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight">Caractéristiques</Text>
                        <View className="flex-row gap-2">
                            <FeatureItem icon="zap" label="Puissance" value={`${car.horsepower} ch`} />
                            <FeatureItem icon="clock" label="0-100 km/h" value={car.acceleration} />
                            <FeatureItem icon="navigation" label="V. max" value={car.topSpeed} />
                        </View>
                        <View className="flex-row gap-2">
                            <FeatureItem icon="settings" label="Transmission" value={car.transmission} />
                            <FeatureItem icon="users" label="Places" value={`${car.seats}`} />
                            <FeatureItem icon="droplet" label="Carburant" value={car.fuel} />
                        </View>
                    </View>

                    {/* Fiche technique API Ninjas */}
                    <View className="gap-3">
                        <View className="flex-row items-center gap-2">
                            <Text className="text-app-lg font-bold text-text-primary tracking-tight">Fiche technique</Text>
                            <View className="bg-info/10 px-2 py-0.5 rounded-full">
                                <Text className="text-app-xs font-medium text-info">API</Text>
                            </View>
                        </View>
                        {specsLoading ? (
                            <View className="bg-surface rounded-app-lg p-6 items-center shadow-sm">
                                <ActivityIndicator size="small" color="#8E8E93" />
                                <Text className="text-app-xs text-text-muted mt-2">Chargement des specs...</Text>
                            </View>
                        ) : apiSpecs && apiSpecs.length > 0 ? (
                            <View className="bg-surface rounded-app-lg p-4 shadow-sm gap-0">
                                {(() => {
                                    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
                                    const driveLabels = { awd: 'Intégrale', rwd: 'Propulsion', fwd: 'Traction', '4wd': '4x4' };
                                    const drive = apiSpecs[0].drive?.toLowerCase();
                                    return [
                                        { label: 'Marque', value: cap(apiSpecs[0].make), icon: 'tag' },
                                        { label: 'Modèle', value: cap(apiSpecs[0].model), icon: 'type' },
                                        { label: 'Année', value: apiSpecs[0].year, icon: 'calendar' },
                                        { label: 'Cylindres', value: apiSpecs[0].cylinders, icon: 'circle' },
                                        { label: 'Cylindrée', value: apiSpecs[0].displacement ? `${apiSpecs[0].displacement}L` : null, icon: 'thermometer' },
                                        { label: 'Transmission', value: driveLabels[drive] || drive?.toUpperCase(), icon: 'disc' },
                                    ].filter(item => item.value);
                                })().map((item, index, arr) => (
                                    <View key={item.label} className={`flex-row items-center justify-between py-3 ${index < arr.length - 1 ? 'border-b border-border-app' : ''}`}>
                                        <View className="flex-row items-center gap-2.5">
                                            <Feather name={item.icon} size={14} color="#8E8E93" />
                                            <Text className="text-app-sm text-text-secondary">{item.label}</Text>
                                        </View>
                                        <Text className="text-app-sm font-semibold text-text-primary">{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View className="bg-surface rounded-app-lg p-5 items-center shadow-sm">
                                <Feather name="database" size={24} color="#E5E5EA" />
                                <Text className="text-app-sm text-text-muted mt-2">Specs non disponibles pour ce modèle</Text>
                            </View>
                        )}
                    </View>


                    {/* Description */}
                    <View className="gap-3">
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight">À propos</Text>
                        <View className="bg-surface rounded-app-lg p-5 shadow-sm">
                            <Body>{car.description}</Body>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Barre d'action fixe */}
            <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-4 px-5 pt-4 bg-surface border-t border-border-app shadow-lg" style={{ paddingBottom: insets.bottom + 12 }}>
                <View className="items-start">
                    <Text className="text-app-xl font-bold text-text-primary tracking-tight">{car.price}€</Text>
                    <Caption>/jour</Caption>
                </View>
                <Button
                    title={car.available ? 'Réserver maintenant' : 'Indisponible'}
                    onPress={() => navigation.navigate('Booking', { car })}
                    disabled={!car.available}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
    );
};

export default CarDetailScreen;
