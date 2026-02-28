import { createContext, useContext, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { translations } from './translations'

const LanguageContext = createContext()
const LS_LANG = 'sen_lang'

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(LS_LANG) || 'en')

  // Keep dayjs locale in sync
  useEffect(() => {
    dayjs.locale(lang === 'zh' ? 'zh-cn' : 'en')
  }, [lang])

  function setLang(l) {
    localStorage.setItem(LS_LANG, l)
    setLangState(l)
  }

  function toggleLang() {
    setLang(lang === 'en' ? 'zh' : 'en')
  }

  const t = translations[lang] ?? translations.en

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
