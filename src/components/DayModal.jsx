import { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { useLanguage } from '../i18n/LanguageContext'

const ALL_EMOJIS = ['🌿', '💪', '📚', '😊', '🌙', '✨', '🏋️', '💼', '🌸', '🔥', '😔', '🧘', '🎯', '💫', '🌊']
const MAX_EMOJIS = 4

const DEFAULTS = {
  emojis: [],
  fap: null,
  work: null,
  loved: null,
  social: null,
  productive: null,
  gym: null,
  smoking: null,
  note: '',
}

function normalizeEntry(entry) {
  if (!entry) return DEFAULTS
  const emojis = Array.isArray(entry.emojis)
    ? entry.emojis
    : entry.emoji ? [entry.emoji] : []
  const { emoji: _dropped, ...rest } = entry
  return { ...DEFAULTS, ...rest, emojis }
}

function suggestEmojis(form) {
  const { fap, work, loved, social, productive, gym } = form
  const ratings = [work, loved, social, productive].filter((v) => v !== null)
  const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
  const picks = []

  if (avg !== null && avg >= 4.5)                      picks.push('✨')
  if (gym === true && (productive ?? 0) >= 4)          picks.push('💪')
  else if (gym === true)                               picks.push('🏋️')
  if ((productive ?? 0) >= 4 && (work ?? 0) >= 4)     picks.push('🎯')
  else if ((productive ?? 0) >= 4)                     picks.push('📚')
  if ((work ?? 0) >= 4 && (productive ?? 0) < 4)      picks.push('💼')
  if ((loved ?? 0) >= 4 && (social ?? 0) >= 4)        picks.push('🌸')
  else if ((social ?? 0) >= 4)                         picks.push('😊')
  else if ((loved ?? 0) >= 4)                          picks.push('💫')
  if (gym === false && avg !== null && avg <= 2.5)     picks.push('🧘')
  if (avg !== null && avg <= 2)                         picks.push('😔')
  if ((fap ?? 0) >= 2 && (avg === null || avg <= 2.5)) picks.push('🌙')
  if (avg !== null && avg >= 4 && !fap)                picks.push('🔥')
  if (picks.length === 0)                              picks.push('🌿')

  return [...new Set(picks)].slice(0, 3)
}

function StarRating({ value, onChange }) {
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-btn ${value !== null && n <= value ? 'filled' : ''}`}
          onClick={() => onChange(value === n ? null : n)}
        >
          ●
        </button>
      ))}
      {value !== null && (
        <button type="button" className="clear-btn" onClick={() => onChange(null)}>✕</button>
      )}
    </div>
  )
}

function FapCounter({ value, onChange, t }) {
  const labels = [t.fapClean, '1×', '2×', '3+']
  return (
    <div className="fap-row">
      {labels.map((label, i) => (
        <button
          key={i}
          type="button"
          className={`fap-btn ${value === i ? 'active' : ''}`}
          onClick={() => onChange(value === i ? null : i)}
        >
          {label}
        </button>
      ))}
      {value !== null && (
        <button type="button" className="clear-btn" onClick={() => onChange(null)}>✕</button>
      )}
    </div>
  )
}

export default function DayModal({ dateKey, entry, onSave, onDelete, onClose }) {
  const { t } = useLanguage()
  const [form, setForm] = useState(() => normalizeEntry(entry))
  const date     = dayjs(dateKey)
  const isToday  = dateKey === dayjs().format('YYYY-MM-DD')
  const isFuture = date.isAfter(dayjs(), 'day')

  useEffect(() => { setForm(normalizeEntry(entry)) }, [dateKey, entry])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function toggleEmoji(emoji) {
    setForm((f) => {
      const arr = f.emojis || []
      if (arr.includes(emoji)) return { ...f, emojis: arr.filter((e) => e !== emoji) }
      if (arr.length >= MAX_EMOJIS) return f
      return { ...f, emojis: [...arr, emoji] }
    })
  }

  const suggestions   = useMemo(() => suggestEmojis(form), [form])
  const rest          = ALL_EMOJIS.filter((e) => !suggestions.includes(e))
  const selectedCount = form.emojis.length

  function handleSave() {
    const hasData =
      form.emojis.length > 0 || form.fap !== null || form.work !== null ||
      form.loved !== null || form.social !== null || form.productive !== null ||
      form.gym !== null || form.smoking !== null || form.note.trim()
    if (hasData) onSave(dateKey, { ...form, note: form.note.trim() })
    onClose()
  }

  // Date display: use dayjs locale (set by LanguageContext)
  const dayName = date.format('dddd')
  const dateStr = date.format('LL') // locale-aware full date

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        <div className="modal-header">
          <div className="modal-date-block">
            <span className="modal-day-name">{dayName}</span>
            <span className="modal-date">{dateStr}</span>
            {isToday && <span className="today-badge">{t.todayBadge}</span>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {isFuture ? (
          <div className="future-note">{t.futureNote}</div>
        ) : (
          <>
            <div className="modal-body">
              {/* Emoji */}
              <section className="modal-section">
                <label className="section-label">
                  {t.dayVibe}
                  {selectedCount > 0 && (
                    <span className="emoji-count-badge">{selectedCount}/{MAX_EMOJIS}</span>
                  )}
                </label>
                <div className="emoji-suggest-label">{t.suggested}</div>
                <div className="emoji-suggest-row">
                  {suggestions.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`emoji-btn suggested ${form.emojis.includes(e) ? 'selected' : ''}`}
                      onClick={() => toggleEmoji(e)}
                    >{e}</button>
                  ))}
                </div>
                <div className="emoji-grid">
                  {[...suggestions, ...rest].map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`emoji-btn ${form.emojis.includes(e) ? 'selected' : ''} ${selectedCount >= MAX_EMOJIS && !form.emojis.includes(e) ? 'disabled' : ''}`}
                      onClick={() => toggleEmoji(e)}
                    >{e}</button>
                  ))}
                </div>
                {selectedCount >= MAX_EMOJIS && (
                  <p className="emoji-max-note">{t.maxEmojisNote}</p>
                )}
              </section>

              {/* Fap */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">🌙</span> {t.sectionFap}
                </label>
                <FapCounter value={form.fap} onChange={(v) => set('fap', v)} t={t} />
              </section>

              {/* Work */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">💼</span> {t.sectionWork}
                </label>
                <StarRating value={form.work} onChange={(v) => set('work', v)} />
              </section>

              {/* Loved */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">🌸</span> {t.sectionLoved}
                </label>
                <StarRating value={form.loved} onChange={(v) => set('loved', v)} />
              </section>

              {/* Social */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">😊</span> {t.sectionSocial}
                </label>
                <StarRating value={form.social} onChange={(v) => set('social', v)} />
              </section>

              {/* Productive */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">📚</span> {t.sectionProductive}
                </label>
                <StarRating value={form.productive} onChange={(v) => set('productive', v)} />
              </section>

              {/* Gym */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">💪</span> {t.sectionGym}
                </label>
                <div className="gym-toggle-row">
                  <button
                    type="button"
                    className={`gym-btn ${form.gym === true ? 'active' : ''}`}
                    onClick={() => set('gym', form.gym === true ? null : true)}
                  >{t.gymDone}</button>
                  <button
                    type="button"
                    className={`gym-btn skip ${form.gym === false ? 'active' : ''}`}
                    onClick={() => set('gym', form.gym === false ? null : false)}
                  >{t.gymRest}</button>
                  {form.gym !== null && (
                    <button type="button" className="clear-btn" onClick={() => set('gym', null)}>✕</button>
                  )}
                </div>
              </section>

              {/* Smoking */}
              <section className="modal-section">
                <label className="section-label">
                  <span className="section-icon">🚬</span> {t.sectionSmoking}
                </label>
                <div className="gym-toggle-row">
                  <button
                    type="button"
                    className={`smoke-btn clean ${form.smoking === false ? 'active' : ''}`}
                    onClick={() => set('smoking', form.smoking === false ? null : false)}
                  >{t.smokeFree}</button>
                  <button
                    type="button"
                    className={`smoke-btn bad ${form.smoking === true ? 'active' : ''}`}
                    onClick={() => set('smoking', form.smoking === true ? null : true)}
                  >{t.smokedToday}</button>
                  {form.smoking !== null && (
                    <button type="button" className="clear-btn" onClick={() => set('smoking', null)}>✕</button>
                  )}
                </div>
              </section>

              {/* Note */}
              <section className="modal-section">
                <label className="section-label">{t.sectionNote}</label>
                <textarea
                  className="note-input"
                  placeholder={t.notePlaceholder}
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  rows={3}
                />
              </section>
            </div>

            <div className="modal-footer">
              {entry && Object.keys(entry).length > 0 && (
                <button className="btn-danger" onClick={() => { onDelete(dateKey); onClose() }}>
                  {t.clearDay}
                </button>
              )}
              <button className="btn-primary" onClick={handleSave}>{t.save}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
