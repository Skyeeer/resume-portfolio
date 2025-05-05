'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageView } from '@/lib/analytics';

export function AnalyticsProvider() {
    const pathname = usePathname();

    // Record page view when pathname changes
    useEffect(() => {
        if (pathname) {
            // Record page view
            recordPageView(pathname);
        }
    }, [pathname]);

    // Empty component - just for side effects
    return null;
} 