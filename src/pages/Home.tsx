import { useEffect, useState, useMemo } from 'react';
import { useSeriesStore } from '../store/useSeriesStore';
import { SeriesCard } from '../components/SeriesCard';
import { FilterBar } from '../components/FilterBar';
import type { SeriesStatus } from '../types';
import { Button } from '../components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const { series, loadSeries, isLoading } = useSeriesStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<SeriesStatus | 'All'>('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadSeries();
    }, [loadSeries]);

    const filteredSeries = useMemo(() => {
        return series.filter((item) => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [series, searchQuery, statusFilter]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                <div className="text-sm text-muted-foreground">
                    {series.length} Series
                </div>
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            {filteredSeries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-secondary p-4">
                        <PlusCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No series found</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                        {searchQuery || statusFilter !== 'All'
                            ? "Try adjusting your filters or search query."
                            : "Start tracking your favorite Turkish series by adding one."}
                    </p>
                    {(searchQuery === '' && statusFilter === 'All') && (
                        <Button asChild className="mt-6">
                            <Link to="/add">Add First Series</Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-2 gap-4 sm:grid-cols-3"
                    : "flex flex-col gap-3"
                }>
                    {filteredSeries.map((item) => (
                        <SeriesCard key={item.id} series={item} viewMode={viewMode} />
                    ))}
                </div>
            )}
        </div>
    );
}
