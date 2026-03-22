// Atom — IconButton
// Bouton icône circulaire — NativeWind

import React from 'react';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const IconButton = ({
    name,
    onPress,
    size = 20,
    color = '#1C1C1E',
    backgroundColor = '#FFFFFF',
    showBorder = false,
    style,
}) => (
    <Pressable
        onPress={onPress}
        className={`w-11 h-11 rounded-full items-center justify-center shadow-sm active:scale-[0.93] ${showBorder ? 'border border-border-app' : 'border border-transparent'}`}
        style={[{ backgroundColor }, style]}
    >
        <Feather name={name} size={size} color={color} />
    </Pressable>
);
