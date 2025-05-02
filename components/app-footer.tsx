"use client"

import { motion } from "framer-motion"
import { Instagram, Github, Flame } from "lucide-react"

export default function AppFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-center text-sm text-gray-600 dark:text-gray-400 space-y-4 mt-12 pb-8"
    >
      <div className="flex items-center justify-center space-x-6">
        <a
          href="https://instagram.com/nflsdq_"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors flex items-center space-x-1"
        >
          <Instagram className="w-4 h-4" />
          <span>@nflsdq_</span>
        </a>
        <a
          href="https://documenter.getpostman.com/view/31839079/2sAYQgi8yL"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center space-x-1"
        >
          <Flame className="w-4 h-4" />
          <span>Api Source</span>
        </a>
      </div>

      <div className="relative inline-block">
        <div className="px-4 py-2 bg-black text-white font-bold text-xs transform rotate-1 neo-brutalism-shadow">
          © {new Date().getFullYear()} Cek Rekening Indonesia
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-black"></div>
      </div>
    </motion.footer>
  )
}
