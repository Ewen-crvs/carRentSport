// Screen — LoginScreen
// Écran de connexion — design premium NativeWind

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        try {
            setLoading(true);
            setError('');
            await signIn(email.trim(), password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-bg"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center px-6 py-12">
                    {/* Logo / Header */}
                    <View className="items-center mb-12">
                        <View className="w-20 h-20 rounded-full bg-surface-dark items-center justify-center mb-6 shadow-lg">
                            <Feather name="truck" size={36} color="#FFFFFF" />
                        </View>
                        <Text className="text-app-3xl font-bold text-text-primary tracking-tight">
                            CarRentSport
                        </Text>
                        <Text className="text-app-md text-text-muted mt-2">
                            Connectez-vous pour continuer
                        </Text>
                    </View>

                    {/* Error */}
                    {error ? (
                        <View className="bg-red-50 border border-red-200 rounded-app-md p-4 mb-6">
                            <Text className="text-error text-app-sm text-center">{error}</Text>
                        </View>
                    ) : null}

                    {/* Form */}
                    <View className="gap-4 mb-8">
                        <View>
                            <Text className="text-app-sm font-semibold text-text-secondary mb-2 ml-1">Email</Text>
                            <View className="flex-row items-center bg-surface rounded-app-md px-4 border border-border-app">
                                <Feather name="mail" size={18} color="#8E8E93" />
                                <TextInput
                                    className="flex-1 py-4 px-3 text-app-md text-text-primary"
                                    placeholder="votre@email.com"
                                    placeholderTextColor="#8E8E93"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-app-sm font-semibold text-text-secondary mb-2 ml-1">Mot de passe</Text>
                            <View className="flex-row items-center bg-surface rounded-app-md px-4 border border-border-app">
                                <Feather name="lock" size={18} color="#8E8E93" />
                                <TextInput
                                    className="flex-1 py-4 px-3 text-app-md text-text-primary"
                                    placeholder="••••••••"
                                    placeholderTextColor="#8E8E93"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#8E8E93" />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Login Button */}
                    <Pressable
                        className={`rounded-app-md py-4 items-center shadow-sm ${loading ? 'bg-surface-dark/70' : 'bg-surface-dark active:bg-surface-dark-alt'}`}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-text-on-dark text-app-md font-bold">
                                Se connecter
                            </Text>
                        )}
                    </Pressable>

                    {/* Register Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-app-md text-text-muted">Pas encore de compte ? </Text>
                        <Pressable onPress={() => navigation.navigate('Register')}>
                            <Text className="text-app-md font-bold text-text-primary">
                                Créer un compte
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
