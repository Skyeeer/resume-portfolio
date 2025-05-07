'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Add type declaration for gtag
declare global {
    interface Window {
        gtag: (
            command: string,
            targetId: string,
            config?: Record<string, unknown>
        ) => void;
        dataLayer: unknown[];
    }
}

export default function GoogleAnalytics({
    measurementId
}: {
    measurementId: string;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname && window.gtag) {
            window.gtag('config', measurementId, {
                page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
            });
        }
    }, [pathname, searchParams, measurementId]);

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');

          // Expose gtag to window object
          window.gtag = gtag;
        `}
            </Script>
        </>
    );
} 