"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { fetchBankList, checkBankAccount, checkEwalletAccount } from "@/lib/api"
import ThemeToggle from "@/components/theme-toggle"
import LogoHeader from "@/components/logo-header"
import AccountForm from "@/components/account-form"
import ResultsDisplay from "@/components/results-display"
import HistorySidebar from "@/components/history-sidebar"
import AppFooter from "@/components/app-footer"
import { History, Star, EyeOff, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { BankList, AccountResult } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AccountType = "ewallet" | "bank"

interface HistoryItem {
  timestamp: number
  type: AccountType
  provider: string
  number: string
  result: AccountResult
}

interface Favorite {
  id: string
  label: string
  type: AccountType
  provider: string
  number: string
  customerName?: string
  createdAt: number
}

export default function Home() {
  const [accountNumber, setAccountNumber] = useState("")
  const [selectedType, setSelectedType] = useState<AccountType>("ewallet")
  const [selectedAccount, setSelectedAccount] = useState<string>("wallet_ovo")
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
  const [incognitoMode, setIncognitoMode] = useState(false)
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [showFavoritesDialog, setShowFavoritesDialog] = useState(false)
  const [favoriteLabel, setFavoriteLabel] = useState("")

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
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites])

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        const input = document.getElementById("accountNumber") as HTMLInputElement
        input?.focus()
        toast.info("Fokus ke input", { duration: 1000 })
      }

      // Ctrl/Cmd + H: Toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault()
        setShowHistory(!showHistory)
      }

      // Ctrl/Cmd + I: Toggle incognito
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault()
        setIncognitoMode(!incognitoMode)
        toast.info(incognitoMode ? "Mode Normal" : "Mode Incognito", {
          description: incognitoMode ? "Pencarian akan disimpan" : "Pencarian tidak akan disimpan"
        })
      }

      // Esc: Close history/reset
      if (e.key === "Escape") {
        if (showHistory) {
          setShowHistory(false)
        } else if (activeView === "result") {
          resetForm()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showHistory, activeView, incognitoMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    setActiveView("result")

    try {
      // Panggil fungsi yang sesuai berdasarkan tipe akun
      const data =
        selectedType === "ewallet"
          ? await checkEwalletAccount(accountNumber, selectedAccount)
          : await checkBankAccount(accountNumber, selectedAccount)
      setResult(data)

      // Show toast based on result
      if (data.success) {
        toast.success("Rekening ditemukan!", {
          description: `Atas nama ${data.data.account_holder}`
        })
      } else {
        toast.error("Rekening tidak ditemukan", {
          description: "Pastikan nomor rekening yang Anda masukkan benar"
        })
      }

      // Add to history (skip if incognito mode)
      if (data && !incognitoMode) {
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
      const errorMsg = err.message || "Gagal memeriksa rekening. Silakan coba lagi nanti."
      setError(errorMsg)
      toast.error("Gagal memeriksa rekening", {
        description: errorMsg
      })
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = () => {
    if (!favoriteLabel.trim()) {
      toast.error("Label harus diisi")
      return
    }

    const favorite: Favorite = {
      id: Date.now().toString(),
      label: favoriteLabel,
      type: selectedType,
      provider: selectedAccount,
      number: accountNumber,
      customerName: result?.data.account_holder,
      createdAt: Date.now()
    }

    setFavorites((prev) => [favorite, ...prev])
    setShowFavoritesDialog(false)
    setFavoriteLabel("")
    toast.success("Ditambahkan ke favorit!", {
      description: `"${favoriteLabel}" berhasil disimpan`
    })
  }

  const loadFavorite = (fav: Favorite) => {
    setSelectedType(fav.type)
    setSelectedAccount(fav.provider)
    setAccountNumber(fav.number)
    setActiveView("form")
    toast.info("Favorit dimuat", {
      description: fav.label
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter(f => f.id !== id))
    toast.success("Dihapus dari favorit")
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
            onClick={() => setIncognitoMode(!incognitoMode)}
            className={`w-10 h-10 rounded-md border-2 border-black [box-shadow:2px_2px_0px_0px_black] hover:[box-shadow:none] ${incognitoMode
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-white dark:bg-gray-800"
              }`}
            title={incognitoMode ? "Mode Incognito (Ctrl+I)" : "Mode Normal (Ctrl+I)"}
          >
            {incognitoMode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            <span className="sr-only">Toggle incognito</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="w-10 h-10 rounded-md border-2 border-black [box-shadow:2px_2px_0px_0px_black] hover:[box-shadow:none] bg-white dark:bg-gray-800"
            title="Riwayat (Ctrl+H)"
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

          {/* Incognito Mode Banner */}
          {incognitoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg neo-brutalism-shadow border-2 border-purple-500"
            >
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                <EyeOff className="w-5 h-5" />
                <p className="text-sm font-medium">
                  Mode Incognito: Pencarian tidak akan disimpan ke riwayat
                </p>
              </div>
            </motion.div>
          )}

          {/* Favorites Section */}
          {favorites.length > 0 && activeView === "form" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="bg-yellow-50 dark:bg-gray-800 p-4 rounded-lg neo-brutalism-shadow border-2 border-yellow-400 dark:border-yellow-600">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" />
                    Favorit
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Ctrl+K untuk fokus input
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {favorites.slice(0, 5).map((fav) => (
                    <div key={fav.id} className="relative group">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => loadFavorite(fav)}
                        className="px-3 py-1.5 bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-white rounded-full text-xs font-medium hover:bg-yellow-300 dark:hover:bg-yellow-600 transition-colors border-2 border-black"
                      >
                        {fav.label}
                      </motion.button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFavorite(fav.id)
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

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
                  <div className="flex gap-2">
                    {result?.success && !incognitoMode && (
                      <Dialog open={showFavoritesDialog} onOpenChange={setShowFavoritesDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="neo-brutalism-button bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Favorit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Tambah ke Favorit</DialogTitle>
                            <DialogDescription>
                              Beri label untuk rekening ini agar mudah diakses nanti
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="favorite-label">Label Favorit</Label>
                              <Input
                                id="favorite-label"
                                placeholder="Contoh: Rekening Gaji, Supplier A, dll"
                                value={favoriteLabel}
                                onChange={(e) => setFavoriteLabel(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") addToFavorites()
                                }}
                              />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
                              <p className="font-medium">{accountNumber}</p>
                              <p className="text-sm text-gray-500">{result?.data.account_holder}</p>
                            </div>
                            <Button onClick={addToFavorites} className="w-full neo-brutalism-button">
                              <Star className="w-4 h-4 mr-2" />
                              Simpan ke Favorit
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      size="sm"
                      className="neo-brutalism-button bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      Cek Lagi
                    </Button>
                  </div>
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
