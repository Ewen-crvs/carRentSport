// Organism — Header
// En-tête de l'application — NativeWind

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Title, Caption } from '../atoms/Typography';

export const Header = ({ title, subtitle, rightAction }) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-row justify-between items-end px-5 pb-4 bg-bg"
            style={{ paddingTop: insets.top + 12 }}
        >
            <View className="flex-1 gap-1">
                <Caption>{subtitle}</Caption>
                <Title>{title}</Title>
            </View>
            {rightAction && <View className="ml-3">{rightAction}</View>}
        </View>
    );
};
