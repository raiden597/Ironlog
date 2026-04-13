/** Override with VITE_GTM_CONTAINER_ID for staging/other containers. */
const GTM_ID = import.meta.env.VITE_GTM_CONTAINER_ID || 'GTM-KBH93VZJ'

let initialized = false

export function initAnalytics() {
  if (initialized || !GTM_ID || typeof window === 'undefined') return
  initialized = true

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

  const firstScript = document.getElementsByTagName('script')[0]
  const gtmScript = document.createElement('script')
  gtmScript.async = true
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`
  firstScript.parentNode.insertBefore(gtmScript, firstScript)
}

/**
 * SPA section changes — add a Custom Event trigger in GTM for `virtual_page_view`
 * and send a GA4 page_view (or use Data Layer variables page_path / page_title).
 */
export function trackPageView(pagePath) {
  if (!GTM_ID || typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'virtual_page_view',
    page_path: pagePath,
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_location:
      typeof window !== 'undefined' ? `${window.location.origin}${pagePath}` : pagePath,
  })
}

/** Pushes a custom event into the data layer for GTM tags to consume. */
export function trackEvent(name, params = {}) {
  if (!GTM_ID || typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: name, ...params })
}
