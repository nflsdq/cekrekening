"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, User, CreditCard } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AccountResult } from "@/lib/types"

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  history: AccountResult[]
  onSelect: (item: AccountResult) => void
}

export default function HistoryDrawer({ isOpen, onClose, history, onSelect }: HistoryDrawerProps) {
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
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-[#fef6e4] dark:bg-[#232946] z-50 border-l-2 border-black shadow-lg"
          >
            <div className="p-4 border-b-2 border-black bg-[#8bd3dd] dark:bg-[#3da9fc] text-black dark:text-white flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Clock className="h-5 w-5" />
                RIWAYAT CEK
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="rounded-full border-2 border-black h-8 w-8 p-0 flex items-center justify-center bg-white dark:bg-[#2b2d42] hover:bg-[#f9f4ef] dark:hover:bg-[#121629]"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <ScrollArea className="h-[calc(100vh-64px)] p-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                  <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center bg-white dark:bg-[#2b2d42] mb-4">
                    <span className="text-2xl">📜</span>
                  </div>
                  <p className="text-lg font-bold mb-2">Belum Ada Riwayat</p>
                  <p className="text-gray-500 dark:text-gray-400">Riwayat pencarian akan muncul di sini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.03, x: 5 }}
                      className="p-3 border-2 border-black bg-white dark:bg-[#2b2d42] rounded-md cursor-pointer hover:bg-[#f9f4ef] dark:hover:bg-[#121629] transition-all"
                      onClick={() => onSelect(item)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-[#f582ae] dark:text-[#ff8906]" />
                        <span className="font-bold text-base">{item.data.account_bank.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-[#8bd3dd] dark:text-[#3da9fc]" />
                        <span className="font-medium">{item.data.account_holder}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">{item.data.account_number}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
