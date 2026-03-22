// Atom — Button
// Style maquette : boutons noirs arrondis ou outlined — NativeWind

import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

const VARIANTS = {
    primary: { bg: 'bg-accent', text: 'text-text-on-dark', border: 'border-accent' },
    secondary: { bg: 'bg-transparent', text: 'text-text-primary', border: 'border-border-app' },
    ghost: { bg: 'bg-transparent', text: 'text-text-secondary', border: 'border-transparent' },
    light: { bg: 'bg-surface', text: 'text-text-primary', border: 'border-border-app' },
};

const COLORS = {
    primary: '#FFFFFF',
    secondary: '#1C1C1E',
    ghost: '#636366',
    light: '#1C1C1E',
};

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    style,
}) => {
    const v = VARIANTS[variant] || VARIANTS.primary;
    const isSmall = size === 'sm';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className={`flex-row items-center justify-center rounded-full border ${v.bg} ${v.border} ${isSmall ? 'py-2.5 px-4' : 'py-3.5 px-6'} ${disabled ? 'opacity-40' : 'opacity-100'} active:scale-[0.97]`}
            style={style}
        >
            {loading ? (
                <ActivityIndicator size="small" color={COLORS[variant] || COLORS.primary} />
            ) : (
                <>
                    {icon}
                    <Text className={`${v.text} ${isSmall ? 'text-app-sm' : 'text-app-md'} font-semibold tracking-tight ${icon ? 'ml-2' : ''}`}>
                        {title}
                    </Text>
                </>
            )}
        </Pressable>
    );
};
