// Screen — BookingScreen
// Écran intermédiaire de réservation : dates, km, carte agence, récap prix

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
    Pressable,
    Platform,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateBooking } from '../hooks/useBookings';
import { getAgencyById } from '../services/carService';
import { scheduleBookingNotification } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/atoms/Button';
import { IconButton } from '../components/atoms/IconButton';

const INCLUDED_KM = 200;
const PRICE_PER_EXTRA_KM = 2;

const BookingScreen = ({ route, navigation }) => {
    const { car } = route.params;
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const createBooking = useCreateBooking();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // Demain
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [extraKm, setExtraKm] = useState(0);
    const [agency, setAgency] = useState(null);
    const [loadingAgency, setLoadingAgency] = useState(true);

    const onDateChange = (event, selectedDate, type) => {
        if (type === 'start') {
            setShowStartPicker(Platform.OS === 'ios');
            if (selectedDate) setStartDate(selectedDate);
        } else {
            setShowEndPicker(Platform.OS === 'ios');
            if (selectedDate) setEndDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    // Charger l'agence
    useEffect(() => {
        if (car.agencyId) {
            getAgencyById(car.agencyId)
                .then(setAgency)
                .catch(() => setAgency(null))
                .finally(() => setLoadingAgency(false));
        } else {
            setLoadingAgency(false);
        }
    }, [car.agencyId]);

    // Calculs prix
    const diffDays = (() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    })();

    const rentalPrice = diffDays * car.price;
    const extraKmPrice = extraKm * PRICE_PER_EXTRA_KM;
    const totalPrice = rentalPrice + extraKmPrice;

    const handleConfirm = useCallback(async () => {
        if (!user) {
            Alert.alert('Connexion requise', 'Vous devez être connecté pour réserver.');
            return;
        }
        if (diffDays <= 0) {
            Alert.alert('Dates invalides', 'La date de fin doit être après la date de début.');
            return;
        }

        try {
            const booking = await createBooking.mutateAsync({
                carId: car.id,
                carName: car.name,
                carImage: car.image,
                pricePerDay: car.price,
                pricePerDay: car.price,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalPrice,
                extraKm,
                extraKmPrice,
                agencyId: car.agencyId || '',
                agencyName: agency?.name || '',
            });

            await scheduleBookingNotification(car.name, totalPrice);

            Alert.alert(
                '🚗 Réservation confirmée !',
                `${car.name} réservée pour ${diffDays} jour${diffDays > 1 ? 's' : ''} — ${totalPrice}€ total.`,
                [{
                    text: 'Voir le trajet',
                    onPress: () => navigation.replace('Route', {
                        agencyId: car.agencyId,
                        agencyName: agency?.name,
                        bookingId: booking?.id,
                    }),
                }]
            );
        } catch (err) {
            Alert.alert('Erreur', err.message || 'Impossible de créer la réservation.');
        }
    }, [car, user, startDate, endDate, diffDays, totalPrice, extraKm, extraKmPrice, agency, createBooking, navigation]);

    return (
        <View className="flex-1 bg-bg">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                {/* Header */}
                <View className="px-5 flex-row items-center gap-3" style={{ paddingTop: insets.top + 8 }}>
                    <IconButton
                        name="arrow-left"
                        onPress={() => navigation.goBack()}
                        backgroundColor="rgba(0,0,0,0.05)"
                        color="#1C1C1E"
                    />
                    <View className="flex-1">
                        <Text className="text-app-xl font-bold text-text-primary tracking-tight">Réservation</Text>
                        <Text className="text-app-sm text-text-muted">{car.name}</Text>
                    </View>
                </View>

                <View className="px-5 pt-6 gap-6">
                    {/* Dates */}
                    <View className="gap-3">
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight">Dates de location</Text>
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Text className="text-app-xs text-text-muted mb-1.5 ml-1">Date début</Text>
                                <Pressable
                                    onPress={() => setShowStartPicker(true)}
                                    className="flex-row items-center bg-surface rounded-app-md px-4 py-3.5 border border-border-app"
                                >
                                    <Feather name="calendar" size={16} color="#8E8E93" />
                                    <Text className="ml-2 text-app-sm text-text-primary">
                                        {formatDate(startDate)}
                                    </Text>
                                </Pressable>
                                {showStartPicker && (
                                    Platform.OS === 'ios' ? (
                                        <Modal transparent animationType="fade" visible={showStartPicker} onRequestClose={() => setShowStartPicker(false)}>
                                            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowStartPicker(false)}>
                                                <View className="bg-surface rounded-app-lg p-4 w-[90%]" onStartShouldSetResponder={() => true}>
                                                    <Text className="text-app-lg font-bold text-text-primary mb-4 text-center">Date de début</Text>
                                                    <DateTimePicker
                                                        value={startDate}
                                                        mode="date"
                                                        display="inline"
                                                        onChange={(e, d) => onDateChange(e, d, 'start')}
                                                        minimumDate={new Date()}
                                                        accentColor="#1C1C1E"
                                                        themeVariant="light"
                                                        style={{ height: 320, width: 320, alignSelf: 'center' }}
                                                    />
                                                    <Button title="Valider" onPress={() => setShowStartPicker(false)} style={{ marginTop: 16, width: '100%' }} />
                                                </View>
                                            </Pressable>
                                        </Modal>
                                    ) : (
                                        <DateTimePicker
                                            value={startDate}
                                            mode="date"
                                            display="default"
                                            onChange={(e, d) => onDateChange(e, d, 'start')}
                                            minimumDate={new Date()}
                                        />
                                    )
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className="text-app-xs text-text-muted mb-1.5 ml-1">Date fin</Text>
                                <Pressable
                                    onPress={() => setShowEndPicker(true)}
                                    className="flex-row items-center bg-surface rounded-app-md px-4 py-3.5 border border-border-app"
                                >
                                    <Feather name="calendar" size={16} color="#8E8E93" />
                                    <Text className="ml-2 text-app-sm text-text-primary">
                                        {formatDate(endDate)}
                                    </Text>
                                </Pressable>
                                {showEndPicker && (
                                    Platform.OS === 'ios' ? (
                                        <Modal transparent animationType="fade" visible={showEndPicker} onRequestClose={() => setShowEndPicker(false)}>
                                            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }} onPress={() => setShowEndPicker(false)}>
                                                <View className="bg-surface rounded-app-lg p-4 w-[90%]" onStartShouldSetResponder={() => true}>
                                                    <Text className="text-app-lg font-bold text-text-primary mb-4 text-center">Date de fin</Text>
                                                    <DateTimePicker
                                                        value={endDate}
                                                        mode="date"
                                                        display="inline"
                                                        onChange={(e, d) => onDateChange(e, d, 'end')}
                                                        minimumDate={startDate}
                                                        accentColor="#1C1C1E"
                                                        themeVariant="light"
                                                        style={{ height: 320, width: 320, alignSelf: 'center' }}
                                                    />
                                                    <Button title="Valider" onPress={() => setShowEndPicker(false)} style={{ marginTop: 16, width: '100%' }} />
                                                </View>
                                            </Pressable>
                                        </Modal>
                                    ) : (
                                        <DateTimePicker
                                            value={endDate}
                                            mode="date"
                                            display="default"
                                            onChange={(e, d) => onDateChange(e, d, 'end')}
                                            minimumDate={startDate}
                                        />
                                    )
                                )}
                            </View>
                        </View>
                        {diffDays > 0 && (
                            <Text className="text-app-sm text-text-muted ml-1">
                                {diffDays} jour{diffDays > 1 ? 's' : ''} × {car.price}€ = {rentalPrice}€
                            </Text>
                        )}
                    </View>

                    {/* Kilomètres supplémentaires */}
                    <View className="gap-3">
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight">Kilomètres supplémentaires</Text>
                        <View className="bg-surface rounded-app-lg p-5 shadow-sm">
                            <View className="flex-row items-center gap-1.5 mb-4">
                                <Feather name="info" size={14} color="#8E8E93" />
                                <Text className="text-app-sm text-text-muted">{INCLUDED_KM} km inclus dans la location</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-app-sm text-text-secondary">Km en plus</Text>
                                <Text className="text-app-lg font-bold text-text-primary">+{extraKm} km</Text>
                            </View>
                            <View className="flex-row items-center justify-center gap-4">
                                <Pressable
                                    onPress={() => setExtraKm(Math.max(0, extraKm - 50))}
                                    className="w-12 h-12 rounded-full bg-bg items-center justify-center border border-border-app active:bg-border-app"
                                >
                                    <Feather name="minus" size={20} color="#1C1C1E" />
                                </Pressable>
                                <View className="flex-1 h-2 bg-border-app rounded-full overflow-hidden">
                                    <View
                                        style={{ width: `${(extraKm / 800) * 100}%` }}
                                        className="h-full bg-text-primary rounded-full"
                                    />
                                </View>
                                <Pressable
                                    onPress={() => setExtraKm(Math.min(800, extraKm + 50))}
                                    className="w-12 h-12 rounded-full bg-bg items-center justify-center border border-border-app active:bg-border-app"
                                >
                                    <Feather name="plus" size={20} color="#1C1C1E" />
                                </Pressable>
                            </View>
                            <View className="flex-row justify-between mt-3">
                                <Text className="text-app-xs text-text-muted">0 km</Text>
                                <Text className="text-app-xs text-text-muted">800 km</Text>
                            </View>
                            {extraKm > 0 && (
                                <View className="flex-row items-center gap-1.5 mt-3 pt-3 border-t border-border-app">
                                    <Feather name="alert-circle" size={14} color="#FF9500" />
                                    <Text className="text-app-sm text-warning">
                                        {extraKm} km × {PRICE_PER_EXTRA_KM}€ = {extraKmPrice}€
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Carte agence */}
                    <View className="gap-3">
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight">Agence de retrait</Text>
                        {loadingAgency ? (
                            <View className="bg-surface rounded-app-lg h-[200px] items-center justify-center shadow-sm">
                                <ActivityIndicator size="small" color="#8E8E93" />
                            </View>
                        ) : agency ? (
                            <View className="bg-surface rounded-app-lg overflow-hidden shadow-sm">
                                <View style={{ height: 180 }} className="rounded-t-app-lg overflow-hidden">
                                    <MapboxGL.MapView
                                        style={{ flex: 1 }}
                                        styleURL={MapboxGL.StyleURL.Street}
                                        scrollEnabled={false}
                                        pitchEnabled={false}
                                        rotateEnabled={false}
                                        zoomEnabled={false}
                                    >
                                        <MapboxGL.Camera
                                            centerCoordinate={[agency.longitude, agency.latitude]}
                                            zoomLevel={14}
                                            animationDuration={0}
                                        />
                                        <MapboxGL.PointAnnotation
                                            id="agency"
                                            coordinate={[agency.longitude, agency.latitude]}
                                        >
                                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#1C1C1E', borderWidth: 3, borderColor: '#FFFFFF' }} />
                                        </MapboxGL.PointAnnotation>
                                    </MapboxGL.MapView>
                                </View>
                                <View className="p-4 gap-1">
                                    <Text className="text-app-md font-semibold text-text-primary">{agency.name}</Text>
                                    <View className="flex-row items-center gap-1">
                                        <Feather name="map-pin" size={12} color="#8E8E93" />
                                        <Text className="text-app-xs text-text-muted">{agency.address}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="bg-surface rounded-app-lg p-5 items-center shadow-sm">
                                <Feather name="map" size={24} color="#E5E5EA" />
                                <Text className="text-app-sm text-text-muted mt-2">Agence non disponible</Text>
                            </View>
                        )}
                    </View>

                    {/* Récapitulatif */}
                    <View className="bg-surface rounded-app-lg p-5 shadow-sm gap-3">
                        <Text className="text-app-lg font-bold text-text-primary tracking-tight">Récapitulatif</Text>
                        <View className="gap-2">
                            <View className="flex-row justify-between">
                                <Text className="text-app-sm text-text-secondary">Location ({diffDays || '—'} jour{diffDays > 1 ? 's' : ''})</Text>
                                <Text className="text-app-sm font-semibold text-text-primary">{rentalPrice}€</Text>
                            </View>
                            {extraKmPrice > 0 && (
                                <View className="flex-row justify-between">
                                    <Text className="text-app-sm text-text-secondary">Km supplémentaires</Text>
                                    <Text className="text-app-sm font-semibold text-warning">+{extraKmPrice}€</Text>
                                </View>
                            )}
                            <View className="flex-row justify-between pt-3 border-t border-border-app">
                                <Text className="text-app-md font-bold text-text-primary">Total</Text>
                                <Text className="text-app-xl font-bold text-text-primary">{totalPrice}€</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Barre d'action fixe */}
            <View className="absolute bottom-0 left-0 right-0 px-5 pt-4 bg-surface border-t border-border-app shadow-lg" style={{ paddingBottom: insets.bottom + 12 }}>
                <Button
                    title={diffDays > 0 ? `Confirmer — ${totalPrice}€` : 'Sélectionnez des dates'}
                    onPress={handleConfirm}
                    disabled={diffDays <= 0 || !car.available}
                    loading={createBooking.isPending}
                />
            </View>
        </View>
    );
};

export default BookingScreen;
