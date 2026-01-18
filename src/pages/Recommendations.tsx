import { useEffect, useMemo } from 'react';
import { useSeriesStore } from '../store/useSeriesStore';
import { SeriesCard } from '../components/SeriesCard';
import { Button } from '../components/ui/button';
import { Share2 } from 'lucide-react';

export default function Recommendations() {
    const { series, loadSeries } = useSeriesStore();

    useEffect(() => {
        loadSeries();
    }, [loadSeries]);

    const recommendations = useMemo(() => {
        return series
            .filter((s) => s.status === 'Finished' && s.rating >= 8)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
    }, [series]);

    const handleShareList = async () => {
        const text = `My Top Turkish Series:\n\n${recommendations
            .map((s, i) => `${i + 1}. ${s.title} (${s.rating}/10)`)
            .join('\n')}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Top Turkish Series',
                    text: text,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('List copied to clipboard!');
        }
    };

    return (
        <div className="pb-20 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">For You</h1>
                    <p className="text-sm text-muted-foreground">
                        Top rated finished series ({recommendations.length})
                    </p>
                </div>
                {recommendations.length > 0 && (
                    <Button variant="outline" size="icon" onClick={handleShareList}>
                        <Share2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <p>No recommendations yet.</p>
                    <p className="text-sm mt-2">
                        Finish some series and rate them 8+ to see them here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {recommendations.map((item) => (
                        <SeriesCard key={item.id} series={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
