// Molecule — SearchBar
// Barre de recherche — NativeWind

import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const SearchBar = ({ value, onChangeText, placeholder = 'Rechercher...' }) => (
    <View className="flex-row items-center bg-surface rounded-app-lg px-4 py-3.5 gap-3 shadow-sm">
        <Feather name="search" size={18} color="#8E8E93" />
        <TextInput
            className="flex-1 text-app-md text-text-primary tracking-tight p-0"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#8E8E93"
            selectionColor="#636366"
            returnKeyType="search"
        />
        {value ? (
            <Pressable onPress={() => onChangeText('')}>
                <Feather name="x" size={16} color="#8E8E93" />
            </Pressable>
        ) : null}
    </View>
);
