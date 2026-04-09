/** Generate a short random ID */
export const uid = () => Math.random().toString(36).slice(2, 9)

/** Today's date as YYYY-MM-DD */
export const todayStr = () => new Date().toISOString().split('T')[0]

/** Format a YYYY-MM-DD string to "Mon, Jan 1" */
export const fmtDate = (d) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
  })
