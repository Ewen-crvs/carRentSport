// Configuration Appwrite — Client + Services
// Les variables sont lues depuis le fichier .env (préfixe EXPO_PUBLIC_)

import { Client, Account, Databases } from 'react-native-appwrite';

const client = new Client();

client
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
    .setPlatform('com.carrentsport.app');

export const account = new Account(client);
export const databases = new Databases(client);

// IDs Appwrite
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
export const CARBOOK_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CARBOOK_COLLECTION_ID;
export const CARS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CARS_COLLECTION_ID;
export const AGENCIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_AGENCIES_COLLECTION_ID;

export default client;
