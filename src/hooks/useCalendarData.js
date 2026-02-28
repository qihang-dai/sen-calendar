import { useState, useEffect, useCallback } from 'react'
import { fetchBin, saveBin } from '../utils/jsonbin'

const LS_KEY = 'sen_days'
const LS_CREDS = 'sen_creds'

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveLocal(days) {
  localStorage.setItem(LS_KEY, JSON.stringify(days))
}

export function useCreds() {
  const [creds, setCreds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_CREDS) || 'null')
    } catch {
      return null
    }
  })

  const saveCreds = useCallback((masterKey, binId) => {
    const c = { masterKey, binId }
    localStorage.setItem(LS_CREDS, JSON.stringify(c))
    setCreds(c)
  }, [])

  const clearCreds = useCallback(() => {
    localStorage.removeItem(LS_CREDS)
    setCreds(null)
  }, [])

  return { creds, saveCreds, clearCreds }
}

export function useCalendarData(creds) {
  const [days, setDays] = useState(loadLocal)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)
  const [lastSynced, setLastSynced] = useState(null)

  // Load from remote on mount / creds change
  useEffect(() => {
    if (!creds) return
    setSyncing(true)
    fetchBin(creds.masterKey, creds.binId)
      .then((record) => {
        const merged = { ...loadLocal(), ...(record.days || {}) }
        setDays(merged)
        saveLocal(merged)
        setLastSynced(new Date())
        setSyncError(null)
      })
      .catch((err) => setSyncError(err.message))
      .finally(() => setSyncing(false))
  }, [creds])

  const saveDay = useCallback(
    async (dateKey, entry) => {
      const updated = { ...days, [dateKey]: entry }
      setDays(updated)
      saveLocal(updated)

      if (creds) {
        setSyncing(true)
        try {
          await saveBin(creds.masterKey, creds.binId, { days: updated })
          setLastSynced(new Date())
          setSyncError(null)
        } catch (err) {
          setSyncError(err.message)
        } finally {
          setSyncing(false)
        }
      }
    },
    [days, creds]
  )

  const deleteDay = useCallback(
    async (dateKey) => {
      const updated = { ...days }
      delete updated[dateKey]
      setDays(updated)
      saveLocal(updated)

      if (creds) {
        setSyncing(true)
        try {
          await saveBin(creds.masterKey, creds.binId, { days: updated })
          setLastSynced(new Date())
        } catch (err) {
          setSyncError(err.message)
        } finally {
          setSyncing(false)
        }
      }
    },
    [days, creds]
  )

  const clearMonth = useCallback(
    async (year, month) => {
      const prefix  = `${year}-${String(month).padStart(2, '0')}-`
      const updated = Object.fromEntries(
        Object.entries(days).filter(([k]) => !k.startsWith(prefix))
      )
      setDays(updated)
      saveLocal(updated)

      if (creds) {
        setSyncing(true)
        try {
          await saveBin(creds.masterKey, creds.binId, { days: updated })
          setLastSynced(new Date())
        } catch (err) {
          setSyncError(err.message)
        } finally {
          setSyncing(false)
        }
      }
    },
    [days, creds]
  )

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify({ days }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sen-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [days])

  const importData = useCallback(
    async (file) => {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const merged = { ...days, ...(parsed.days || {}) }
      setDays(merged)
      saveLocal(merged)
      if (creds) {
        await saveBin(creds.masterKey, creds.binId, { days: merged })
      }
    },
    [days, creds]
  )

  return { days, syncing, syncError, lastSynced, saveDay, deleteDay, clearMonth, exportData, importData }
}
