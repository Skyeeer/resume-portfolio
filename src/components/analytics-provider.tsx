'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageView } from '@/lib/analytics';

export function AnalyticsProvider() {
    const pathname = usePathname();

    // Record page view when pathname changes
    useEffect(() => {
        if (pathname) {
            try {
                // Record page view
                recordPageView(pathname);
            } catch (error) {
                console.warn('Failed to record page view in AnalyticsProvider:', error);
                // Silently fail
            }
        }
    }, [pathname]);

    // Empty component - just for side effects
    return null;
} 