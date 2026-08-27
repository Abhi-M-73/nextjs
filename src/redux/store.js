import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import snackbarReducer from './slices/snackbarSlice'

import {
    persistStore,
    persistReducer
} from 'redux-persist'

import storageSession from "redux-persist/lib/storage/session";

const rootReducer = combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
})

// 👇 config
const persistConfig = {
    key: 'root',
    storage : storageSession,
    whitelist: ['auth'],
}

// 👇 ab yaha pass karo
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
})

export const persistor = persistStore(store)