import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchArtsIDs, fetchArts } from "../store/reducers/ArtsSlice";

export default function ArtsList() {
    const dispatch = useAppDispatch();
    const { ids, arts, isLoading, error } = useAppSelector((state) => state.arts);

    useEffect(() => {
        dispatch(fetchArtsIDs());
    }, [dispatch]);

    useEffect(() => {
        if (ids.length > 0) {
            dispatch(fetchArts());
        }
    }, [dispatch, ids]);

    return (
        <div>
            {isLoading && <div>Loading Art Gallery...</div>}
            {error && <div>Error: {error}</div>}
            <ol>
                {arts.length > 0 && arts.map(art => (
                    <li key={art.id}>{art.title}</li>
                ))}
            </ol>
        </div>
    )
}
