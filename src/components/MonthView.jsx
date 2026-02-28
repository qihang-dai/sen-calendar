import { useMemo, useState, useRef } from 'react'
import dayjs from 'dayjs'
import { dayToGradient, dayToBorderColor, DIM_COLORS } from '../utils/scoring'
import { useLanguage } from '../i18n/LanguageContext'

// Generic streak data — pass an isClean(entry) predicate
function computeStreakData(days, year, month, todayStr, isClean) {
  const pad    = (n) => String(n).padStart(2, '0')
  const prefix = `${year}-${pad(month)}-`
  const total  = dayjs(`${prefix}01`).daysInMonth()
  const chains = []
  let start    = null

  for (let d = 1; d <= total; d++) {
    const dk = `${prefix}${pad(d)}`
    if (dk > todayStr) break
    if (isClean(days[dk])) {
      if (start === null) start = d
    } else {
      if (start !== null) { chains.push({ start, end: d - 1, len: d - start }); start = null }
    }
  }
  if (start !== null) {
    const last = todayStr.startsWith(prefix) ? parseInt(todayStr.slice(-2)) : total
    chains.push({ start, end: Math.min(last, total), len: Math.min(last, total) - start + 1 })
  }

  const longest = chains.reduce((m, c) => Math.max(m, c.len), 0)
  const current = todayStr.startsWith(prefix)
    ? (chains.find(c => `${prefix}${pad(c.end)}` === todayStr)?.len ?? 0)
    : 0

  const map = {}
  chains.forEach(({ start, end, len }) => {
    for (let d = start; d <= end; d++) map[`${prefix}${pad(d)}`] = len
  })

  return { map, longest, current }
}

// Each emoji gets its own float speed + phase so they move independently — zen
const ZEN_TIMING = [
  { dur: '2.6s', delay: '0s'    },
  { dur: '3.3s', delay: '-1.1s' },
  { dur: '2.9s', delay: '-0.7s' },
  { dur: '3.7s', delay: '-2.2s' },
]

// Font size shrinks as count grows
const EMOJI_SIZE = { 1: '1.45rem', 2: '1.08rem', 3: '0.9rem', 4: '0.8rem' }

function FloatingEmojis({ emojis }) {
  if (emojis.length === 0) return null

  if (emojis.length === 1) {
    const { dur, delay } = ZEN_TIMING[0]
    return (
      <span
        className="cell-emoji zen-float"
        style={{ '--zen-dur': dur, '--zen-delay': delay }}
      >
        {emojis[0]}
      </span>
    )
  }

  const fontSize = EMOJI_SIZE[emojis.length] ?? '0.8rem'

  return (
    <div className="cell-emojis-cloud">
      {emojis.map((e, i) => {
        const { dur, delay } = ZEN_TIMING[i] ?? ZEN_TIMING[0]
        return (
          <span
            key={i}
            className="cell-emoji-cloud-item zen-float"
            style={{ fontSize, '--zen-dur': dur, '--zen-delay': delay }}
          >
            {e}
          </span>
        )
      })}
    </div>
  )
}

