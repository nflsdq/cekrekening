"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, AlertCircle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BankSelector } from "@/components/bank-selector"
import RecentSearches from "@/components/recent-searches"
import type { BankList } from "@/lib/types"

type AccountType = "ewallet" | "bank"

interface AccountFormProps {
  bankList: BankList | null
  accountNumber: string
  setAccountNumber: (value: string) => void
  selectedType: AccountType
  setSelectedType: (value: AccountType) => void
  selectedAccount: string
  setSelectedAccount: (value: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  recentSearches: string[]
}

export default function AccountForm({
  bankList,
  accountNumber,
  setAccountNumber,
  selectedType,
  setSelectedType,
  selectedAccount,
  setSelectedAccount,
  loading,
  onSubmit,
  recentSearches,
}: AccountFormProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleRecentSearch = (number: string) => {
    setAccountNumber(number)
  }

  // Input validation
  const validation = useMemo(() => {
    if (!accountNumber) return { valid: true, message: "" }

    const cleaned = accountNumber.replace(/\D/g, "")

    if (selectedType === "ewallet") {
      // E-wallet: nomor HP
      if (cleaned.length < 10) {
        return { valid: false, message: "Minimal 10 digit" }
      }
      if (cleaned.length > 13) {
        return { valid: false, message: "Maksimal 13 digit" }
      }
      if (!cleaned.startsWith("08") && !cleaned.startsWith("628")) {
        return { valid: false, message: "Harus dimulai dengan 08 atau 628" }
      }
      return { valid: true, message: "✓ Format valid" }
    } else {
      // Bank: nomor rekening
      if (cleaned.length < 10) {
        return { valid: false, message: "Minimal 10 digit" }
      }
      if (cleaned.length > 20) {
        return { valid: false, message: "Maksimal 20 digit" }
      }
      return { valid: true, message: "✓ Format valid" }
    }
  }, [accountNumber, selectedType])

  // Auto-clean input on paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const cleaned = pastedText.replace(/\D/g, "")
    setAccountNumber(cleaned)
  }

  // Only allow numbers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setAccountNumber(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {recentSearches.length > 0 && <RecentSearches recentSearches={recentSearches} onSelect={handleRecentSearch} />}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Label
              htmlFor="type"
              className="block text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center"
            >
              <span className="inline-block w-3 h-3 bg-purple-500 mr-2 rounded-full"></span>
              Jenis Rekening
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value as AccountType)
                setSelectedAccount(value === "ewallet" ? "wallet_ovo" : "bank_bca")
              }}
            >
              <SelectTrigger
                className={`
                  w-full p-3 rounded-lg neo-brutalism-shadow text-gray-900 dark:text-white 
                  font-medium transition-all duration-300
                  ${
                    focusedField === "type"
                      ? "bg-purple-200 dark:bg-purple-900 border-purple-500 dark:border-purple-400"
                      : "bg-purple-100 dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-gray-600"
                  }
                `}
                onFocus={() => setFocusedField("type")}
                onBlur={() => setFocusedField(null)}
              >
                <SelectValue placeholder="Pilih jenis rekening" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ewallet" className="cursor-pointer">
                  E-Wallet
                </SelectItem>
                <SelectItem value="bank" className="cursor-pointer">
                  Bank
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-purple-300 dark:bg-purple-700 rounded-full border-2 border-black z-10"></div>
          </div>

          <div className="relative">
            <Label
              htmlFor="account"
              className="block text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center"
            >
              <span className="inline-block w-3 h-3 bg-yellow-500 mr-2 rounded-full"></span>
              {selectedType === "ewallet" ? "Pilih E-Wallet" : "Pilih Bank"}
            </Label>
            <BankSelector
              items={(selectedType === "ewallet" ? bankList?.ewallets : bankList?.banks) || []}
              value={selectedAccount}
              onValueChange={setSelectedAccount}
              placeholder={selectedType === "ewallet" ? "Pilih e-wallet" : "Pilih bank"}
              emptyText="Tidak ditemukan"
              className={`
                w-full p-3 rounded-lg neo-brutalism-shadow text-gray-900 dark:text-white 
                font-medium transition-all duration-300
                ${
                  focusedField === "account"
                    ? "bg-yellow-200 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-400"
                    : "bg-yellow-100 dark:bg-gray-700 hover:bg-yellow-200 dark:hover:bg-gray-600"
                }
              `}
            />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-300 dark:bg-yellow-700 rounded-full border-2 border-black z-10"></div>
          </div>
        </div>

        <div className="relative">
          <Label
            htmlFor="accountNumber"
            className="block text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center"
          >
            <span className="inline-block w-3 h-3 bg-green-500 mr-2 rounded-full"></span>
            {selectedType === "ewallet" ? "Nomor HP" : "Nomor Rekening"}
          </Label>
          <div className="relative">
            <Input
              id="accountNumber"
              type="text"
              required
              value={accountNumber}
              onChange={handleInputChange}
              onPaste={handlePaste}
              className={`
                w-full p-3 pr-10 rounded-lg neo-brutalism-shadow text-gray-900 dark:text-white 
                font-medium placeholder-gray-500 transition-all duration-300
                ${
                  focusedField === "accountNumber"
                    ? "bg-green-200 dark:bg-green-900 border-green-500 dark:border-green-400"
                    : "bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600"
                }
                ${accountNumber && !validation.valid ? "border-red-500 dark:border-red-400" : ""}
              `}
              placeholder={selectedType === "ewallet" ? "Masukkan nomor HP (08xxx)" : "Masukkan nomor rekening"}
              onFocus={() => setFocusedField("accountNumber")}
              onBlur={() => setFocusedField(null)}
            />
            {accountNumber && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {validation.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
            )}
          </div>
          {accountNumber && validation.message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm mt-2 font-medium ${
                validation.valid
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {validation.message}
            </motion.p>
          )}
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-green-300 dark:bg-green-700 rounded-full border-2 border-black z-10"></div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative mt-8">
          <Button
            type="submit"
            disabled={loading || !validation.valid || !accountNumber}
            className="w-full py-4 px-6 bg-pink-500 dark:bg-pink-600 text-white font-bold rounded-lg neo-brutalism-shadow neo-brutalism-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="ml-2">Memeriksa...</span>
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                <span>Cek Rekening</span>
              </>
            )}
          </Button>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-pink-300 dark:bg-pink-700 rounded-full border-2 border-black z-10"></div>
        </motion.div>
      </form>
    </motion.div>
  )
}
