export type SeriesStatus = 'Watching' | 'Finished' | 'On Hold' | 'Dropped';

export interface Series {
    id: string;
    title: string;
    year?: number;
    seasons?: number;
    episodes?: number;
    status: SeriesStatus;
    rating: number; // 0-10
    notes?: string;
    tags: string[];
    platform?: string;
    poster?: string; // Base64 or Blob URL
    createdAt: number;
    updatedAt: number;
}
