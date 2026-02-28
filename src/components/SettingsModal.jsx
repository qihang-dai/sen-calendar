import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function SettingsModal({ creds, onSaveCreds, onClearCreds, onClose }) {
  const { t } = useLanguage()
  const [masterKey, setMasterKey] = useState(creds?.masterKey || '')
  const [binId, setBinId]         = useState(creds?.binId || '')
  const [saved, setSaved]         = useState(false)

  function handleSave(e) {
    e.preventDefault()
    onSaveCreds(masterKey, binId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet settings-sheet">
        <div className="modal-handle" />
        <div className="modal-header">
          <span className="modal-date">{t.settingsTitle}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3 className="settings-section-title">{t.syncStorageTitle}</h3>
            <p className="settings-desc">
              {t.syncStorageDesc}{' '}
              <a href="https://jsonbin.io" target="_blank" rel="noreferrer">{t.getKeyLink}</a>
            </p>

            <form onSubmit={handleSave} className="setup-form">
              <label className="field-label">
                {t.setupMasterKey}
                <input
                  type="password"
                  className="field-input"
                  placeholder="$2b$10$..."
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                />
              </label>
              <label className="field-label">
                {t.setupBinId}
                <input
                  type="text"
                  className="field-input"
                  placeholder="66f3a..."
                  value={binId}
                  onChange={(e) => setBinId(e.target.value)}
                />
              </label>
              <div className="settings-actions">
                <button type="submit" className="btn-primary">
                  {saved ? t.keysSaved : t.saveKeys}
                </button>
                {creds && (
                  <button type="button" className="btn-danger" onClick={() => { onClearCreds(); onClose() }}>
                    {t.disconnectSync}
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="modal-section">
            <h3 className="settings-section-title">{t.aboutTitle}</h3>
            <p className="settings-desc">{t.aboutDesc}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
