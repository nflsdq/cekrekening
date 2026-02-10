"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, RefreshCw, Trash, Clock, CreditCard, User, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BankList, AccountResult } from "@/lib/types"

type AccountType = "ewallet" | "bank"

interface HistoryItem {
  timestamp: number
  type: AccountType
  provider: string
  number: string
  result: AccountResult
}

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onSelect: (number: string) => void
  onClear: () => void
  bankList: BankList | null
}

export default function HistorySidebar({ isOpen, onClose, history, onSelect, onClear, bankList }: HistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "bank" | "ewallet">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "found" | "notfound">("all")

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp))
  }

  // Filtered history
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Search filter
      const matchSearch =
        item.number.includes(searchQuery) ||
        item.result.data?.account_holder?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bankList?.banks.find((b) => b.value === item.provider)?.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bankList?.ewallets.find((e) => e.value === item.provider)?.label.toLowerCase().includes(searchQuery.toLowerCase())

      // Type filter
      const matchType = filterType === "all" || item.type === filterType

      // Status filter
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "found" && item.result.success) ||
        (filterStatus === "notfound" && !item.result.success)

      return matchSearch && matchType && matchStatus
    })
  }, [history, searchQuery, filterType, filterStatus, bankList])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 bg-blue-500 dark:bg-blue-600 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Riwayat Pencarian
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClear}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors neo-brutalism-button"
                      title="Hapus semua riwayat"
                    >
                      <Trash className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors neo-brutalism-button"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nomor atau nama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-black"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setFilterType("all")}
                      className={`flex-1 neo-brutalism-button ${
                        filterType === "all"
                          ? "bg-white text-blue-600"
                          : "bg-blue-400 dark:bg-blue-700 text-white hover:bg-blue-300"
                      }`}
                    >
                      Semua
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFilterType("bank")}
                      className={`flex-1 neo-brutalism-button ${
                        filterType === "bank"
                          ? "bg-white text-blue-600"
                          : "bg-blue-400 dark:bg-blue-700 text-white hover:bg-blue-300"
                      }`}
                    >
                      Bank
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFilterType("ewallet")}
                      className={`flex-1 neo-brutalism-button ${
                        filterType === "ewallet"
                          ? "bg-white text-blue-600"
                          : "bg-blue-400 dark:bg-blue-700 text-white hover:bg-blue-300"
                      }`}
                    >
                      E-Wallet
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                      className={`flex-1 text-xs neo-brutalism-button ${
                        filterStatus === "all"
                          ? "bg-white text-blue-600"
                          : "bg-blue-400 dark:bg-blue-700 text-white hover:bg-blue-300"
                      }`}
                    >
                      Semua Status
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFilterStatus("found")}
                      className={`flex-1 text-xs neo-brutalism-button ${
                        filterStatus === "found"
                          ? "bg-white text-blue-600"
                          : "bg-blue-400 dark:bg-blue-700 text-white hover:bg-blue-300"
                      }`}
                    >
                      Ditemukan
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFilterStatus("notfound")}
                      className={`flex-1 text-xs neo-brutalism-button ${
                        filterStatus === "notfound"
                          ? "bg-white text-blue-600"
                          : "bg-blue-400 dark:bg-blue-700 text-white hover:bg-blue-300"
                      }`}
                    >
                      Tidak Ditemukan
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 neo-brutalism-shadow">
                      <Clock className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-300">Belum Ada Riwayat</p>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                      Riwayat pencarian akan muncul di sini setelah Anda melakukan pencarian rekening.
                    </p>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 neo-brutalism-shadow">
                      <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-lg font-bold mb-2 text-gray-700 dark:text-gray-300">Tidak Ada Hasil</p>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                      Tidak ada riwayat yang cocok dengan filter yang Anda pilih.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHistory.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg neo-brutalism-shadow relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(item.timestamp)}
                          </span>
                          <span className="text-sm font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            {item.type === "ewallet" ? "E-Wallet" : "Bank"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <CreditCard className="w-4 h-4 text-purple-500 mr-2" />
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.type === "ewallet"
                                ? bankList?.ewallets.find((w) => w.value === item.provider)?.label
                                : bankList?.banks.find((b) => b.value === item.provider)?.label}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-gray-600 dark:text-gray-300">{item.number}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onSelect(item.number)}
                              className="p-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900 rounded-full"
                              title="Gunakan nomor ini"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <div className="flex items-center mt-1">
                            <User className="w-4 h-4 text-green-500 mr-2" />
                            <p
                              className={`font-medium ${
                                item.result.message === "ACCOUNT FOUND"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {item.result.message === "ACCOUNT FOUND"
                                ? item.result.data?.account_holder || "Ditemukan"
                                : "Tidak Ditemukan"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
