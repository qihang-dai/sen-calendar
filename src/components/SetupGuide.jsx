import { useState } from 'react'
import { createBin, fetchBin } from '../utils/jsonbin'
import { useLanguage } from '../i18n/LanguageContext'

export default function SetupGuide({ onComplete }) {
  const { lang, toggleLang, t } = useLanguage()
  const [step, setStep]       = useState(0)
  const [masterKey, setMasterKey] = useState('')
  const [binId, setBinId]     = useState('')
  const [mode, setMode]       = useState('new')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'new') {
        const newBinId = await createBin(masterKey)
        onComplete(masterKey, newBinId)
      } else {
        await fetchBin(masterKey, binId)
        onComplete(masterKey, binId)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your keys and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="setup-overlay">
      <div className="setup-card">
        {/* Language toggle on setup screen */}
        <button className="setup-lang-toggle" onClick={toggleLang}>
          {lang === 'en' ? '中文' : 'EN'}
        </button>

        <div className="setup-emblem">{t.appKanji}</div>
        <h1 className="setup-title">{t.appName}</h1>
        <p className="setup-subtitle">{t.appSubtitle}</p>

        {step === 0 && (
          <div className="setup-step">
            <h2>{t.setupBeforeTitle}</h2>
            <p>{t.setupBeforeDesc}</p>

            <div className="setup-steps-list">
              {[t.setupStep1, t.setupStep2, t.setupStep3].map((s, i) => (
                <div key={i} className="setup-step-item">
                  <span className="step-num">{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="setup-note">
              <span className="setup-note-icon">🔒</span>
              {t.setupPrivacy}
            </div>

            <button className="btn-primary" onClick={() => setStep(1)}>
              {t.setupHaveKey}
            </button>
            <button className="btn-ghost" onClick={() => onComplete(null, null)}>
              {t.setupSkip}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="setup-step">
            <h2>{t.setupConnectTitle}</h2>

            <div className="mode-toggle">
              <button className={mode === 'new' ? 'mode-btn active' : 'mode-btn'} onClick={() => setMode('new')}>
                {t.setupNewMode}
              </button>
              <button className={mode === 'existing' ? 'mode-btn active' : 'mode-btn'} onClick={() => setMode('existing')}>
                {t.setupExistingMode}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="setup-form">
              <label className="field-label">
                {t.setupMasterKey}
                <input
                  type="password"
                  className="field-input"
                  placeholder="$2b$10$..."
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  required
                />
              </label>

              {mode === 'existing' && (
                <label className="field-label">
                  {t.setupBinId}
                  <input
                    type="text"
                    className="field-input"
                    placeholder="66f3a..."
                    value={binId}
                    onChange={(e) => setBinId(e.target.value)}
                    required
                  />
                  <span className="field-hint">{t.setupBinHint}</span>
                </label>
              )}

              {error && <div className="setup-error">{error}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t.setupConnecting : mode === 'new' ? t.setupCreate : t.setupConnectBtn}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setStep(0)}>
                {t.setupBack}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
