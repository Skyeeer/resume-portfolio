"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { MarketOverview } from "./components/market-overview";
import { StockWatchlist } from "./components/stock-watchlist";
import { SectorPerformance } from "./components/sector-performance";
import { TopMovers } from "./components/top-movers";
import { NewsPanel } from "./components/news-panel";
import { StockChart } from "./components/stock-chart";
import { StockInfo, StockService } from "./api/stock-service";
import { FaHome, FaChartLine, FaSyncAlt, FaChartPie, FaNewspaper, FaTable, FaPlus, FaStar, FaSearch, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

export default function StocksDashboard() {
    const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
    const [selectedIndex, setSelectedIndex] = useState("omxs30");
    const [newStockSymbol, setNewStockSymbol] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddingStock, setIsAddingStock] = useState(false);
    const [refreshWatchlist, setRefreshWatchlist] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onAddStock = async () => {
        let symbol = newStockSymbol.trim();
        if (!symbol) return;

        setIsLoading(true);
        setErrorMessage("");

        try {
            // Check if it looks like a company name rather than a symbol
            if (symbol.split(' ').length > 1 || symbol.includes('AB')) {
                // It's likely a company name, not a symbol
                setErrorMessage('Please enter a ticker symbol, not a company name.');
                setIsLoading(false);
                return;
            }

            // For Swedish companies, help the user by adding .ST if missing
            if (/^[A-Z0-9\-]+$/i.test(symbol) && !symbol.includes('.')) {
                // Could be a Swedish company without .ST suffix
                symbol = `${symbol.toUpperCase()}.ST`;
            }

            // Get existing watchlist from localStorage
            const existingWatchlistStr = localStorage.getItem('stonks-watchlist');
            let watchlist: StockInfo[] = [];

            if (existingWatchlistStr) {
                watchlist = JSON.parse(existingWatchlistStr);
            }

            // Check if stock already exists (check normalized versions)
            if (watchlist.some(stock =>
                stock.symbol.toLowerCase() === symbol.toLowerCase() ||
                stock.symbol.toLowerCase().replace('.st', '') === symbol.toLowerCase().replace('.st', '')
            )) {
                setErrorMessage('This stock is already in your watchlist');
                return;
            }

            // Skip stock-data check and go straight to quote
            const quoteResponse = await fetch(`/api/stocks/single-quote?symbol=${encodeURIComponent(symbol)}`);

            if (!quoteResponse.ok) {
                const errorData = await quoteResponse.json();
                throw new Error(errorData.error || `Could not find stock with symbol "${symbol}"`);
            }

            const stockInfo = await quoteResponse.json();

            // Add to watchlist
            const updatedWatchlist = [...watchlist, stockInfo];

            // Save to localStorage
            localStorage.setItem('stonks-watchlist', JSON.stringify(updatedWatchlist));

            setNewStockSymbol("");
            setIsAddingStock(false);

            // Force a refresh
            setRefreshWatchlist(prev => prev + 1);
        } catch (error) {
            console.error('Error adding stock:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to add stock to watchlist');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-slate-800">
            {/* Custom CSS variables for this page only */}
            <style jsx global>{`
                :root {
                    --stock-primary: #10b981;
                    --stock-secondary: #0ea5e9; /* Light blue */
                    --stock-accent: #84cc16; /* Lime green */
                    --stock-muted: #94a3b8;
                    --stock-card-bg: rgba(255, 255, 255, 1);
                    --stock-card-border: rgba(226, 232, 240, 0.8);
                    --stock-positive: #4ade80;
                    --stock-negative: #ef4444;
                    --stock-chart-background: rgba(241, 245, 249, 0.3);
                }
            `}</style>

            <div className="container mx-auto px-4 py-4 max-h-screen overflow-auto">
                {/* Header with Glass Effect */}
                <div className="flex justify-between items-center mb-4 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                            <FaHome className="text-[var(--stock-secondary)]" />
                        </Link>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--stock-secondary)] to-[var(--stock-accent)] text-transparent bg-clip-text">
                            Swedish Stock Market
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center text-xs">
                            <p className="text-slate-500 mr-2">Live data:</p>
                            <p className="text-slate-700">May 5, 2023 • 15:45 CEST</p>
                        </div>
                        <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-[var(--stock-secondary)]">
                            <FaSyncAlt className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Three Column Layout */}
                <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
                    {/* Left Column - Watchlist & News */}
                    <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                        {/* Watchlist with Add Feature */}
                        <Card className="border-slate-200 bg-white rounded-xl">
                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                                    <FaStar className="w-3.5 h-3.5 text-[var(--stock-accent)]" />
                                    <span>My Watchlist</span>
                                </CardTitle>
                                <Dialog open={isAddingStock} onOpenChange={setIsAddingStock}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-50 text-[var(--stock-secondary)] hover:text-[var(--stock-accent)] hover:bg-slate-100">
                                            <FaPlus className="h-3.5 w-3.5" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md bg-white border-slate-200 shadow-lg p-6">
                                        <DialogHeader className="mb-4">
                                            <DialogTitle className="text-slate-800 text-xl">Add Stock to Watchlist</DialogTitle>
                                            <DialogDescription className="text-slate-500">
                                                Enter the stock ticker symbol (not the company name)
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-5 py-3">
                                            <div className="flex flex-col gap-3">
                                                <div className="text-sm text-slate-600 flex items-start gap-2 bg-blue-50 p-3 rounded-md">
                                                    <FaInfoCircle className="text-[var(--stock-secondary)] mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium mb-1">How to find the correct symbol:</p>
                                                        <ul className="list-disc ml-4 space-y-1">
                                                            <li>Swedish stocks: Add <span className="font-mono bg-slate-100 px-1">.ST</span> suffix (e.g., ERIC-B.ST, VOLV-B.ST)</li>
                                                            <li>Common examples: SAND.ST (Sandvik), SEB-A.ST, NDA-SE.ST (Nordea)</li>
                                                            <li>US stocks: Use ticker only (e.g., AAPL, MSFT, GOOGL)</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <Input
                                                    className="bg-white border-slate-200 text-slate-800 focus-visible:ring-[var(--stock-accent)]"
                                                    placeholder="e.g., ERIC-B.ST, AAPL, MSFT"
                                                    value={newStockSymbol}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setNewStockSymbol(e.target.value);
                                                        setErrorMessage("");
                                                    }}
                                                />
                                                {errorMessage && (
                                                    <div className="text-red-500 text-sm rounded-md bg-red-50 p-3 flex items-start gap-2">
                                                        <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-medium">{errorMessage}</p>
                                                            <p className="mt-1">Try using the exact ticker symbol, not the company name. For Swedish stocks, add ".ST" at the end.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter className="sm:justify-between border-t border-slate-100 pt-4 mt-2">
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
                                                    Cancel
                                                </Button>
                                            </DialogTrigger>
                                            <Button
                                                type="submit"
                                                onClick={onAddStock}
                                                disabled={isLoading || !newStockSymbol.trim()}
                                                className="bg-gradient-to-r from-[var(--stock-secondary)] to-[var(--stock-accent)] hover:opacity-90 text-white"
                                            >
                                                {isLoading ? 'Adding...' : 'Add Stock'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="py-1 px-3 overflow-auto" style={{ maxHeight: 'calc(30vh - 50px)' }}>
                                <StockWatchlist refreshTrigger={refreshWatchlist} />
                            </CardContent>
                        </Card>

                        {/* Market Overview */}
                        <Card className="border-slate-200 bg-white rounded-xl flex-grow">
                            <CardHeader className="py-2 px-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                                    <FaTable className="w-3.5 h-3.5 text-[var(--stock-secondary)]" />
                                    <span>Market Overview</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-1 px-3 overflow-auto" style={{ maxHeight: 'calc(70vh - 160px)' }}>
                                <MarketOverview />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Center Column - Main Chart */}
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                        {/* Index Selector and Timeframe Controls */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="w-full md:w-48">
                                <Select
                                    value={selectedIndex}
                                    onValueChange={setSelectedIndex}
                                >
                                    <SelectTrigger className="h-9 bg-white border-slate-200 text-slate-800">
                                        <SelectValue placeholder="Select Index" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-slate-200 text-slate-800">
                                        <SelectItem value="omxs30">OMXS30</SelectItem>
                                        <SelectItem value="omxspi">OMXSPI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Tabs
                                value={selectedTimeframe}
                                onValueChange={setSelectedTimeframe}
                                className="w-full md:w-auto"
                            >
                                <TabsList className="grid grid-cols-5 bg-white border border-slate-200">
                                    <TabsTrigger value="1d" className="text-slate-600 data-[state=active]:bg-[var(--stock-secondary)] data-[state=active]:text-white">1D</TabsTrigger>
                                    <TabsTrigger value="1w" className="text-slate-600 data-[state=active]:bg-[var(--stock-secondary)] data-[state=active]:text-white">1W</TabsTrigger>
                                    <TabsTrigger value="1m" className="text-slate-600 data-[state=active]:bg-[var(--stock-secondary)] data-[state=active]:text-white">1M</TabsTrigger>
                                    <TabsTrigger value="3m" className="text-slate-600 data-[state=active]:bg-[var(--stock-secondary)] data-[state=active]:text-white">3M</TabsTrigger>
                                    <TabsTrigger value="1y" className="text-slate-600 data-[state=active]:bg-[var(--stock-secondary)] data-[state=active]:text-white">1Y</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Main Chart with Glass Effect */}
                        <Card className="border-slate-200 bg-white rounded-xl flex-grow">
                            <CardHeader className="pb-0 pt-3 px-5">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-base mb-1 text-slate-800">{selectedIndex.toUpperCase()} Index Performance</CardTitle>
                                            <CardDescription className="text-slate-500">
                                                {selectedTimeframe === "1d" ? "Today" :
                                                    selectedTimeframe === "1w" ? "Past Week" :
                                                        selectedTimeframe === "1m" ? "Past Month" :
                                                            selectedTimeframe === "3m" ? "Past 3 Months" : "Past Year"}
                                            </CardDescription>
                                        </div>
                                    </div>

                                    {/* Price indicator ABOVE the chart */}
                                    <div className="flex justify-end">
                                        <div className="flex flex-col items-end px-4 py-2 bg-white border border-slate-200 rounded-lg">
                                            <span className="text-lg font-medium text-slate-800">2543.16</span>
                                            <span className="text-sm text-[var(--stock-positive)]">▲ 105.09 (4.31%)</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="h-[calc(100%-90px)] relative px-2 pt-2">
                                <StockChart
                                    timeframe={selectedTimeframe}
                                    symbol={selectedIndex}
                                />
                            </div>
                        </Card>

                        {/* Sector Performance */}
                        <Card className="border-slate-200 bg-white rounded-xl">
                            <CardHeader className="py-2 px-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                                    <FaChartPie className="w-3.5 h-3.5 text-[var(--stock-secondary)]" />
                                    <span>Sector Performance</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-1 px-3 h-[180px]">
                                <SectorPerformance timeframe={selectedTimeframe} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - News & Top Movers */}
                    <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                        {/* Top Movers */}
                        <Card className="border-slate-200 bg-white rounded-xl">
                            <CardHeader className="py-3 px-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                                    <FaChartLine className="w-3.5 h-3.5 text-[var(--stock-accent)]" />
                                    <span>Top Movers</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-1 px-3 overflow-auto" style={{ maxHeight: 'calc(40vh - 50px)' }}>
                                <TopMovers />
                            </CardContent>
                        </Card>

                        {/* News Panel */}
                        <Card className="border-slate-200 bg-white rounded-xl flex-grow">
                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                                    <FaNewspaper className="w-3.5 h-3.5 text-[var(--stock-secondary)]" />
                                    <span>Latest Market News</span>
                                </CardTitle>
                                <div className="relative w-28">
                                    <Input
                                        className="h-7 pl-7 text-xs bg-white border-slate-200 text-slate-800"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    />
                                    <FaSearch className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="py-1 px-3 overflow-auto" style={{ maxHeight: 'calc(60vh - 110px)' }}>
                                <NewsPanel />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
} 