export default function MonthView({ year, month, days, onDayClick, onPrev, onNext, onClearMonth, justSaved }) {
  const { t } = useLanguage()
  const [confirming, setConfirming] = useState(false)
  const confirmTimer = useRef(null)

  function handleClearClick() {
    if (!confirming) {
      setConfirming(true)
      confirmTimer.current = setTimeout(() => setConfirming(false), 3000)
    } else {
      clearTimeout(confirmTimer.current)
      setConfirming(false)
      onClearMonth()
    }
  }
  const today    = dayjs()
  const todayStr = today.format('YYYY-MM-DD')
  const current  = dayjs(`${year}-${String(month).padStart(2, '0')}-01`)

  const fapData   = useMemo(
    () => computeStreakData(days, year, month, todayStr, e => e?.fap === 0),
    [days, year, month, todayStr]
  )
  const smokeData = useMemo(
    () => computeStreakData(days, year, month, todayStr, e => e?.smoking === false),
    [days, year, month, todayStr]
  )

  const startDow    = current.day()
  const offset      = startDow === 0 ? 6 : startDow - 1
  const daysInMonth = current.daysInMonth()
  const totalCells  = Math.ceil((offset + daysInMonth) / 7) * 7

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const d = i - offset + 1
    cells.push(d >= 1 && d <= daysInMonth ? d : null)
  }

  return (
    <div className="month-view">
      <div className="month-nav">
        <button className="nav-arrow" onClick={onPrev}>‹</button>
        <h2 className="month-title">
          <span className="month-name">{current.format('MMMM')}</span>
          <span className="month-year">{year}</span>
        </h2>
        <button className="nav-arrow" onClick={onNext}>›</button>
      </div>
      <div className="month-actions">
        <button
          className={`btn-clear-month ${confirming ? 'confirming' : ''}`}
          onClick={handleClearClick}
        >
          {confirming ? t.clearMonthConfirm : t.clearMonth}
        </button>
      </div>

      <div className="cal-grid">
        {t.dayLabels.map((d) => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}

        {cells.map((dayNum, idx) => {
          if (dayNum === null) return <div key={`e-${idx}`} className="cal-cell empty" />

          const dateKey  = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
          const entry    = days[dateKey]
          const gradient    = dayToGradient(entry)
          const borderColor = dayToBorderColor(entry)
          const isToday  = dateKey === todayStr
          const isFuture = dayjs(dateKey).isAfter(today, 'day')
          const isNew    = justSaved === dateKey

          const fapLen   = fapData.map[dateKey]   ?? 0
          const smokeLen = smokeData.map[dateKey] ?? 0
          // Priority: dual-epic > individual fires > dual-md > individual md > sm
          const chainClass =
            fapLen >= 7 && smokeLen >= 7 ? 'chain-dual-epic'  :
            fapLen >= 7                  ? 'chain-fire-red'   :
            smokeLen >= 7               ? 'chain-fire-blue'  :
            fapLen >= 3 && smokeLen >= 3 ? 'chain-dual-md'    :
            fapLen >= 3                  ? 'chain-fap-md'     :
            smokeLen >= 3               ? 'chain-smoke-md'   :
            fapLen >= 1 && smokeLen >= 1 ? 'chain-dual-sm'    :
            fapLen >= 1                  ? 'chain-fap-sm'     :
            smokeLen >= 1               ? 'chain-smoke-sm'   : ''

          const emojis = Array.isArray(entry?.emojis)
            ? entry.emojis
            : entry?.emoji ? [entry.emoji] : []

          const classes = [
            'cal-cell',
            isToday  ? 'today'    : '',
            isFuture ? 'future'   : '',
            isNew    ? 'blooming' : '',
            chainClass,
          ].filter(Boolean).join(' ')

          return (
            <div
              key={dateKey}
              className={classes}
              style={{
                ...(gradient    ? { background:   gradient    } : {}),
                ...(borderColor ? { borderColor:   borderColor,
                                    borderWidth:  '1.5px',
                                    borderStyle:  'solid'      } : {}),
              }}
              onClick={() => !isFuture && onDayClick(dateKey)}
            >
              <span className="cell-date">{dayNum}</span>
              {emojis.length > 0
                ? <FloatingEmojis emojis={emojis} />
                : entry && <span className="cell-dot" />
              }
            </div>
          )
        })}
      </div>

      {(fapData.longest > 0 || smokeData.longest > 0) && (
        <div className="streak-bar">
          {fapData.longest > 0 && (
            <div className="streak-group">
              <span className="streak-type streak-type-fap">🌙 {t.dimLabels.fap}</span>
              <span className="streak-days">{t.streakLongest} {fapData.longest} {t.streakDays}</span>
              {fapData.current > 0 && fapData.current === fapData.longest
                ? <span className="streak-pb">{t.streakPB}</span>
                : fapData.current > 0 && <span className="streak-cur">🔥 {fapData.current}{t.streakDays}</span>
              }
            </div>
          )}
          {fapData.longest > 0 && smokeData.longest > 0 && <span className="streak-sep">·</span>}
          {smokeData.longest > 0 && (
            <div className="streak-group">
              <span className="streak-type streak-type-smoke">🚭 {t.dimLabels.smoking}</span>
              <span className="streak-days">{t.streakLongest} {smokeData.longest} {t.streakDays}</span>
              {smokeData.current > 0 && smokeData.current === smokeData.longest
                ? <span className="streak-pb">{t.streakPB}</span>
                : smokeData.current > 0 && <span className="streak-cur">💨 {smokeData.current}{t.streakDays}</span>
              }
            </div>
          )}
        </div>
      )}

      <div className="legend">
        {Object.entries(DIM_COLORS).map(([key, { h, s, l }]) => (
          <div key={key} className="legend-dim" title={t.dimLabels[key]}>
            <div className="legend-dim-dot" style={{ background: `hsl(${h},${s}%,${l}%)` }} />
            <span className="legend-dim-label">{t.dimLabels[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
