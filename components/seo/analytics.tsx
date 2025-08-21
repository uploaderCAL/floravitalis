"use client"

import { useEffect } from "react"
import Script from "next/script"

interface AnalyticsProps {
  gaId?: string
  metaPixelId?: string
}

export function Analytics({ gaId, metaPixelId }: AnalyticsProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // GA4 tracking
      if (gaId && window.gtag) {
        window.gtag("config", gaId, {
          page_title: document.title,
          page_location: window.location.href,
        })
      }

      // Meta Pixel tracking
      if (metaPixelId && window.fbq) {
        window.fbq("track", "PageView")
      }
    }
  }, [gaId, metaPixelId])

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}
