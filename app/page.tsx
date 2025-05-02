"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { fetchBankList, checkAccount } from "@/lib/api"
import ThemeToggle from "@/components/theme-toggle"
import LogoHeader from "@/components/logo-header"
import AccountForm from "@/components/account-form"
import ResultsDisplay from "@/components/results-display"
import HistorySidebar from "@/components/history-sidebar"
import AppFooter from "@/components/app-footer"
import { History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { BankList, AccountResult } from "@/lib/types"

type AccountType = "ewallet" | "bank"

interface HistoryItem {
  timestamp: number
  type: AccountType
  provider: string
  number: string
  result: AccountResult
}

export default function Home() {
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedType, setSelectedType] = useState<AccountType>("ewallet")
  const [selectedAccount, setSelectedAccount] = useState<string>("gopay")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AccountResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("searchHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [preloading, setPreloading] = useState(true)
  const [bankList, setBankList] = useState<BankList | null>(null)
  const [activeView, setActiveView] = useState<"form" | "result">("form")

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("searchHistory", JSON.stringify(history))
    }
  }, [history])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches))
    }
  }, [recentSearches])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchBankList()
        setBankList(data)
      } catch (err) {
        setError("Gagal memuat daftar bank. Silakan coba lagi.")
      } finally {
        setTimeout(() => setPreloading(false), 1000)
      }
    }

    loadInitialData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    setActiveView("result")

    try {
      const data = await checkAccount(accountNumber, selectedAccount)
      setResult(data)

      // Add to history
      if (data) {
        const historyItem: HistoryItem = {
          timestamp: Date.now(),
          type: selectedType,
          provider: selectedAccount,
          number: accountNumber,
          result: data,
        }
        setHistory((prev) => [historyItem, ...prev].slice(0, 10))

        // Add to recent searches
        if (!recentSearches.includes(accountNumber)) {
          setRecentSearches((prev) => [accountNumber, ...prev].slice(0, 5))
        }
      }
    } catch (err: any) {
      setError(err.message || "Gagal memeriksa rekening. Silakan coba lagi nanti.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setActiveView("form")
    setResult(null)
    setError(null)
  }

  const clearHistory = () => {
    setHistory([])
    setRecentSearches([])
  }

  const handleRecentSearch = (number: string) => {
    setAccountNumber(number)
    setShowHistory(false)
  }

  if (preloading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-yellow-50 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-5 neo-brutalism-shadow bg-blue-500 dark:bg-blue-600 rounded-lg mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-black">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 dark:bg-pink-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-pink-500 dark:text-pink-400">
              Cek Rekening Indonesia
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Memuat aplikasi...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-yellow-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="w-10 h-10 rounded-md border-2 border-black [box-shadow:2px_2px_0px_0px_black] hover:[box-shadow:none] bg-white dark:bg-gray-800"
          >
            <History className="h-5 w-5" />
            <span className="sr-only">Show history</span>
          </Button>
          <ThemeToggle />
        </div>

        <HistorySidebar
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onSelect={handleRecentSearch}
          onClear={clearHistory}
          bankList={bankList}
        />

        <div className="max-w-xl mx-auto">
          <LogoHeader />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 md:p-8 neo-brutalism-shadow rounded-lg mb-8 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-300 dark:bg-yellow-700 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-pink-300 dark:bg-pink-700 rounded-full opacity-50"></div>

            <div className="relative">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-dashed border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="inline-block w-3 h-3 bg-pink-500 mr-2 rounded-full"></span>
                  {activeView === "form" ? "Cek Rekening" : "Hasil Pencarian"}
                </h3>
                {activeView === "result" && (
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="text-sm px-3 py-1 h-auto neo-brutalism-button bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    Cek Lagi
                  </Button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {activeView === "form" ? (
                  <AccountForm
                    bankList={bankList}
                    accountNumber={accountNumber}
                    setAccountNumber={setAccountNumber}
                    selectedType={selectedType}
                    setSelectedType={setSelectedType}
                    selectedAccount={selectedAccount}
                    setSelectedAccount={setSelectedAccount}
                    loading={loading}
                    onSubmit={handleSubmit}
                    recentSearches={recentSearches}
                  />
                ) : (
                  <ResultsDisplay result={result} error={error} loading={loading} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <AppFooter />
        </div>
      </div>
    </div>
  )
}
