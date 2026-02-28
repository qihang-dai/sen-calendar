import dayjs from 'dayjs'
import { dayToFlatColor } from '../utils/scoring'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MiniMonth({ year, monthIndex, days, onMonthClick }) {
  const today   = dayjs()
  const current = dayjs(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`)
  const startDow = current.day()
  const offset   = startDow === 0 ? 6 : startDow - 1
  const daysInMonth = current.daysInMonth()
  const totalCells  = Math.ceil((offset + daysInMonth) / 7) * 7

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const d = i - offset + 1
    cells.push(d >= 1 && d <= daysInMonth ? d : null)
  }

  return (
    <div className="mini-month" onClick={() => onMonthClick(monthIndex + 1)}>
      <div className="mini-month-name">{MONTHS[monthIndex]}</div>
      <div className="mini-cal-grid">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="mini-day-label">{d}</div>
        ))}
        {cells.map((dayNum, idx) => {
          if (dayNum === null) return <div key={`e-${idx}`} className="mini-cell empty" />

          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
          const entry   = days[dateKey]
          const flatColor = dayToFlatColor(entry)
          const isToday  = dateKey === today.format('YYYY-MM-DD')
          const isFuture = dayjs(dateKey).isAfter(today, 'day')

          // Tooltip: show emojis if any
          const emojis = Array.isArray(entry?.emojis)
            ? entry.emojis.join(' ')
            : entry?.emoji || ''

          return (
            <div
              key={dateKey}
              className={`mini-cell${isToday ? ' today' : ''}${isFuture ? ' future' : ''}`}
              style={flatColor ? { background: flatColor } : undefined}
              title={emojis || dateKey}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function YearView({ year, days, onYearChange, onMonthClick }) {
  return (
    <div className="year-view">
      <div className="year-nav">
        <button className="nav-arrow" onClick={() => onYearChange(year - 1)}>‹</button>
        <h2 className="year-title">{year}</h2>
        <button className="nav-arrow" onClick={() => onYearChange(year + 1)}>›</button>
      </div>

      <div className="year-grid">
        {MONTHS.map((_, i) => (
          <MiniMonth key={i} year={year} monthIndex={i} days={days} onMonthClick={onMonthClick} />
        ))}
      </div>
    </div>
  )
}
