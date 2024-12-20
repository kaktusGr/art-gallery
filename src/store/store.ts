import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ArtsSlice from "./reducers/ArtsSlice";

export const setupStore = configureStore({
    reducer: {
        arts: ArtsSlice.reducer,
    }
});

export type RootState = ReturnType<typeof setupStore.getState>;
export const useAppDispatch: () => typeof setupStore.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
