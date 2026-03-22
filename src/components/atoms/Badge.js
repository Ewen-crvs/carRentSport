// Atom — Badge
// Petit label arrondi pour catégories — NativeWind

import React from 'react';
import { View, Text } from 'react-native';

export const Badge = ({ label, active = false, style }) => (
    <View
        className={`px-3 py-1.5 rounded-full ${active ? 'bg-accent' : 'bg-surface-active'}`}
        style={style}
    >
        <Text className={`text-app-xs font-medium tracking-tight ${active ? 'text-text-on-dark' : 'text-text-secondary'}`}>
            {label}
        </Text>
    </View>
);
