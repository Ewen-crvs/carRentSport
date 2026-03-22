#!/usr/bin/env node
// Script de seed — Peuple les collections Appwrite (agencies + cars)
// Usage : node scripts/seed.js
//
// Requis : npm install node-appwrite dotenv

const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config();

// ── Config ───────────────────────────────────
const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Clé API serveur (pas la même que le SDK client)

const db = new Databases(client);
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const CARS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CARS_COLLECTION_ID;
const AGENCIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_AGENCIES_COLLECTION_ID;

// ── Données Agences ──────────────────────────
const AGENCIES = [
    {
        name: 'CarRent Paris — Champs-Élysées',
        latitude: 48.8698,
        longitude: 2.3075,
        address: '25 Avenue des Champs-Élysées, 75008 Paris',
    },
    {
        name: 'CarRent Paris — La Défense',
        latitude: 48.8918,
        longitude: 2.2362,
        address: '1 Place de la Défense, 92800 Puteaux',
    },
    {
        name: 'CarRent Paris — Bercy',
        latitude: 48.8396,
        longitude: 2.3825,
        address: '14 Rue de Bercy, 75012 Paris',
    },
    {
        name: 'CarRent Paris — Montmartre',
        latitude: 48.8867,
        longitude: 2.3431,
        address: '5 Place du Tertre, 75018 Paris',
    },
    {
        name: 'CarRent Lyon — Part-Dieu',
        latitude: 45.7602,
        longitude: 4.8574,
        address: '17 Rue de la Part-Dieu, 69003 Lyon',
    },
];

// ── Données Voitures (agencyIndex = index dans AGENCIES) ──
const CARS = [
    {
        name: 'Porsche 911 GT3',
        brand: 'Porsche',
        category: 'Sport',
        price: 320,
        rating: 4.9,
        reviews: 128,
        seats: 2,
        transmission: 'PDK',
        fuel: 'Essence',
        horsepower: 510,
        acceleration: '3.4s',
        topSpeed: '318 km/h',
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
        description: "La Porsche 911 GT3 incarne la quintessence de la performance routière. Son flat-six atmosphérique hurle jusqu'à 9 000 tr/min.",
        available: true,
        agencyIndex: 0,
    },
    {
        name: 'Mercedes AMG GT',
        brand: 'Mercedes',
        category: 'Sport',
        price: 210,
        rating: 4.7,
        reviews: 95,
        seats: 4,
        transmission: 'Auto',
        fuel: 'Essence',
        horsepower: 510,
        acceleration: '3.9s',
        topSpeed: '290 km/h',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
        description: 'La Mercedes AMG GT allie puissance brute et raffinement. Un coupé sportif polyvalent pour toutes les occasions.',
        available: true,
        agencyIndex: 0,
    },
    {
        name: 'Mercedes-AMG GT',
        brand: 'Mercedes',
        category: 'Luxury',
        price: 380,
        rating: 4.8,
        reviews: 72,
        seats: 2,
        transmission: 'Auto',
        fuel: 'Essence',
        horsepower: 585,
        acceleration: '3.2s',
        topSpeed: '315 km/h',
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
        description: "La Mercedes-AMG GT est une grand tourisme d'exception. Son V8 biturbo délivre une puissance phénoménale avec un confort incomparable.",
        available: true,
        agencyIndex: 1,
    },
    {
        name: 'Audi RS6',
        brand: 'Audi',
        category: 'Sport',
        price: 290,
        rating: 4.6,
        reviews: 64,
        seats: 4,
        transmission: 'Auto',
        fuel: 'Essence',
        horsepower: 646,
        acceleration: '3.3s',
        topSpeed: '250 km/h',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
        description: "L'Audi RS6 repousse les limites de la performance. Silencieuse, puissante, et résolument futuriste.",
        available: true,
        agencyIndex: 1,
    },
    {
        name: 'Bugatti Chiron',
        brand: 'Bugatti',
        category: 'Supercar',
        price: 2120,
        rating: 5.0,
        reviews: 43,
        seats: 2,
        transmission: 'Auto',
        fuel: 'Essence',
        horsepower: 1500,
        acceleration: '2.5s',
        topSpeed: '450 km/h',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
        description: 'La Bugatti Chiron est une icône de la supercar moderne. Son W16 procure des sensations inégalées.',
        available: false,
        agencyIndex: 2,
    },
    {
        name: 'Tesla Model S Plaid',
        brand: 'Tesla',
        category: 'Electric',
        price: 250,
        rating: 4.5,
        reviews: 156,
        seats: 5,
        transmission: 'Auto',
        fuel: 'Électrique',
        horsepower: 1020,
        acceleration: '2.1s',
        topSpeed: '322 km/h',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
        description: "La Tesla Model S Plaid redéfinit les standards de performance électrique. L'accélération la plus brutale au monde, en silence.",
        available: true,
        agencyIndex: 3,
    },
    {
        name: 'Ferrari Roma',
        brand: 'Ferrari',
        category: 'Luxury',
        price: 450,
        rating: 4.9,
        reviews: 38,
        seats: 2,
        transmission: 'Auto',
        fuel: 'Essence',
        horsepower: 620,
        acceleration: '3.4s',
        topSpeed: '320 km/h',
        image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
        description: "La Ferrari Roma est l'élégance italienne incarnée. Un design intemporel associé à la puissance d'un V8 turbo.",
        available: true,
        agencyIndex: 4,
    },
    {
        name: 'Lamborghini Aventador S',
        brand: 'Lamborghini',
        category: 'Supercar',
        price: 1520,
        rating: 4.8,
        reviews: 29,
        seats: 2,
        transmission: 'Auto',
        fuel: 'Essence',
        horsepower: 720,
        acceleration: '2.8s',
        topSpeed: '371 km/h',
        image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&q=80',
        description: "La Lamborghini Aventador S est une arme de précision sur roues. Légèreté, aérodynamisme et puissance fusionnent en une expérience unique.",
        available: true,
        agencyIndex: 4,
    },
];

