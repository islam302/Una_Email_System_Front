import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";
import tokenSlice from "./functions/token";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { recipientListsApi } from "./functions/api/recipientListsApi";
import { emailTemplatesApi } from "./functions/api/emailTemplatesApi";
import { groupListsApi } from "./functions/api/groupsListsApi";
import { usersApi } from "./functions/api/usersApi";
import { recipientSingleApi } from "./functions/api/recipientSingleApi";
import { authReducer } from "./functions/auth";
import { themeApi } from "./functions/api/themeApi";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, tokenSlice);

const store = configureStore({
  reducer: {
    [recipientListsApi.reducerPath]: recipientListsApi.reducer,
    [emailTemplatesApi.reducerPath]: emailTemplatesApi.reducer,
    [groupListsApi.reducerPath]: groupListsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [recipientSingleApi.reducerPath]: recipientSingleApi.reducer,
    [themeApi.reducerPath]: themeApi.reducer,
    auth: authReducer,
    token: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      recipientListsApi.middleware,
      emailTemplatesApi.middleware,
      groupListsApi.middleware,
      usersApi.middleware,
      recipientSingleApi.middleware,
      themeApi.middleware
    ),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store, persistor };
