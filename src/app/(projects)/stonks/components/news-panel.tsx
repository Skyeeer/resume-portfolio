"use client";

import { useEffect, useState } from 'react';
import { StockService, NewsItem } from '../api/stock-service';
import { format } from 'date-fns';
import Link from 'next/link';

export function NewsPanel() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await StockService.getLatestNews();
                setNews(data);
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="animate-pulse p-3 border-b border-slate-100">
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-4/5 mb-3"></div>
                        <div className="flex gap-2 items-center">
                            <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                            <div className="h-2 bg-slate-200 rounded-full w-1"></div>
                            <div className="h-2.5 bg-slate-200 rounded w-24"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!news.length) {
        return <div className="text-center text-sm text-slate-500 py-4">No news available</div>;
    }

    return (
        <div className="space-y-0">
            {news.map((item) => (
                <article key={item.id} className="p-3 border-b border-slate-100 hover:bg-slate-50">
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <h3 className="text-sm font-medium mb-1 text-slate-800 hover:text-[var(--stock-secondary)]">
                            {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{item.summary}</p>
                        <div className="flex items-center text-xs text-slate-400">
                            <span className="font-medium text-slate-500">{item.source}</span>
                            <span className="mx-1.5">•</span>
                            <time dateTime={item.publishedAt}>
                                {format(new Date(item.publishedAt), 'MMM d, HH:mm')}
                            </time>
                        </div>
                    </a>
                </article>
            ))}
        </div>
    );
} 