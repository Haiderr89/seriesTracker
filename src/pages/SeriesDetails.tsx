import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSeriesStore } from '../store/useSeriesStore';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, Calendar, Tv, Edit, Trash2, Share2, ArrowLeft } from 'lucide-react';
// import { cn } from '../lib/utils';

export default function SeriesDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { series, deleteSeries, loadSeries } = useSeriesStore();

    const item = series.find((s) => s.id === id);

    useEffect(() => {
        if (!item) {
            loadSeries();
        }
    }, [item, loadSeries]);

    if (!item) {
        return <div className="p-4">Series not found or loading...</div>;
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this series?')) {
            await deleteSeries(item.id);
            navigate('/');
        }
    };

    const handleShare = async () => {
        const text = `Check out ${item.title}! I rated it ${item.rating}/10. ${item.notes || ''}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title,
                    text: text,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="pb-20 space-y-6">
            {/* Header Image */}
            <div className="relative -mx-4 -mt-6 h-64 sm:h-80">
                {item.poster ? (
                    <>
                        <img
                            src={item.poster}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </>
                ) : (
                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 bg-background/50 backdrop-blur-md hover:bg-background/80"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </div>

            <div className="relative z-10 -mt-12 px-2">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold leading-tight">{item.title}</h1>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            {item.year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.year}</span>}
                            {item.seasons && <span>• {item.seasons} Seasons</span>}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md text-yellow-500 font-bold">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{item.rating}</span>
                        </div>
                        <Badge variant="outline">{item.status}</Badge>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-2">
                    <Button className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Recommend
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                        <Link to={`/series/${item.id}/edit`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Details */}
                <div className="mt-8 space-y-6">
                    {item.platform && (
                        <div className="flex items-center gap-2 text-sm">
                            <Tv className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Watch on:</span>
                            <span>{item.platform}</span>
                        </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    )}

                    {item.notes && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Notes</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {item.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
