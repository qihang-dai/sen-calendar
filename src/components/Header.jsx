import { useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function Header({ view, setView, syncing, syncError, lastSynced, onExport, onImport, onSettings }) {
  const { lang, toggleLang, t } = useLanguage()
  const fileRef = useRef()

  function handleFile(e) {
    const file = e.target.files[0]
    if (file) onImport(file)
    e.target.value = ''
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-logo">
          <span className="logo-kanji">{t.appKanji}</span>
          <span className="logo-text">{t.appName}</span>
        </div>
        <div className="sync-status">
          {syncing && <span className="sync-dot syncing" title="Syncing…" />}
          {!syncing && syncError && <span className="sync-dot error" title={syncError} />}
          {!syncing && !syncError && lastSynced && (
            <span className="sync-dot ok" title={`Synced ${lastSynced.toLocaleTimeString()}`} />
          )}
          {!syncing && !syncError && !lastSynced && (
            <span className="sync-dot local" title="Local only" />
          )}
        </div>
      </div>

      <nav className="view-toggle">
        <button
          className={view === 'month' ? 'view-btn active' : 'view-btn'}
          onClick={() => setView('month')}
        >
          {t.viewMonth}
        </button>
        <button
          className={view === 'year' ? 'view-btn active' : 'view-btn'}
          onClick={() => setView('year')}
        >
          {t.viewYear}
        </button>
      </nav>

      <div className="header-right">
        <button className="lang-toggle" onClick={toggleLang} title="Switch language / 切换语言">
          {lang === 'en' ? '中文' : 'EN'}
        </button>
        <button className="icon-btn" onClick={onExport} title="Export / 导出">↓</button>
        <button className="icon-btn" onClick={() => fileRef.current.click()} title="Import / 导入">↑</button>
        <button className="icon-btn" onClick={onSettings} title="Settings / 设置">⚙</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </header>
  )
}
