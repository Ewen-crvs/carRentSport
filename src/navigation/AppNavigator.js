// Navigation — AppNavigator
// Auth stack + Main tabs — NativeWind — Conditional auth flow

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import RouteScreen from '../screens/RouteScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingsScreen from '../screens/BookingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const BookingsStack_ = createNativeStackNavigator();

// Stack pour l'onglet Home
const HomeStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F5F5F7' },
        }}
    >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CarDetail" component={CarDetailScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Route" component={RouteScreen} />
    </Stack.Navigator>
);

// Stack pour l'onglet Bookings
const BookingsStackNav = () => (
    <BookingsStack_.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F5F5F7' },
        }}
    >
        <BookingsStack_.Screen name="BookingsList" component={BookingsScreen} />
        <BookingsStack_.Screen name="Route" component={RouteScreen} />
    </BookingsStack_.Navigator>
);

const TAB_ICONS = {
    HomeStack: 'home',
    Favorites: 'heart',
    Map: 'map',
    Bookings: 'calendar',
    Profile: 'user',
};

const TAB_LABELS = {
    HomeStack: 'Accueil',
    Favorites: 'Favoris',
    Map: 'Carte',
    Bookings: 'Réservations',
    Profile: 'Profil',
};

// Tabs principal (quand connecté)
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <Feather name={TAB_ICONS[route.name]} size={20} color={color} />
            ),
            tabBarLabel: TAB_LABELS[route.name],
            tabBarActiveTintColor: '#1C1C1E',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopColor: '#E5E5EA',
                borderTopWidth: 1,
                paddingTop: 8,
                paddingBottom: 4,
                height: 88,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 5,
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '500',
                letterSpacing: -0.2,
                marginTop: 4,
            },
        })}
    >
        <Tab.Screen name="HomeStack" component={HomeStack} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Bookings" component={BookingsStackNav} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

// Auth screens (quand pas connecté)
const AuthScreens = () => (
    <AuthStack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F5F5F7' },
        }}
    >
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
);

// Navigateur principal — condition sur auth
const AppNavigator = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 bg-bg items-center justify-center">
                <ActivityIndicator size="large" color="#8E8E93" />
            </View>
        );
    }

    return isAuthenticated ? <MainTabs /> : <AuthScreens />;
};

export default AppNavigator;
