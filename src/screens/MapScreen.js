// Screen — MapScreen
// Carte Mapbox des agences — avec fallback liste si natif indisponible

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Platform, ActivityIndicator, NativeModules } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocation } from '../hooks/useLocation';
import { getRentalLocations } from '../services/carService';
import { Button } from '../components/atoms/Button';
import { Caption } from '../components/atoms/Typography';
import { MAPBOX_ACCESS_TOKEN } from '../config/mapbox';

// Vérifier si le code natif Mapbox est disponible AVANT l'import
const isMapboxNativeAvailable = !!NativeModules.RNMBXModule || !!NativeModules.MGLModule;

let MapboxGL = null;
if (isMapboxNativeAvailable) {
    try {
        MapboxGL = require('@rnmapbox/maps').default;
        MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
    } catch (e) {
        MapboxGL = null;
    }
}

const MapScreen = () => {
    const insets = useSafeAreaInsets();
    const { location, loading, permissionDenied, retry } = useLocation();
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [routeCoords, setRouteCoords] = useState(null);

    useEffect(() => {
        getRentalLocations().then(setLocations);
    }, []);

    // Ouvrir dans Apple Maps / Google Maps
    const openInMaps = (loc) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${encodeURIComponent(loc.name)}@${loc.latitude},${loc.longitude}`,
            android: `geo:0,0?q=${loc.latitude},${loc.longitude}(${encodeURIComponent(loc.name)})`,
        });
        Linking.openURL(url);
    };

    // Calculer la distance
    const getDistance = (loc) => {
        if (!location) return null;
        const R = 6371;
        const dLat = ((loc.latitude - location.latitude) * Math.PI) / 180;
        const dLon = ((loc.longitude - location.longitude) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((location.latitude * Math.PI) / 180) *
            Math.cos((loc.latitude * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    // Calcul d'itinéraire Mapbox
    const calculateRoute = async (destination) => {
        if (!MapboxGL || !location) return;
        try {
            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.longitude},${location.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                setRouteCoords(data.routes[0].geometry);
            }
        } catch (err) {
            console.error('Erreur calcul itinéraire:', err);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center gap-4 bg-bg">
                <ActivityIndicator size="large" color="#8E8E93" />
                <Text className="text-app-sm text-text-muted">Localisation en cours...</Text>
            </View>
        );
    }

    // ═══════════════════════════════════════════════
    // MODE MAPBOX (development build / Xcode)
    // ═══════════════════════════════════════════════
    if (MapboxGL) {
        return (
            <View className="flex-1 bg-bg">
                <MapboxGL.MapView
                    style={{ flex: 1 }}
                    styleURL={MapboxGL.StyleURL.Light}
                    logoEnabled={false}
                    attributionEnabled={false}
                >
                    <MapboxGL.Camera
                        zoomLevel={11}
                        centerCoordinate={[location.longitude, location.latitude]}
                        animationMode="flyTo"
                        animationDuration={1000}
                    />

                    {!permissionDenied && (
                        <MapboxGL.UserLocation visible={true} animated={true} />
                    )}

                    {locations.map((loc) => (
                        <MapboxGL.PointAnnotation
                            key={loc.id}
                            id={`agency-${loc.id}`}
                            coordinate={[loc.longitude, loc.latitude]}
                            onSelected={() => {
                                setSelectedLocation(loc);
                                setRouteCoords(null);
                            }}
                        >
                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#1C1C1E', borderWidth: 3, borderColor: '#FFFFFF' }} />
                        </MapboxGL.PointAnnotation>
                    ))}

                    {routeCoords && (
                        <MapboxGL.ShapeSource id="routeSource" shape={routeCoords}>
                            <MapboxGL.LineLayer
                                id="routeLine"
                                style={{
                                    lineColor: '#1C1C1E',
                                    lineWidth: 4,
                                    lineCap: 'round',
                                    lineJoin: 'round',
                                }}
                            />
                        </MapboxGL.ShapeSource>
                    )}
                </MapboxGL.MapView>

                {/* Header overlay */}
                <View className="absolute top-0 left-0 right-0 px-5 pb-4" style={{ paddingTop: insets.top + 12 }}>
                    <View className="bg-white/[0.92] rounded-app-lg p-4 shadow-md">
                        <Text className="text-app-xl font-bold text-text-primary tracking-tight mb-0.5">Agences</Text>
                        <Caption>{locations.length} agences disponibles</Caption>
                    </View>
                </View>

                {permissionDenied && (
                    <View className="absolute left-5 right-5 bg-white/95 rounded-app-lg p-4 gap-3 shadow-md" style={{ top: insets.top + 100 }}>
                        <View className="flex-row items-start gap-2">
                            <Feather name="alert-circle" size={18} color="#FF9500" />
                            <Text className="flex-1 text-app-sm text-text-secondary leading-5">
                                Position par défaut (Paris). Activez la localisation.
                            </Text>
                        </View>
                        <Button title="Réessayer" variant="secondary" size="sm" onPress={retry} />
                    </View>
                )}

                {selectedLocation && (
                    <View className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-app-xl p-5 pt-6 gap-2 shadow-lg" style={{ paddingBottom: insets.bottom + 12 }}>
                        <Pressable
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg items-center justify-center"
                            onPress={() => { setSelectedLocation(null); setRouteCoords(null); }}
                        >
                            <Feather name="x" size={16} color="#8E8E93" />
                        </Pressable>
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight pr-10">{selectedLocation.name}</Text>
                        <View className="flex-row items-center gap-2">
                            <Feather name="map-pin" size={14} color="#8E8E93" />
                            <Text className="text-app-sm text-text-secondary flex-1">{selectedLocation.address}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Feather name="truck" size={14} color="#8E8E93" />
                            <Text className="text-app-sm text-text-secondary">{selectedLocation.cars} voitures disponibles</Text>
                        </View>
                        <View className="flex-row gap-3 mt-2">
                            <Button
                                title="Itinéraire"
                                variant="secondary"
                                onPress={() => calculateRoute({ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude })}
                                icon={<Feather name="navigation" size={16} color="#1C1C1E" />}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Ouvrir Plans"
                                onPress={() => openInMaps(selectedLocation)}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                )}
            </View>
        );
    }

    // ═══════════════════════════════════════════════
    // FALLBACK (Expo Go — pas de Mapbox natif)
    // ═══════════════════════════════════════════════
    return (
        <View className="flex-1 bg-bg">
            <View className="px-5 pb-4 bg-bg" style={{ paddingTop: insets.top + 12 }}>
                <Text className="text-app-2xl font-bold text-text-primary tracking-tight">Agences</Text>
                <Caption>{locations.length} agences disponibles</Caption>
            </View>

            <View className="mx-5 mb-4 bg-surface rounded-app-lg p-4 flex-row items-start gap-3 shadow-sm">
                <View className="w-8 h-8 rounded-full bg-warning/10 items-center justify-center mt-0.5">
                    <Feather name="info" size={16} color="#FF9500" />
                </View>
                <View className="flex-1">
                    <Text className="text-app-sm font-semibold text-text-primary mb-0.5">Mode Expo Go</Text>
                    <Text className="text-app-xs text-text-muted leading-4">
                        La carte Mapbox nécessite un dev build. Lancez avec "npx expo run:ios --device".
                    </Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            >
                {locations.map((loc) => {
                    const isSelected = selectedId === loc.id;
                    const distance = getDistance(loc);
                    return (
                        <Pressable
                            key={loc.id}
                            className={`bg-surface rounded-app-xl mb-3 overflow-hidden shadow-sm active:scale-[0.98] ${isSelected ? 'border-2 border-accent' : 'border border-border-app'}`}
                            onPress={() => setSelectedId(isSelected ? null : loc.id)}
                        >
                            <View className="p-4 flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-full bg-accent items-center justify-center">
                                    <Feather name="map-pin" size={20} color="#FFFFFF" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-app-md font-bold text-text-primary tracking-tight">{loc.name}</Text>
                                    <Text className="text-app-sm text-text-muted mt-0.5" numberOfLines={1}>{loc.address}</Text>
                                </View>
                                <View className="items-end gap-1">
                                    <View className="bg-bg px-2.5 py-1 rounded-full">
                                        <Text className="text-app-xs font-semibold text-accent">{loc.cars} voitures</Text>
                                    </View>
                                    {distance && (
                                        <Text className="text-app-xs text-text-muted">~{distance} km</Text>
                                    )}
                                </View>
                            </View>
                            {isSelected && (
                                <View className="px-4 pb-4 pt-0 gap-3">
                                    <View className="h-[1px] bg-border-app" />
                                    <View className="flex-row gap-3">
                                        <Button
                                            title="Itinéraire"
                                            variant="secondary"
                                            size="sm"
                                            icon={<Feather name="navigation" size={14} color="#1C1C1E" />}
                                            onPress={() => openInMaps(loc)}
                                            style={{ flex: 1 }}
                                        />
                                        <Button title="Voir les voitures" size="sm" onPress={() => { }} style={{ flex: 1 }} />
                                    </View>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default MapScreen;
