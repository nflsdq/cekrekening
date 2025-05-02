"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
                setSelectedAccount(value === "ewallet" ? "gopay" : "bca")
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
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger
                className={`
                  w-full p-3 rounded-lg neo-brutalism-shadow text-gray-900 dark:text-white 
                  font-medium transition-all duration-300
                  ${
                    focusedField === "account"
                      ? "bg-yellow-200 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-400"
                      : "bg-yellow-100 dark:bg-gray-700 hover:bg-yellow-200 dark:hover:bg-gray-600"
                  }
                `}
                onFocus={() => setFocusedField("account")}
                onBlur={() => setFocusedField(null)}
              >
                <SelectValue placeholder={selectedType === "ewallet" ? "Pilih e-wallet" : "Pilih bank"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {(selectedType === "ewallet" ? bankList?.ewallets : bankList?.banks)?.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="cursor-pointer">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-300 dark:bg-yellow-700 rounded-full border-2 border-black z-10"></div>
          </div>
        </div>

        <div className="relative">
          <Label
            htmlFor="accountNumber"
            className="block text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center"
          >
            <span className="inline-block w-3 h-3 bg-green-500 mr-2 rounded-full"></span>
            Nomor Rekening
          </Label>
          <Input
            id="accountNumber"
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className={`
              w-full p-3 rounded-lg neo-brutalism-shadow text-gray-900 dark:text-white 
              font-medium placeholder-gray-500 transition-all duration-300
              ${
                focusedField === "accountNumber"
                  ? "bg-green-200 dark:bg-green-900 border-green-500 dark:border-green-400"
                  : "bg-green-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-gray-600"
              }
            `}
            placeholder="Masukkan nomor rekening"
            onFocus={() => setFocusedField("accountNumber")}
            onBlur={() => setFocusedField(null)}
          />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-green-300 dark:bg-green-700 rounded-full border-2 border-black z-10"></div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative mt-8">
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-pink-500 dark:bg-pink-600 text-white font-bold rounded-lg neo-brutalism-shadow neo-brutalism-button disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2"
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
