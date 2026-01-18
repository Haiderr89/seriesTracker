import { Star } from 'lucide-react';
import type { Series } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface SeriesCardProps {
    series: Series;
    viewMode?: 'grid' | 'list';
}

export function SeriesCard({ series, viewMode = 'grid' }: SeriesCardProps) {
    const statusColors = {
        Watching: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        Finished: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        'On Hold': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
        Dropped: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    };

    return (
        <Link to={`/series/${series.id}`}>
            <Card className={cn(
                "overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 border-0 shadow-md bg-card/50 backdrop-blur-sm",
                viewMode === 'list' ? "flex h-32" : "h-full"
            )}>
                <div className={cn(
                    "relative bg-muted",
                    viewMode === 'list' ? "w-24 shrink-0" : "aspect-[2/3] w-full"
                )}>
                    {series.poster ? (
                        <img
                            src={series.poster}
                            alt={series.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <Badge className={cn("backdrop-blur-md border-0", statusColors[series.status])}>
                            {series.status}
                        </Badge>
                    </div>
                </div>

                <CardContent className={cn(
                    "flex flex-col justify-between p-3",
                    viewMode === 'list' ? "flex-1 py-2" : ""
                )}>
                    <div>
                        <h3 className="font-semibold leading-tight line-clamp-1">{series.title}</h3>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{series.year || 'Unknown Year'}</span>
                            {series.seasons && <span>• {series.seasons} Seasons</span>}
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-sm font-medium">{series.rating}</span>
                        </div>
                        {series.platform && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[50%] text-right">
                                {series.platform}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
