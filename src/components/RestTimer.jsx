import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

const PRESETS = [60, 90, 120]
const CUSTOM_MIN = 15
const CUSTOM_MAX = 600

function formatMmSs(totalSec) {
  const s = Math.max(0, Math.floor(totalSec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

/** Reused after unlock on Start — avoids iOS/Safari blocking new AudioContext when the timer ends. */
let sharedAudioCtx = null

async function primeAudioFromUserGesture() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AC()
    }
    if (sharedAudioCtx.state === 'suspended') await sharedAudioCtx.resume()
  } catch {
    /* ignore */
  }
}

function tone(ctx, freq, ms, gain = 0.12) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.value = freq
  g.gain.value = gain
  o.connect(g)
  g.connect(ctx.destination)
  o.start()
  setTimeout(() => o.stop(), ms)
}

function playBeep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    let ctx = sharedAudioCtx
    if (!ctx || ctx.state === 'closed') {
      ctx = new AC()
      sharedAudioCtx = ctx
    }
    if (ctx.state === 'suspended') void ctx.resume()
    tone(ctx, 880, 180)
    setTimeout(() => tone(ctx, 660, 220, 0.11), 260)
    setTimeout(() => tone(ctx, 880, 200, 0.1), 540)
  } catch {
    /* ignore */
  }
}

/** Android Chrome / Firefox: works. iOS Safari: no Web Vibration API — use sound + flash only. */
function buzz() {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([200, 100, 200, 100, 350])
    }
  } catch {
    /* ignore */
  }
}

/**
 * Rest countdown between sets: 60 / 90 / 120 s presets or custom (15–600 s).
 */
export default function RestTimer() {
  const [presetSec, setPresetSec] = useState(90)
  const [useCustom, setUseCustom] = useState(false)
  const [customSec, setCustomSec] = useState(150)
  const [left, setLeft] = useState(null)
  const [running, setRunning] = useState(false)
  const [finishedFlash, setFinishedFlash] = useState(false)
  const finishedTimerRef = useRef(null)
  const doneNotifiedRef = useRef(false)

  const activeDuration = useCustom
    ? Math.min(CUSTOM_MAX, Math.max(CUSTOM_MIN, Number(customSec) || CUSTOM_MIN))
    : presetSec

  const displaySec = left !== null ? left : activeDuration

  const clearFinishTimer = () => {
    if (finishedTimerRef.current) {
      clearTimeout(finishedTimerRef.current)
      finishedTimerRef.current = null
    }
  }

  const onTimerDone = useCallback(() => {
    if (doneNotifiedRef.current) return
    doneNotifiedRef.current = true
    buzz()
    playBeep()
    setFinishedFlash(true)
    clearFinishTimer()
    finishedTimerRef.current = setTimeout(() => {
      setFinishedFlash(false)
      setLeft(null)
      finishedTimerRef.current = null
      doneNotifiedRef.current = false
    }, 2200)
  }, [])

  useEffect(() => () => clearFinishTimer(), [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setLeft(l => {
        if (l === null || l <= 0) return l
        if (l <= 1) {
          setRunning(false)
          onTimerDone()
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, onTimerDone])

  const start = () => {
    if (finishedFlash) return
    void primeAudioFromUserGesture()
    clearFinishTimer()
    setFinishedFlash(false)
    if (left !== null && left > 0) {
      doneNotifiedRef.current = false
      setRunning(true)
      return
    }
    doneNotifiedRef.current = false
    setLeft(activeDuration)
    setRunning(true)
  }

  const pause = () => setRunning(false)

  const reset = () => {
    clearFinishTimer()
    doneNotifiedRef.current = false
    setFinishedFlash(false)
    setRunning(false)
    setLeft(null)
  }

  const pickPreset = sec => {
    setUseCustom(false)
    setPresetSec(sec)
    if (!running) setLeft(null)
  }

  const enableCustom = () => {
    setUseCustom(true)
    if (!running) setLeft(null)
  }

  return (
    <div
      style={{
        marginBottom: 0,
        padding: '14px 14px 16px',
        background: finishedFlash ? 'rgba(200,255,0,0.08)' : '#0c0c0c',
        border: `1px solid ${finishedFlash ? 'rgba(200,255,0,0.35)' : '#1c1c1c'}`,
        borderRadius: 12,
        transition: 'background .25s, border-color .25s',
      }}
    >
      <div style={{ fontSize: 10, color: '#555', letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 10 }}>
        Rest timer
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {PRESETS.map(sec => (
          <button
            key={sec}
            type="button"
            className="btn-g"
            onClick={() => pickPreset(sec)}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontFamily: 'IBM Plex Mono, monospace',
              borderColor: !useCustom && presetSec === sec ? 'rgba(200,255,0,0.35)' : undefined,
              color: !useCustom && presetSec === sec ? '#c8ff00' : undefined,
            }}
          >
            {sec}s
          </button>
        ))}
        <button
          type="button"
          className="btn-g"
          onClick={enableCustom}
          style={{
            padding: '6px 12px',
            fontSize: 12,
            borderColor: useCustom ? 'rgba(200,255,0,0.35)' : undefined,
            color: useCustom ? '#c8ff00' : undefined,
          }}
        >
          Custom
        </button>
      </div>

      {useCustom && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: '#666' }}>Seconds</span>
          <input
            className="inp fm"
            type="number"
            min={CUSTOM_MIN}
            max={CUSTOM_MAX}
            value={customSec}
            onChange={e => setCustomSec(+e.target.value)}
            style={{ width: 88, fontSize: 13 }}
          />
          <span style={{ fontSize: 10, color: '#444' }}>{CUSTOM_MIN}–{CUSTOM_MAX}s</span>
        </div>
      )}

      <div
        className="fm"
        aria-live="polite"
        style={{
          fontSize: 44,
          lineHeight: 1,
          letterSpacing: '0.04em',
          color: finishedFlash ? '#c8ff00' : '#e8e8e8',
          textAlign: 'center',
          marginBottom: 12,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {finishedFlash ? 'Done!' : formatMmSs(displaySec)}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!running ? (
          <button type="button" className="btn-p" onClick={start} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Play size={16} strokeWidth={2.5} aria-hidden />
            {left !== null && left > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button type="button" className="btn-p" onClick={pause} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Pause size={16} strokeWidth={2.5} aria-hidden />
            Pause
          </button>
        )}
        <button
          type="button"
          className="btn-g"
          onClick={reset}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, paddingLeft: 14, paddingRight: 14 }}
          title="Reset timer"
        >
          <RotateCcw size={16} strokeWidth={2} aria-hidden />
          Reset
        </button>
      </div>
    </div>
  )
}
