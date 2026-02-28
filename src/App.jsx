import { useState } from 'react'
import dayjs from 'dayjs'
import { LanguageProvider } from './i18n/LanguageContext'
import { useCreds, useCalendarData } from './hooks/useCalendarData'
import SetupGuide from './components/SetupGuide'
import Header from './components/Header'
import MonthView from './components/MonthView'
import YearView from './components/YearView'
import DayModal from './components/DayModal'
import SettingsModal from './components/SettingsModal'

const LS_SETUP = 'sen_setup_done'

function AppInner() {
  const { creds, saveCreds, clearCreds } = useCreds()
  const { days, syncing, syncError, lastSynced, saveDay, deleteDay, clearMonth, exportData, importData } =
    useCalendarData(creds)

  const setupDone = !!localStorage.getItem(LS_SETUP)
  const [showSetup, setShowSetup] = useState(!setupDone)
  const [view, setView] = useState('month')

  const today = dayjs()
  const [year, setYear]   = useState(today.year())
  const [month, setMonth] = useState(today.month() + 1)

  const [selectedDay, setSelectedDay] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [justSaved, setJustSaved] = useState(null)

  function handleSaveDay(dateKey, entry) {
    saveDay(dateKey, entry)
    setJustSaved(dateKey)
    setTimeout(() => setJustSaved(null), 600)
  }

  function handleSetupComplete(masterKey, binId) {
    localStorage.setItem(LS_SETUP, '1')
    if (masterKey && binId) saveCreds(masterKey, binId)
    setShowSetup(false)
  }

  function handlePrev() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }

  function handleNext() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }

  if (showSetup) return <SetupGuide onComplete={handleSetupComplete} />

  return (
    <div className="app">
      <Header
        view={view}
        setView={setView}
        syncing={syncing}
        syncError={syncError}
        lastSynced={lastSynced}
        onExport={exportData}
        onImport={importData}
        onSettings={() => setShowSettings(true)}
      />

      <main className="app-main">
        {view === 'month' && (
          <MonthView
            year={year}
            month={month}
            days={days}
            onDayClick={setSelectedDay}
            onPrev={handlePrev}
            onNext={handleNext}
            onClearMonth={() => clearMonth(year, month)}
            justSaved={justSaved}
          />
        )}
        {view === 'year' && (
          <YearView
            year={year}
            days={days}
            onYearChange={setYear}
            onMonthClick={(m) => { setMonth(m); setView('month') }}
          />
        )}
      </main>

      {selectedDay && (
        <DayModal
          dateKey={selectedDay}
          entry={days[selectedDay] || {}}
          onSave={handleSaveDay}
          onDelete={deleteDay}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          creds={creds}
          onSaveCreds={saveCreds}
          onClearCreds={clearCreds}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
