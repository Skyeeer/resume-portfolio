"use client";

import { useEffect, useState } from 'react';
import { StockService, StockData } from '../api/stock-service';

interface StockChartProps {
    symbol: string;
    timeframe: string;
}

export function StockChart({ symbol, timeframe }: StockChartProps) {
    const [data, setData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const stockData = await StockService.getStockData(symbol, timeframe);
                setData(stockData);
            } catch (err) {
                setError('Failed to load chart data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [symbol, timeframe]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400">Loading chart data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-2">💀 {error}</p>
                    <button
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No data available</p>
            </div>
        );
    }

    // Calculate chart metrics
    const lastPrice = data[data.length - 1].close;
    const firstPrice = data[0].open;
    const change = lastPrice - firstPrice;
    const percentChange = (change / firstPrice) * 100;
    const isPositive = change >= 0;

    // Find min and max values for chart scaling
    const allValues = data.flatMap(item => [item.high, item.low]);
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const valueRange = maxValue - minValue;

    // Calculate SVG dimensions
    const chartHeight = 300;
    const chartWidth = 1000; // Set a fixed width for calculations
    const padding = { top: 30, right: 40, bottom: 40, left: 70 };
    const innerHeight = chartHeight - padding.top - padding.bottom;
    const innerWidth = chartWidth - padding.left - padding.right;

    // Scaling functions - use number-based coordinates for reliability
    const timeScale = (index: number) => (index / (data.length - 1)) * innerWidth;
    const valueScale = (value: number) =>
        innerHeight - ((value - minValue) / valueRange) * innerHeight;

    // Format date based on timeframe
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);

        switch (timeframe) {
            case '1d':
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            case '1w':
                return date.toLocaleDateString([], { weekday: 'short' });
            case '1m':
                return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
            case '3m':
            case '1y':
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            default:
                return date.toLocaleDateString();
        }
    };

    // Generate line path
    const linePath = data.map((point, i) => {
        const x = timeScale(i);
        const y = valueScale(point.close);
        return `${i === 0 ? 'M' : 'L'} ${x + padding.left} ${y + padding.top}`;
    }).join(' ');

    // Generate gradient area below the line
    const areaPath = `
    ${linePath} 
    L ${timeScale(data.length - 1) + padding.left} ${innerHeight + padding.top} 
    L ${padding.left} ${innerHeight + padding.top} 
    Z
  `;

    // Get colors from CSS variables with fallbacks to match the new color scheme
    const positiveColor = 'var(--stock-positive, #4ade80)';
    const negativeColor = 'var(--stock-negative, #ef4444)';
    const lineColor = isPositive ? positiveColor : negativeColor;

    // For gradient fill, use a different set of colors that match the blue-to-lime theme
    const gradientStartColor = isPositive ? 'var(--stock-secondary, #60a5fa)' : 'var(--stock-negative, #ef4444)';
    const gradientEndColor = isPositive ? 'var(--stock-accent, #84cc16)' : 'var(--stock-negative, #ef4444)';

    // Generate x-axis ticks
    const xTicks = timeframe === '1d' ? 6 : 5; // Different number of ticks based on timeframe
    const xAxisTicks = Array.from({ length: xTicks }).map((_, i) => {
        const dataIndex = Math.floor((i / (xTicks - 1)) * (data.length - 1));
        const x = timeScale(dataIndex) + padding.left;
        const y = innerHeight + padding.top;
        return (
            <g key={`x-tick-${i}`}>
                <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y + 5}
                    stroke="rgba(148,163,184,0.5)"
                />
                <text
                    x={x}
                    y={y + 20}
                    textAnchor="middle"
                    fill="rgba(100,116,139,0.8)"
                    fontSize="10"
                >
                    {formatDate(data[dataIndex].timestamp)}
                </text>
            </g>
        );
    });

    // Generate y-axis ticks
    const yTicks = 5;
    const yAxisTicks = Array.from({ length: yTicks }).map((_, i) => {
        const value = minValue + (valueRange / (yTicks - 1)) * i;
        const x = padding.left;
        const y = valueScale(value) + padding.top;
        return (
            <g key={`y-tick-${i}`}>
                <line
                    x1={x}
                    y1={y}
                    x2={x - 5}
                    y2={y}
                    stroke="rgba(148,163,184,0.5)"
                />
                <text
                    x={x - 15}
                    y={y + 4}
                    textAnchor="end"
                    fill="rgba(100,116,139,0.8)"
                    fontSize="10"
                >
                    {value.toFixed(1)}
                </text>
                <line
                    x1={x}
                    y1={y}
                    x2={x + innerWidth}
                    y2={y}
                    stroke="rgba(241,245,249,0.5)"
                    strokeDasharray="5,5"
                />
            </g>
        );
    });

    return (
        <div className="relative h-full w-full p-2">
            {/* Price display has been moved to the parent component - don't show it here */}

            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Background grid */}
                {xAxisTicks}
                {yAxisTicks}

                {/* Area below the line */}
                <path
                    d={areaPath}
                    fill={`url(#gradient-${symbol})`}
                    opacity="0.2"
                />

                {/* Line chart */}
                <path
                    d={linePath}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth="2.5"
                />

                {/* Add gradient definition */}
                <defs>
                    <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={isPositive ? gradientStartColor : negativeColor} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={isPositive ? gradientEndColor : negativeColor} stopOpacity="0.1" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
} 