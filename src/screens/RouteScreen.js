// Screen — RouteScreen
// Trajet Mapbox vers l'agence de la voiture réservée

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { getAgencyById } from '../services/carService';
import { IconButton } from '../components/atoms/IconButton';
import { MAPBOX_ACCESS_TOKEN } from '../config/mapbox';

const RouteScreen = ({ route, navigation }) => {
    const { agencyId, agencyName } = route.params;
    const insets = useSafeAreaInsets();

    const [agency, setAgency] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [routeCoords, setRouteCoords] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger l'agence + position utilisateur
    useEffect(() => {
        const init = async () => {
            try {
                // Position utilisateur
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                    setUserLocation([loc.coords.longitude, loc.coords.latitude]);
                }

                // Agence
                if (agencyId) {
                    const ag = await getAgencyById(agencyId);
                    setAgency(ag);
                }
            } catch (err) {
                console.warn('Erreur init RouteScreen:', err.message);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [agencyId]);

    // Calcul de l'itinéraire
    useEffect(() => {
        if (!userLocation || !agency) return;

        const fetchRoute = async () => {
            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${agency.longitude},${agency.latitude}?geometries=geojson&overview=full&access_token=${MAPBOX_ACCESS_TOKEN}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.routes?.length > 0) {
                    const r = data.routes[0];
                    setRouteCoords({
                        type: 'Feature',
                        geometry: r.geometry,
                    });
                    setRouteInfo({
                        distance: (r.distance / 1000).toFixed(1),
                        duration: Math.round(r.duration / 60),
                    });
                }
            } catch (err) {
                console.warn('Erreur itinéraire:', err.message);
            }
        };
        fetchRoute();
    }, [userLocation, agency]);

    if (loading) {
        return (
            <View className="flex-1 bg-bg items-center justify-center">
                <ActivityIndicator size="large" color="#8E8E93" />
                <Text className="text-app-sm text-text-muted mt-3">Chargement du trajet...</Text>
            </View>
        );
    }

    if (!agency) {
        return (
            <View className="flex-1 bg-bg items-center justify-center px-10">
                <Feather name="map" size={48} color="#E5E5EA" />
                <Text className="text-app-lg font-bold text-text-primary mt-4">Agence introuvable</Text>
                <Text className="text-app-sm text-text-muted mt-2 text-center">
                    Impossible de charger les informations de l'agence.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-bg">
            {/* Carte plein écran */}
            <MapboxGL.MapView style={{ flex: 1 }} styleURL={MapboxGL.StyleURL.Street}>
                <MapboxGL.Camera
                    centerCoordinate={[agency.longitude, agency.latitude]}
                    zoomLevel={userLocation ? 11 : 14}
                    animationDuration={500}
                    bounds={userLocation && routeCoords ? {
                        ne: [
                            Math.max(userLocation[0], agency.longitude) + 0.02,
                            Math.max(userLocation[1], agency.latitude) + 0.02,
                        ],
                        sw: [
                            Math.min(userLocation[0], agency.longitude) - 0.02,
                            Math.min(userLocation[1], agency.latitude) - 0.02,
                        ],
                        paddingTop: 100,
                        paddingBottom: 250,
                        paddingLeft: 50,
                        paddingRight: 50,
                    } : undefined}
                />

                {/* Position utilisateur */}
                {userLocation && (
                    <MapboxGL.PointAnnotation id="user" coordinate={userLocation}>
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#007AFF', borderWidth: 3, borderColor: '#FFFFFF' }} />
                    </MapboxGL.PointAnnotation>
                )}

                {/* Marqueur agence */}
                <MapboxGL.PointAnnotation id="agency" coordinate={[agency.longitude, agency.latitude]}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#1C1C1E', borderWidth: 3, borderColor: '#FFFFFF' }} />
                </MapboxGL.PointAnnotation>

                {/* Tracé itinéraire */}
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
            <View className="absolute top-0 left-0 right-0 px-5" style={{ paddingTop: insets.top + 8 }}>
                <IconButton
                    name="arrow-left"
                    onPress={() => navigation.goBack()}
                    backgroundColor="rgba(255,255,255,0.95)"
                    color="#1C1C1E"
                />
            </View>

            {/* Info card en bas */}
            <View className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-lg px-5 pt-5" style={{ paddingBottom: insets.bottom + 16 }}>
                <View className="w-10 h-1 bg-border-app rounded-full self-center mb-4" />

                <Text className="text-app-lg font-bold text-text-primary tracking-tight">{agency.name}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                    <Feather name="map-pin" size={12} color="#8E8E93" />
                    <Text className="text-app-sm text-text-muted flex-1" numberOfLines={1}>{agency.address}</Text>
                </View>

                {routeInfo && (
                    <View className="flex-row gap-4 mt-4 pt-4 border-t border-border-app">
                        <View className="flex-row items-center gap-2">
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F7', alignItems: 'center', justifyContent: 'center' }}>
                                <Feather name="navigation" size={16} color="#1C1C1E" />
                            </View>
                            <View>
                                <Text className="text-app-lg font-bold text-text-primary">{routeInfo.distance} km</Text>
                                <Text className="text-app-xs text-text-muted">Distance</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F5F7', alignItems: 'center', justifyContent: 'center' }}>
                                <Feather name="clock" size={16} color="#1C1C1E" />
                            </View>
                            <View>
                                <Text className="text-app-lg font-bold text-text-primary">{routeInfo.duration} min</Text>
                                <Text className="text-app-xs text-text-muted">Durée estimée</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default RouteScreen;