// ── Seed ─────────────────────────────────────
async function seed() {
    console.log('🚀 Seed Appwrite — Début\n');

    // Vérification des variables
    if (!DATABASE_ID || !CARS_COLLECTION_ID || !AGENCIES_COLLECTION_ID) {
        console.error('❌ Variables manquantes dans .env :');
        console.error('   EXPO_PUBLIC_APPWRITE_DATABASE_ID:', DATABASE_ID || 'MANQUANT');
        console.error('   EXPO_PUBLIC_APPWRITE_CARS_COLLECTION_ID:', CARS_COLLECTION_ID || 'MANQUANT');
        console.error('   EXPO_PUBLIC_APPWRITE_AGENCIES_COLLECTION_ID:', AGENCIES_COLLECTION_ID || 'MANQUANT');
        process.exit(1);
    }

    if (!process.env.APPWRITE_API_KEY) {
        console.error('❌ APPWRITE_API_KEY manquante dans .env');
        console.error('   Va dans Appwrite Console → Project Settings → API Keys');
        console.error('   Crée une clé avec permissions : databases.read, databases.write');
        process.exit(1);
    }

    // 1. Créer les agences
    console.log('📍 Création des agences...');
    const agencyIds = [];

    for (const agency of AGENCIES) {
        const doc = await db.createDocument(
            DATABASE_ID,
            AGENCIES_COLLECTION_ID,
            ID.unique(),
            agency
        );
        agencyIds.push(doc.$id);
        console.log(`   ✅ ${agency.name} → ${doc.$id}`);
    }

    // 2. Créer les voitures avec agencyId
    console.log('\n🚗 Création des voitures...');

    for (const car of CARS) {
        const { agencyIndex, ...carData } = car;
        carData.agencyId = agencyIds[agencyIndex];

        const doc = await db.createDocument(
            DATABASE_ID,
            CARS_COLLECTION_ID,
            ID.unique(),
            carData
        );
        console.log(`   ✅ ${car.name} → ${doc.$id} (agence: ${AGENCIES[agencyIndex].name})`);
    }

    console.log('\n🎉 Seed terminé ! ' + agencyIds.length + ' agences + ' + CARS.length + ' voitures créées.');
}

seed().catch((err) => {
    console.error('❌ Erreur seed:', err.message);
    process.exit(1);
});
