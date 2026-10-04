import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, es, type TranslationKey } from './translations'

export type Lang = 'es' | 'en'

const dictionaries = { es, en }
const STORAGE_KEY = 'lang'

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangContextValue | null>(null)

const initialLang = (): Lang => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {
    // storage can be blocked (private mode); fall back to the browser language
  }
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage can be blocked; the choice just won't persist
    }
  }, [lang])

  const t = (key: TranslationKey) => dictionaries[lang][key]

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
