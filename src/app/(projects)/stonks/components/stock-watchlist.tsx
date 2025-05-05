"use client";

import { useEffect, useState } from 'react';
import { StockService, StockInfo } from '../api/stock-service';
import { FaStar, FaTrash } from 'react-icons/fa';

interface StockWatchlistProps {
    onRemoveStock?: (symbol: string) => void;
    refreshTrigger?: number;
}

// Storage keys for localStorage
const WATCHLIST_STORAGE_KEY = 'stonks-watchlist';

export function StockWatchlist({ onRemoveStock, refreshTrigger = 0 }: StockWatchlistProps) {
    const [stocks, setStocks] = useState<StockInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Try to load stocks from localStorage first
                const savedWatchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
                let data: StockInfo[] = [];

                if (savedWatchlist) {
                    // If we have saved data, use it
                    data = JSON.parse(savedWatchlist);

                    // If we have data in localStorage, refresh it with fresh quotes
                    if (data.length > 0) {
                        try {
                            // Get fresh data for all stocks in watchlist
                            const symbols = data.map(stock => stock.symbol);
                            const freshStocks = await Promise.all(
                                symbols.map(async (symbol) => {
                                    try {
                                        const response = await fetch(`/api/stocks/single-quote?symbol=${symbol}`);
                                        if (response.ok) {
                                            return await response.json();
                                        }
                                        // If we can't get fresh data, use the saved data
                                        return data.find(s => s.symbol === symbol) || null;
                                    } catch (error) {
                                        console.error(`Error refreshing ${symbol}:`, error);
                                        return data.find(s => s.symbol === symbol) || null;
                                    }
                                })
                            );

                            // Filter out any nulls
                            data = freshStocks.filter(Boolean);

                            // Update localStorage with fresh data
                            localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(data));
                        } catch (error) {
                            console.error('Error refreshing watchlist data:', error);
                            // Continue with saved data if refresh fails
                        }
                    }
                } else {
                    // Otherwise fetch default watchlist from API
                    data = await StockService.getWatchlist();
                    // Save initial data to localStorage
                    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(data));
                }

                setStocks(data);
            } catch (error) {
                console.error('Failed to fetch watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [refreshTrigger]);

    // Update localStorage when stocks change
    useEffect(() => {
        if (!loading && stocks.length > 0) {
            localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(stocks));
        }
    }, [stocks, loading]);

    const handleRemove = (symbol: string) => {
        if (onRemoveStock) {
            onRemoveStock(symbol);
        }

        // Filter the stock locally
        setStocks(stocks.filter(stock => stock.symbol !== symbol));
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse flex justify-between items-center p-3 rounded-lg bg-slate-100">
                        <div className="flex space-x-3 items-center">
                            <div className="h-6 w-6 rounded-full bg-slate-200"></div>
                            <div>
                                <div className="h-3.5 bg-slate-200 rounded w-20 mb-1.5"></div>
                                <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="h-3.5 bg-slate-200 rounded w-12 mb-1"></div>
                            <div className="h-2.5 bg-slate-200 rounded w-10"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!stocks.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[150px] text-center space-y-3 text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <FaStar className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm">Your watchlist is empty</p>
                <p className="text-xs">Add stocks to track performance</p>
            </div>
        );
    }

    // Format large numbers with appropriate suffixes
    const formatMarketCap = (marketCap: number) => {
        if (marketCap >= 1000000000000) {
            return `${(marketCap / 1000000000000).toFixed(1)}T`;
        }
        if (marketCap >= 1000000000) {
            return `${(marketCap / 1000000000).toFixed(1)}B`;
        }
        if (marketCap >= 1000000) {
            return `${(marketCap / 1000000).toFixed(1)}M`;
        }
        return marketCap.toString();
    };

    // Sort stocks based on performance (absolute value of change)
    const sortedStocks = [...stocks].sort((a, b) =>
        Math.abs(b.changePercent) - Math.abs(a.changePercent)
    );

    return (
        <div className="space-y-2">
            {sortedStocks.map((stock) => (
                <div
                    key={stock.symbol}
                    className="flex justify-between items-center p-2.5 rounded-lg transition-colors border bg-slate-100 border-slate-200"
                >
                    <div className="flex items-center gap-2.5">
                        <FaStar className="w-3.5 h-3.5 text-amber-500" />
                        <div>
                            <div className="font-medium text-slate-800 text-sm">{stock.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span>{stock.symbol}</span>
                                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{formatMarketCap(stock.marketCap)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="font-semibold text-slate-800 text-sm">{stock.price.toFixed(2)}</div>
                            <div
                                className={`text-xs font-medium ${stock.changePercent > 0
                                    ? 'text-[var(--stock-positive)]'
                                    : stock.changePercent < 0
                                        ? 'text-[var(--stock-negative)]'
                                        : 'text-slate-400'
                                    }`}
                            >
                                {stock.changePercent > 0 ? '+' : ''}
                                {stock.changePercent.toFixed(2)}%
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(stock.symbol)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                            <FaTrash className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
} 