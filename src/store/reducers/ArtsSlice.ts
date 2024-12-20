import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Art {
    id: number;
    name: string;
}

interface ArtsState {
    arts: Art[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ArtsState = {
    arts: [],
    isLoading: false,
    error: null,
};

export const fetchArts = createAsyncThunk<Art[], void, { rejectValue: string }>("arts/fetchArts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11", {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch arts");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Unknown error");
        }
    })

const ArtsSlice = createSlice({
    name: "arts",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchArts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchArts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.arts = action.payload;
            })
            .addCase(fetchArts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Unknown error";
            });
    }
})

export default ArtsSlice;
