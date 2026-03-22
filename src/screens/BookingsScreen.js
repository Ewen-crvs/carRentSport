// Screen — BookingsScreen
// Liste des réservations de l'utilisateur

import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, Image, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useUserBookings, useCancelBooking } from '../hooks/useBookings';

const STATUS_CONFIG = {
    confirmed: { label: 'Confirmée', color: 'bg-success/15', textColor: 'text-success', icon: 'check-circle' },
    pending: { label: 'En attente', color: 'bg-warning/15', textColor: 'text-warning', icon: 'clock' },
    cancelled: { label: 'Annulée', color: 'bg-error/15', textColor: 'text-error', icon: 'x-circle' },
};

const BookingsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { data: bookings, isLoading, error, refetch } = useUserBookings();
    const cancelMutation = useCancelBooking();
    const [selectedBooking, setSelectedBooking] = React.useState(null);

    const handleCancel = useCallback((booking) => {
        Alert.alert(
            'Annuler la réservation',
            `Voulez-vous annuler la réservation de la ${booking.carName} ?`,
            [
                { text: 'Non', style: 'cancel' },
                {
                    text: 'Annuler la réservation',
                    style: 'destructive',
                    onPress: () => cancelMutation.mutate(booking.id),
                },
            ]
        );
    }, [cancelMutation]);

    const renderBooking = useCallback(({ item }) => {
        const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
        const startDate = new Date(item.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        const endDate = new Date(item.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

        return (
            <View className="bg-surface rounded-app-lg mx-5 mb-3 shadow-sm overflow-hidden">
                {/* Car Image + Info */}
                <View className="flex-row p-4">
                    {item.carImage ? (
                        <Image
                            source={{ uri: item.carImage }}
                            className="w-24 h-20 rounded-app-sm bg-car-bg"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-24 h-20 rounded-app-sm bg-car-bg items-center justify-center">
                            <Feather name="truck" size={24} color="#8E8E93" />
                        </View>
                    )}

                    <View className="flex-1 ml-4 justify-between">
                        <View>
                            <Text className="text-app-md font-bold text-text-primary" numberOfLines={1}>
                                {item.carName}
                            </Text>
                            <View className="flex-row items-center mt-1 gap-1">
                                <Feather name="calendar" size={12} color="#8E8E93" />
                                <Text className="text-app-xs text-text-muted">
                                    {startDate} → {endDate}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                            <Text className="text-app-lg font-bold text-text-primary">
                                {item.totalPrice}€
                            </Text>
                            <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${status.color}`}>
                                <Feather name={status.icon} size={12} color={status.textColor === 'text-success' ? '#34C759' : status.textColor === 'text-warning' ? '#FF9500' : '#FF3B30'} />
                                <Text className={`text-app-xs font-semibold ${status.textColor}`}>
                                    {status.label}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Agency + More Button */}
                <View className="border-t border-border-app px-4 py-3 flex-row items-center justify-between">
                    {item.agencyName ? (
                        <View className="flex-row items-center gap-1 flex-1">
                            <Feather name="map-pin" size={12} color="#8E8E93" />
                            <Text className="text-app-xs text-text-muted" numberOfLines={1}>{item.agencyName}</Text>
                        </View>
                    ) : <View />}

                    {item.status === 'confirmed' && (
                        <Pressable
                            className="p-2 -mr-2 active:opacity-50"
                            onPress={() => setSelectedBooking(item)}
                        >
                            <Feather name="more-horizontal" size={20} color="#1C1C1E" />
                        </Pressable>
                    )}
                </View>
            </View>
        );
    }, [handleCancel]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-bg items-center justify-center">
                <ActivityIndicator size="large" color="#8E8E93" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-bg">
            {/* Header */}
            <View className="px-5 pb-4 bg-bg" style={{ paddingTop: insets.top + 16 }}>
                <Text className="text-app-3xl font-bold text-text-primary tracking-tight">
                    Réservations
                </Text>
                <Text className="text-app-sm text-text-muted mt-1">
                    Vos réservations de voitures
                </Text>
            </View>

            {/* List */}
            <FlatList
                data={bookings || []}
                keyExtractor={(item) => item.id}
                renderItem={renderBooking}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center pt-20 px-10">
                        <View className="w-24 h-24 rounded-full bg-surface items-center justify-center mb-6 shadow-sm">
                            <Feather name="calendar" size={48} color="#E5E5EA" />
                        </View>
                        <Text className="text-app-xl font-bold text-text-primary mb-2">
                            Aucune réservation
                        </Text>
                        <Text className="text-app-md text-text-muted text-center leading-6">
                            Réservez votre première voiture de sport depuis l'accueil !
                        </Text>
                    </View>
                }
            />
            {/* Actions Modal */}
            <Modal
                transparent
                visible={!!selectedBooking}
                animationType="fade"
                onRequestClose={() => setSelectedBooking(null)}
            >
                <Pressable
                    className="flex-1 bg-black/40 justify-end"
                    onPress={() => setSelectedBooking(null)}
                >
                    <View className="bg-surface rounded-t-app-xl p-5 gap-2 pb-10">
                        <Text className="text-app-lg font-bold text-text-primary mb-2 text-center">
                            Options de réservation
                        </Text>

                        {selectedBooking?.agencyId && (
                            <TouchableOpacity
                                className="flex-row items-center p-4 bg-bg rounded-app-md mb-2"
                                onPress={() => {
                                    const booking = selectedBooking;
                                    setSelectedBooking(null);
                                    navigation.navigate('Route', {
                                        agencyId: booking.agencyId,
                                        agencyName: booking.agencyName,
                                        bookingId: booking.id,
                                    });
                                }}
                            >
                                <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
                                    <Feather name="map" size={20} color="#1C1C1E" />
                                </View>
                                <Text className="text-app-md font-semibold text-text-primary">Voir le trajet</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className="flex-row items-center p-4 bg-error/10 rounded-app-md"
                            onPress={() => {
                                const booking = selectedBooking;
                                setSelectedBooking(null);
                                handleCancel(booking);
                            }}
                        >
                            <View className="w-10 h-10 rounded-full bg-white/50 items-center justify-center mr-3">
                                <Feather name="x" size={20} color="#FF3B30" />
                            </View>
                            <Text className="text-app-md font-semibold text-error">Annuler la réservation</Text>
                        </TouchableOpacity>

                        <Pressable
                            className="mt-2 py-3 items-center"
                            onPress={() => setSelectedBooking(null)}
                        >
                            <Text className="text-app-md font-semibold text-text-muted">Fermer</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default BookingsScreen;
