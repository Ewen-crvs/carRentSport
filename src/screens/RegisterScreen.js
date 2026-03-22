// Screen — RegisterScreen
// Écran d'inscription — design premium NativeWind

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { signUp } = useAuth();

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await signUp(email.trim(), password, name.trim());
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
                    {/* Header */}
                    <View className="items-center mb-10">
                        <View className="w-20 h-20 rounded-full bg-surface-dark items-center justify-center mb-6 shadow-lg">
                            <Feather name="user-plus" size={36} color="#FFFFFF" />
                        </View>
                        <Text className="text-app-3xl font-bold text-text-primary tracking-tight">
                            Créer un compte
                        </Text>
                        <Text className="text-app-md text-text-muted mt-2">
                            Rejoignez CarRentSport
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
                            <Text className="text-app-sm font-semibold text-text-secondary mb-2 ml-1">Nom complet</Text>
                            <View className="flex-row items-center bg-surface rounded-app-md px-4 border border-border-app">
                                <Feather name="user" size={18} color="#8E8E93" />
                                <TextInput
                                    className="flex-1 py-4 px-3 text-app-md text-text-primary"
                                    placeholder="Jean Dupont"
                                    placeholderTextColor="#8E8E93"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

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
                                    placeholder="Min. 8 caractères"
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

                        <View>
                            <Text className="text-app-sm font-semibold text-text-secondary mb-2 ml-1">Confirmer le mot de passe</Text>
                            <View className="flex-row items-center bg-surface rounded-app-md px-4 border border-border-app">
                                <Feather name="shield" size={18} color="#8E8E93" />
                                <TextInput
                                    className="flex-1 py-4 px-3 text-app-md text-text-primary"
                                    placeholder="••••••••"
                                    placeholderTextColor="#8E8E93"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Register Button */}
                    <Pressable
                        className={`rounded-app-md py-4 items-center shadow-sm ${loading ? 'bg-surface-dark/70' : 'bg-surface-dark active:bg-surface-dark-alt'}`}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-text-on-dark text-app-md font-bold">
                                Créer mon compte
                            </Text>
                        )}
                    </Pressable>

                    {/* Login Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-app-md text-text-muted">Déjà un compte ? </Text>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text className="text-app-md font-bold text-text-primary">
                                Se connecter
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;
