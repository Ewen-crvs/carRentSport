// Molecule — FeatureItem
// Icône + label dans une carte blanche — NativeWind

import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const FeatureItem = ({ icon, label, value }) => (
    <View className="flex-1 items-center bg-surface rounded-app-lg p-4 gap-1.5 shadow-sm">
        <View className="w-10 h-10 rounded-full bg-bg items-center justify-center mb-1">
            <Feather name={icon} size={18} color="#1C1C1E" />
        </View>
        <Text className="text-app-xs text-text-muted text-center">{label}</Text>
        <Text className="text-app-sm font-semibold text-text-primary tracking-tight text-center">{value}</Text>
    </View>
);
