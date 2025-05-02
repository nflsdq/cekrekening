"use client"

import { motion } from "framer-motion"

interface RecentSearchesProps {
  recentSearches: string[]
  onSelect: (number: string) => void
}

export default function RecentSearches({ recentSearches, onSelect }: RecentSearchesProps) {
  return (
    <div className="mb-6 pb-4 border-b-2 border-dashed border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
        <span className="inline-block w-2 h-2 bg-blue-500 mr-2 rounded-full"></span>
        Pencarian Terakhir:
      </h3>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((number, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(number)}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors shadow-sm"
          >
            {number}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
