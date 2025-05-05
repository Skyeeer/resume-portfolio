"use client";

import { useEffect, useState } from 'react';
import { StockService, StockInfo } from '../api/stock-service';

export function MarketOverview() {
    const [indices, setIndices] = useState<StockInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await StockService.getMarketOverview();
                setIndices(data);
            } catch (error) {
                console.error('Failed to fetch market overview:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex justify-between items-center p-3 rounded-lg bg-slate-100">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="flex flex-col items-end gap-1">
                            <div className="h-3.5 bg-slate-200 rounded w-16"></div>
                            <div className="h-2.5 bg-slate-200 rounded w-12"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {indices.map((index) => (
                <div
                    key={index.symbol}
                    className="flex justify-between items-center p-3 rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200"
                >
                    <div>
                        <div className="font-medium text-slate-800 text-sm">{index.name}</div>
                        <div className="text-xs text-slate-500">{index.symbol}</div>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-slate-800 text-sm">{index.price.toFixed(2)}</div>
                        <div
                            className={`text-xs font-medium ${index.changePercent > 0
                                    ? 'text-[var(--stock-positive)]'
                                    : index.changePercent < 0
                                        ? 'text-[var(--stock-negative)]'
                                        : 'text-slate-400'
                                }`}
                        >
                            {index.changePercent > 0 ? '+' : ''}
                            {index.changePercent.toFixed(2)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 