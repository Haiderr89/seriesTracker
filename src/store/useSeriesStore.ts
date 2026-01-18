import { create } from 'zustand';
import { get as getIDB, set as setIDB } from 'idb-keyval';
import type { Series } from '../types';

interface SeriesState {
    series: Series[];
    isLoading: boolean;
    addSeries: (series: Series) => Promise<void>;
    updateSeries: (series: Series) => Promise<void>;
    deleteSeries: (id: string) => Promise<void>;
    loadSeries: () => Promise<void>;
}

const STORAGE_KEY = 'series-tracker-data';

export const useSeriesStore = create<SeriesState>((set, get) => ({
    series: [],
    isLoading: true,

    loadSeries: async () => {
        try {
            const stored = await getIDB<Series[]>(STORAGE_KEY);
            if (stored) {
                set({ series: stored, isLoading: false });
            } else {
                set({ series: [], isLoading: false });
            }
        } catch (error) {
            console.error('Failed to load series:', error);
            set({ isLoading: false });
        }
    },

    addSeries: async (newSeries) => {
        const currentSeries = get().series;
        const updatedSeries = [newSeries, ...currentSeries];
        set({ series: updatedSeries });
        await setIDB(STORAGE_KEY, updatedSeries);
    },

    updateSeries: async (updatedSeries) => {
        const currentSeries = get().series;
        const newSeriesList = currentSeries.map((s) =>
            s.id === updatedSeries.id ? updatedSeries : s
        );
        set({ series: newSeriesList });
        await setIDB(STORAGE_KEY, newSeriesList);
    },

    deleteSeries: async (id) => {
        const currentSeries = get().series;
        const newSeriesList = currentSeries.filter((s) => s.id !== id);
        set({ series: newSeriesList });
        await setIDB(STORAGE_KEY, newSeriesList);
    },
}));
