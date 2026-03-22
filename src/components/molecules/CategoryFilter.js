// Molecule — CategoryFilter
// Filtres horizontaux de catégories — NativeWind

import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';

export const CategoryFilter = ({ categories, selected, onSelect }) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
        {categories.map((category) => {
            const isActive = category === selected;
            return (
                <Pressable
                    key={category}
                    onPress={() => onSelect(category)}
                    className={`px-[18px] py-2.5 rounded-full shadow-sm active:scale-95 ${isActive ? 'bg-accent' : 'bg-surface'}`}
                >
                    <Text className={`text-app-sm tracking-tight ${isActive ? 'text-text-on-dark font-semibold' : 'text-text-secondary font-medium'}`}>
                        {category}
                    </Text>
                </Pressable>
            );
        })}
    </ScrollView>
);
