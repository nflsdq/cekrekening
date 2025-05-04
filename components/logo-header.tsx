"use client"

import { motion } from "framer-motion"
import { Wallet } from "lucide-react"

export default function LogoHeader() {
  return (
    <div className="text-center mb-8 md:mb-12 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-20 h-20 rounded-full bg-pink-300 dark:bg-pink-800 opacity-20 blur-xl"></div>
        <div className="absolute top-20 right-1/4 w-32 h-32 rounded-full bg-blue-300 dark:bg-blue-800 opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-yellow-300 dark:bg-yellow-800 opacity-20 blur-xl"></div>
      </div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        className="relative"
      >
        <div className="inline-block p-5 neo-brutalism-shadow bg-blue-500 dark:bg-blue-600 rounded-lg mb-6 animate-float">
          <img 
            src="https://i.ibb.co.com/D2n3SJB/logo.png" 
            alt="Wallet Icon" 
            className="w-14 h-14 md:w-18 md:h-18 object-contain"
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-full border-2 border-black"></div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-4 relative inline-block"
      >
        <span className="text-pink-500 dark:text-pink-400">Cek Rekening</span>
        <div className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-400 dark:bg-yellow-500 -z-10 transform -rotate-1"></div>
      </motion.h2>

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto"
      >
        Cek Nama Pengguna Rekening E-Wallet dan Bank dengan mudah
      </motion.p>
    </div>
  )
}
