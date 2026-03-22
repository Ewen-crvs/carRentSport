// Atom — Typography
// Hiérarchie visuelle — NativeWind

import React from 'react';
import { Text } from 'react-native';

export const Title = ({ children, style }) => (
    <Text className="text-app-2xl font-bold text-text-primary tracking-tight" style={style}>{children}</Text>
);

export const Subtitle = ({ children, style }) => (
    <Text className="text-app-lg font-semibold text-text-primary tracking-tight" style={style}>{children}</Text>
);

export const Body = ({ children, style }) => (
    <Text className="text-app-md text-text-secondary leading-6 tracking-tight" style={style}>{children}</Text>
);

export const Caption = ({ children, style }) => (
    <Text className="text-app-sm text-text-muted tracking-tight" style={style}>{children}</Text>
);

export const Display = ({ children, style }) => (
    <Text className="text-app-display font-bold text-text-primary tracking-tighter" style={style}>{children}</Text>
);
