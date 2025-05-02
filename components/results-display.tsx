"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Copy, X, Loader2 } from "lucide-react"
import type { AccountResult } from "@/lib/types"

interface ResultsDisplayProps {
  result: AccountResult | null
  error: string | null
  loading: boolean
}

export default function ResultsDisplay({ result, error, loading }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopiedField(field)
      setTimeout(() => {
        setCopied(false)
        setCopiedField(null)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-pink-500 dark:text-pink-400" />
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-2 border-pink-500 dark:border-pink-400 opacity-20"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Memeriksa rekening...</p>
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-100 dark:bg-red-900 neo-brutalism-shadow rounded-lg"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-200 dark:bg-red-800 rounded-full mr-3">
              <X className="w-6 h-6 text-red-700 dark:text-red-300" />
            </div>
            <p className="text-lg font-bold text-red-700 dark:text-red-300">Error</p>
          </div>
          <p className="text-red-600 dark:text-red-200 font-medium">{error}</p>
        </motion.div>
      ) : result ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div
            className={`p-6 rounded-lg neo-brutalism-shadow ${
              result.success ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
            }`}
          >
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-black flex items-center justify-center">
              {result.success ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                </motion.div>
              )}
            </div>

            <div className="flex items-center mb-6">
              <div
                className={`p-3 rounded-full mr-4 ${
                  result.success ? "bg-green-200 dark:bg-green-800" : "bg-red-200 dark:bg-red-800"
                }`}
              >
                {result.success ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Check className="w-8 h-8 text-green-700 dark:text-green-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <X className="w-8 h-8 text-red-700 dark:text-red-300" />
                  </motion.div>
                )}
              </div>
              <div>
                <p
                  className={`text-xl font-bold ${
                    result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {result.message === "ACCOUNT FOUND"
                    ? "Akun Ditemukan"
                    : result.message === "ACCOUNT NOT FOUND"
                      ? "Akun Tidak Ditemukan"
                      : result.message}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {result.success ? "Informasi rekening berhasil ditemukan" : "Rekening tidak ditemukan dalam sistem"}
                </p>
              </div>
            </div>

            {result.success && result.data && (
              <div className="space-y-4 mt-6">
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 neo-brutalism-shadow relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nama Pemilik:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900 dark:text-white select-text pl-2">
                      {result.data.account_holder}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(result.data.account_holder, "name")}
                      className={`p-2 rounded-full ${
                        copied && copiedField === "name"
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title="Salin nama"
                    >
                      {copied && copiedField === "name" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 neo-brutalism-shadow relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-pink-500"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nomor Rekening:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900 dark:text-white select-text pl-2">
                      {result.data.account_number}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(result.data.account_number, "number")}
                      className={`p-2 rounded-full ${
                        copied && copiedField === "number"
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title="Salin nomor"
                    >
                      {copied && copiedField === "number" ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 neo-brutalism-shadow relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bank/E-Wallet:</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white pl-2">{result.data.account_bank}</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  )
}
