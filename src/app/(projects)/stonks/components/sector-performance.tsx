"use client";

import { useEffect, useState } from 'react';
import { StockService, SectorPerformance as SectorPerformanceType } from '../api/stock-service';

interface SectorPerformanceProps {
    timeframe: string;
}

export function SectorPerformance({ timeframe }: SectorPerformanceProps) {
    const [sectors, setSectors] = useState<SectorPerformanceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await StockService.getSectorPerformance(timeframe);
                // Sort by absolute performance value (descending)
                const sortedData = [...data].sort((a, b) =>
                    Math.abs(b.changePercent) - Math.abs(a.changePercent)
                );
                setSectors(sortedData);
            } catch (error) {
                console.error('Failed to fetch sector performance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeframe]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-[var(--stock-secondary)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Find the maximum absolute value for scaling
    const maxChange = Math.max(...sectors.map(sector => Math.abs(sector.changePercent)));
    const barMaxWidth = 140; // Maximum width of bars in pixels

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto pr-2">
                {sectors.map((sector) => {
                    const isPositive = sector.changePercent >= 0;
                    const width = Math.abs(sector.changePercent) / maxChange * barMaxWidth;

                    return (
                        <div key={sector.name} className="flex items-center">
                            <div className="w-32 min-w-[128px] text-sm text-slate-700">{sector.name}</div>

                            <div className="flex items-center gap-3 flex-1">
                                {/* Bar chart */}
                                <div className="flex-1 flex items-center h-6 relative">
                                    {/* Center line */}
                                    <div className="absolute left-0 right-0 h-px bg-slate-200"></div>

                                    {/* Positioning container */}
                                    <div className={`flex ${isPositive ? 'justify-start' : 'justify-end'} w-full`}>
                                        {/* Actual bar */}
                                        <div
                                            style={{ width: `${width}px` }}
                                            className={`h-4 rounded ${isPositive ? 'bg-[var(--stock-positive)]/70' : 'bg-[var(--stock-negative)]/70'}`}
                                        ></div>
                                    </div>
                                </div>

                                {/* Percentage value */}
                                <div
                                    className={`w-14 text-right text-sm font-medium ${isPositive ? 'text-[var(--stock-positive)]' : 'text-[var(--stock-negative)]'
                                        }`}
                                >
                                    {isPositive ? '+' : ''}{sector.changePercent.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 