import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Art {
    id: number
    title: string;
    artist: string;
    description: string;
    imageUrl: string;
}

interface ArtsState {
    ids: number[];
    arts: Art[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ArtsState = {
    ids: [],
    arts: [],
    isLoading: false,
    error: null,
};

export const fetchArtsIDs = createAsyncThunk<number[], void, { rejectValue: string }>(
    "arts/fetchArtsIDs",
    async (_, { rejectWithValue }) => {
        try {
            const responseIDs = await fetch(
                "https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11",
                {
                    method: "GET",
                });
            if (!responseIDs.ok) {
                throw new Error("Failed to fetch arts IDs");
            }
            const dataIDs = await responseIDs.json();
            return dataIDs.objectIDs;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("Unknown error");
        }
    })

export const fetchArts = createAsyncThunk<Art[], void, { state: { arts: ArtsState }; rejectValue: string }>(
    "arts/fetchArts",
    async (_, { getState, rejectWithValue }) => {
        const { ids } = getState().arts;
        const limitIDs = ids.slice(0, 10);

        try {
            const artPromises = limitIDs.map(async (id) => {
                const responseArt = await fetch(
                    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
                );
                if (!responseArt.ok) {
                    throw new Error(`Failed to fetch art with ID ${id}`);
                }
                const dataArt = await responseArt.json();
                return {
                    id: dataArt.objectID,
                    title: dataArt.title,
                    artist: dataArt.artistDisplayName,
                    description: dataArt.creditLine,
                    imageUrl: dataArt.primaryImage,
                } as Art;
            });

            const artsResult = await Promise.all(artPromises);
            return artsResult;
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
            .addCase(fetchArtsIDs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchArtsIDs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ids = action.payload;
            })
            .addCase(fetchArtsIDs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Unknown error";
            })
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
