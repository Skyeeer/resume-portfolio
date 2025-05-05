"use client";

import { useEffect, useState } from 'react';
import { StockService, StockInfo } from '../api/stock-service';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export function TopMovers() {
    const [stocks, setStocks] = useState<StockInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await StockService.getTopMovers();
                setStocks(data);
            } catch (error) {
                console.error('Failed to fetch top movers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex justify-between items-center p-3">
                        <div className="flex space-x-3 items-center">
                            <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                            <div>
                                <div className="h-3.5 bg-slate-200 rounded w-20 mb-1.5"></div>
                                <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                            </div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Split stocks into gainers and losers
    const gainers = stocks.filter(stock => stock.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent)
        .slice(0, 3);

    const losers = stocks.filter(stock => stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 3);

    if (!gainers.length && !losers.length) {
        return <div className="text-center text-sm text-slate-500 py-4">No movers data available</div>;
    }

    return (
        <div>
            {/* Section: Top Gainers */}
            {gainers.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-sm text-slate-700 mb-2 border-b border-slate-200 pb-1">
                        Top Gainers
                    </h3>
                    <div className="space-y-2.5">
                        {gainers.map((stock) => (
                            <div
                                key={stock.symbol}
                                className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
                            >
                                <div>
                                    <div className="font-medium text-slate-800 text-sm">{stock.name}</div>
                                    <div className="text-xs text-slate-500">{stock.symbol}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-semibold text-sm text-slate-800">{stock.price.toFixed(2)}</div>
                                    <div className="flex items-center text-xs font-medium text-[var(--stock-positive)]">
                                        <FaArrowUp className="mr-1 w-2.5 h-2.5" />
                                        {stock.changePercent.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section: Top Losers */}
            {losers.length > 0 && (
                <div>
                    <h3 className="font-semibold text-sm text-slate-700 mb-2 border-b border-slate-200 pb-1">
                        Top Losers
                    </h3>
                    <div className="space-y-2.5">
                        {losers.map((stock) => (
                            <div
                                key={stock.symbol}
                                className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
                            >
                                <div>
                                    <div className="font-medium text-slate-800 text-sm">{stock.name}</div>
                                    <div className="text-xs text-slate-500">{stock.symbol}</div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-semibold text-sm text-slate-800">{stock.price.toFixed(2)}</div>
                                    <div className="flex items-center text-xs font-medium text-[var(--stock-negative)]">
                                        <FaArrowDown className="mr-1 w-2.5 h-2.5" />
                                        {Math.abs(stock.changePercent).toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 