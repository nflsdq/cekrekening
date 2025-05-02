"use client"

import { motion } from "framer-motion"
import { History } from "lucide-react"

interface HistoryButtonProps {
  onClick: () => void
}

export default function HistoryButton({ onClick }: HistoryButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-2 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] bg-[#8bd3dd] dark:bg-[#3da9fc] text-black dark:text-white"
      aria-label="Riwayat"
    >
      <History size={20} />
    </motion.button>
  )
}
