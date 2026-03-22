// Screen — ProfileScreen
// Profil utilisateur — infos, stats, déconnexion

import React from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useUserBookings } from '../hooks/useBookings';

const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const { user, signOut } = useAuth();
    const { favoriteIds } = useFavorites();
    const { data: bookings } = useUserBookings();

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (err) {
                            Alert.alert('Erreur', 'Impossible de se déconnecter.');
                        }
                    },
                },
            ]
        );
    };

    const stats = [
        { icon: 'heart', label: 'Favoris', value: favoriteIds?.length || 0 },
        { icon: 'calendar', label: 'Réservations', value: bookings?.length || 0 },
        { icon: 'check-circle', label: 'Confirmées', value: bookings?.filter(b => b.status === 'confirmed')?.length || 0 },
    ];

    return (
        <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header */}
            <View className="bg-surface-dark pt-4 pb-10 px-6 rounded-b-[32px]" style={{ paddingTop: insets.top + 16 }}>
                <Text className="text-app-xl font-bold text-text-on-dark tracking-tight mb-6">
                    Profil
                </Text>

                {/* Avatar + Info */}
                <View className="items-center">
                    <View className="w-24 h-24 rounded-full bg-surface-dark-alt items-center justify-center mb-4 border-2 border-white/20">
                        <Text className="text-app-3xl font-bold text-text-on-dark">
                            {user?.name?.[0]?.toUpperCase() || '?'}
                        </Text>
                    </View>
                    <Text className="text-app-2xl font-bold text-text-on-dark tracking-tight">
                        {user?.name || 'Utilisateur'}
                    </Text>
                    <Text className="text-app-sm text-text-on-dark-muted mt-1">
                        {user?.email || ''}
                    </Text>
                </View>
            </View>

            {/* Stats */}
            <View className="flex-row mx-6 -mt-6">
                {stats.map((stat, index) => (
                    <View key={stat.label} className="flex-1 bg-surface rounded-app-lg p-4 items-center shadow-sm mx-1">
                        <Feather name={stat.icon} size={20} color="#1C1C1E" />
                        <Text className="text-app-xl font-bold text-text-primary mt-2">
                            {stat.value}
                        </Text>
                        <Text className="text-app-xs text-text-muted mt-1">
                            {stat.label}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Info Card */}
            <View className="mx-6 mt-6">
                <Text className="text-app-lg font-bold text-text-primary mb-3 tracking-tight">
                    Informations
                </Text>
                <View className="bg-surface rounded-app-lg overflow-hidden shadow-sm">
                    <InfoRow icon="user" label="Nom" value={user?.name} />
                    <View className="h-px bg-border-app mx-4" />
                    <InfoRow icon="mail" label="Email" value={user?.email} />
                    <View className="h-px bg-border-app mx-4" />
                    <InfoRow icon="calendar" label="Membre depuis" value={formatDate(user?.createdAt)} />
                </View>
            </View>

            {/* Logout Button */}
            <View className="mx-6 mt-8">
                <Pressable
                    className="bg-error/10 rounded-app-md py-4 items-center active:bg-error/20"
                    onPress={handleLogout}
                >
                    <View className="flex-row items-center gap-2">
                        <Feather name="log-out" size={18} color="#FF3B30" />
                        <Text className="text-error text-app-md font-bold">
                            Se déconnecter
                        </Text>
                    </View>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const InfoRow = ({ icon, label, value }) => (
    <View className="flex-row items-center px-4 py-4">
        <View className="w-9 h-9 rounded-full bg-bg items-center justify-center mr-3">
            <Feather name={icon} size={16} color="#636366" />
        </View>
        <View className="flex-1">
            <Text className="text-app-xs text-text-muted">{label}</Text>
            <Text className="text-app-md text-text-primary font-medium">{value || '—'}</Text>
        </View>
    </View>
);

const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default ProfileScreen;
