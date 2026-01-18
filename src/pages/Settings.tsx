import { useSeriesStore } from '../store/useSeriesStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { Series } from '../types';

export default function Settings() {
    const { series, addSeries } = useSeriesStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(series, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `turkish-series-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target?.result as string);
                if (Array.isArray(importedData)) {
                    // Basic validation: check if items have title and status
                    const valid = importedData.every((item: any) => item.title && item.status);
                    if (!valid) {
                        alert('Invalid data format');
                        return;
                    }

                    if (confirm(`Import ${importedData.length} series? This will merge with your current library.`)) {
                        // We'll just add them one by one for now to reuse addSeries logic or we could bulk replace
                        // For MVP, let's just replace the store state if we want "Restore", or merge.
                        // The requirement says "Backup + restore", implying replacement or merge.
                        // Let's implement a merge strategy where we check IDs.
                        // Actually, simplest is to just overwrite or append.
                        // Let's append new ones (generate new IDs if needed? No, keep IDs for backup).
                        // Let's just use the store's set method directly if we exposed it, but we didn't.
                        // We'll iterate and add.

                        // Wait, addSeries generates ID? No, the caller did in AddSeries.tsx.
                        // But useSeriesStore.addSeries takes a Series object.
                        // So we can just loop.

                        // However, clearing existing might be better for "Restore".
                        // Let's ask user? No, simple is best.
                        // Let's just loop and update/add.

                        for (const item of importedData) {
                            // We need to ensure it matches Series type
                            await addSeries(item as Series);
                        }
                        alert('Import successful!');
                    }
                }
            } catch (error) {
                console.error('Import failed:', error);
                alert('Failed to parse JSON file');
            }
        };
        reader.readAsText(file);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="pb-20 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                        Backup your library or restore from a previous backup.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <Button variant="outline" onClick={handleExport} className="justify-start">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data (JSON)
                        </Button>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImport}
                            />
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Import Data (JSON)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Turkish Series Tracker v1.0.0
                        <br />
                        A PWA to track your favorite series.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
