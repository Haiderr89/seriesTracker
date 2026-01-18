import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Series, SeriesStatus } from '../types';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '../lib/utils';

const seriesSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional().or(z.literal('')),
    seasons: z.coerce.number().min(1).optional().or(z.literal('')),
    episodes: z.coerce.number().min(1).optional().or(z.literal('')),
    status: z.enum(['Watching', 'Finished', 'On Hold', 'Dropped'] as const),
    rating: z.coerce.number().min(0).max(10),
    notes: z.string().optional(),
    platform: z.string().optional(),
    tags: z.string().optional(), // Comma separated string for input
});

type SeriesFormValues = z.infer<typeof seriesSchema>;

interface SeriesFormProps {
    initialData?: Series;
    onSubmit: (data: Omit<Series, 'id' | 'createdAt' | 'updatedAt'>) => void;
    isSubmitting?: boolean;
}

export function SeriesForm({ initialData, onSubmit, isSubmitting }: SeriesFormProps) {
    const [poster, setPoster] = useState<string | undefined>(initialData?.poster);

    const form = useForm<SeriesFormValues>({
        resolver: zodResolver(seriesSchema) as any,
        defaultValues: {
            title: initialData?.title || '',
            year: initialData?.year || '' as any,
            seasons: initialData?.seasons || '' as any,
            episodes: initialData?.episodes || '' as any,
            status: initialData?.status || 'Watching',
            rating: initialData?.rating || 0,
            notes: initialData?.notes || '',
            platform: initialData?.platform || '',
            tags: initialData?.tags?.join(', ') || '',
        },
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size too large (max 5MB)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPoster(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (values: SeriesFormValues) => {
        const tags = values.tags
            ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
            : [];

        onSubmit({
            title: values.title,
            year: values.year ? Number(values.year) : undefined,
            seasons: values.seasons ? Number(values.seasons) : undefined,
            episodes: values.episodes ? Number(values.episodes) : undefined,
            status: values.status,
            rating: values.rating,
            notes: values.notes,
            platform: values.platform,
            tags,
            poster,
        });
    };

    const statuses: SeriesStatus[] = ['Watching', 'Finished', 'On Hold', 'Dropped'];

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle>{initialData ? 'Edit Series' : 'Add New Series'}</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div className="relative aspect-[2/3] w-40 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted/80 transition-colors">
                            {poster ? (
                                <>
                                    <img src={poster} alt="Preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setPoster(undefined)}
                                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Upload Poster</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title *</label>
                            <Input {...form.register('title')} placeholder="Series Title" />
                            {form.formState.errors.title && (
                                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input type="number" {...form.register('year')} placeholder="2024" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Seasons</label>
                                <Input type="number" {...form.register('seasons')} placeholder="1" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Episodes</label>
                                <Input type="number" {...form.register('episodes')} placeholder="10" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {statuses.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => {
                                            form.setValue('status', s, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                                shouldTouch: true
                                            });
                                        }}
                                        className={cn(
                                            "rounded-full border px-3 py-1 text-sm transition-colors",
                                            form.watch('status') === s
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background hover:bg-secondary"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rating (0-10)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    className="flex-1"
                                    {...form.register('rating')}
                                />
                                <span className="w-8 text-center font-medium">{form.watch('rating')}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platform</label>
                            <Input {...form.register('platform')} placeholder="Netflix, Shahid, etc." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags</label>
                            <Input {...form.register('tags')} placeholder="Drama, Action, Romance (comma separated)" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register('notes')}
                                placeholder="Write your review or notes..."
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Series'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
