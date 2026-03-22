// Screen — HomeScreen
// Écran principal — NativeWind + React Query

import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { Header } from '../components/organisms/Header';
import { CarList } from '../components/organisms/CarList';
import { SearchBar } from '../components/molecules/SearchBar';
import { CategoryFilter } from '../components/molecules/CategoryFilter';
import { useCarsByCategory, useSearchCars, useCategories } from '../hooks/useCars';
import { useFavorites } from '../hooks/useFavorites';

const HomeScreen = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');

    const { isFavorite, toggleFavorite } = useFavorites();
    const { data: categories = [] } = useCategories();

    // React Query pour les voitures
    const categoryQuery = useCarsByCategory(selectedCategory);
    const searchQueryResult = useSearchCars(searchQuery);

    // Utiliser les résultats de recherche si une query existe
    const activeQuery = searchQuery.trim() ? searchQueryResult : categoryQuery;
    const cars = activeQuery.data || [];
    const loading = activeQuery.isLoading;
    const error = activeQuery.error ? 'Impossible de charger les voitures.' : null;

    const handleCarPress = useCallback(
        (car) => {
            navigation.navigate('CarDetail', { carId: car.id });
        },
        [navigation]
    );

    const ListHeader = () => (
        <View className="gap-4 mb-5">
            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher une voiture..."
            />
            <View className="-mx-5">
                <CategoryFilter
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={(cat) => {
                        setSelectedCategory(cat);
                        setSearchQuery('');
                    }}
                />
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-bg">
            <Header title="Découvrir" subtitle="Trouvez votre voiture de rêve" />
            <CarList
                cars={cars}
                loading={loading}
                error={error}
                onCarPress={handleCarPress}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
                ListHeaderComponent={<ListHeader />}
            />
        </View>
    );
};

export default HomeScreen;
