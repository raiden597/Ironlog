/** Override with VITE_GTM_CONTAINER_ID for staging/other containers. */
const GTM_ID = import.meta.env.VITE_GTM_CONTAINER_ID || 'GTM-KBH93VZJ'
/** Google Analytics 4 — override with VITE_GA_MEASUREMENT_ID. */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-9SZ2PFK293'

let initialized = false

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  if (!GTM_ID && !GA_ID) return
  initialized = true

  window.dataLayer = window.dataLayer || []

  if (GA_ID) {
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', GA_ID)
    const gaScript = document.createElement('script')
    gaScript.async = true
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
    document.head.appendChild(gaScript)
  }

  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    const firstScript = document.getElementsByTagName('script')[0]
    const gtmScript = document.createElement('script')
    gtmScript.async = true
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
    firstScript.parentNode.insertBefore(gtmScript, firstScript)
  }
}

/**
 * SPA section changes — GTM: Custom Event `virtual_page_view` + Data Layer vars.
 * GA4: `gtag('config', …, { page_path })` for virtual page views.
 * If GA4 is also fired from GTM for the same property, disable one path to avoid duplicates.
 */
export function trackPageView(pagePath) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []

  if (GTM_ID) {
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_path: pagePath,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_location: `${window.location.origin}${pagePath}`,
    })
  }

  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('config', GA_ID, { page_path: pagePath })
  }
}

/** Custom events — data layer (GTM) and/or GA4 `gtag('event', …)`. */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []

  if (GTM_ID) {
    window.dataLayer.push({ event: name, ...params })
  }
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}
