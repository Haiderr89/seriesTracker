import { Search, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { SeriesStatus } from '../types';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: SeriesStatus | 'All';
    onStatusFilterChange: (status: SeriesStatus | 'All') => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function FilterBar({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    viewMode,
    onViewModeChange,
}: FilterBarProps) {
    const statuses: (SeriesStatus | 'All')[] = ['All', 'Watching', 'Finished', 'On Hold', 'Dropped'];

    return (
        <div className="space-y-4 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 -mx-4 px-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search series..."
                        className="pl-9 bg-secondary/50 border-0"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
                >
                    {viewMode === 'grid' ? <ListIcon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {statuses.map((status) => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? "default" : "secondary"}
                        size="sm"
                        onClick={() => onStatusFilterChange(status)}
                        className="rounded-full h-8 px-4 text-xs shrink-0"
                    >
                        {status}
                    </Button>
                ))}
            </div>
        </div>
    );
}
