// This service connects to our Yahoo Finance API endpoints

export interface StockData {
    timestamp: number;
    open: number;
    high: number;
    close: number;
    low: number;
    volume: number;
}

export interface StockInfo {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
}

export interface SectorPerformance {
    name: string;
    changePercent: number;
}

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    publishedAt: string;
    url: string;
}

// API service to fetch real data
export const StockService = {
    // Get historical data
    getStockData: async (symbol: string, timeframe: string): Promise<StockData[]> => {
        try {
            const response = await fetch(`/api/stocks/stock-data?symbol=${symbol}&timeframe=${timeframe}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch stock data:', error);
            // Fall back to empty data
            return [];
        }
    },

    // Get market overview
    getMarketOverview: async (): Promise<StockInfo[]> => {
        try {
            const response = await fetch('/api/stocks/market-overview?limit=8');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch market overview:', error);
            // Fall back to empty data
            return [];
        }
    },

    // Get watchlist stocks
    getWatchlist: async (): Promise<StockInfo[]> => {
        try {
            const response = await fetch('/api/stocks/watchlist?limit=8');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
            // Fall back to empty data
            return [];
        }
    },

    // Get sector performance
    getSectorPerformance: async (timeframe: string): Promise<SectorPerformance[]> => {
        try {
            const response = await fetch(`/api/stocks/sector-performance?timeframe=${timeframe}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch sector performance:', error);
            // Fall back to empty data
            return [];
        }
    },

    // Get top movers
    getTopMovers: async (): Promise<StockInfo[]> => {
        try {
            const response = await fetch('/api/stocks/top-movers?limit=10');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch top movers:', error);
            // Fall back to empty data
            return [];
        }
    },

    // Get latest news
    getLatestNews: async (): Promise<NewsItem[]> => {
        try {
            const response = await fetch('/api/stocks/latest-news?limit=10');

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch latest news:', error);
            // Fall back to empty data
            return [];
        }
    }
}; 