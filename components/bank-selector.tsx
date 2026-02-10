"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Bank } from "@/lib/types"

interface BankSelectorProps {
  items: Bank[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
}

export function BankSelector({
  items,
  value,
  onValueChange,
  placeholder = "Pilih...",
  emptyText = "Tidak ditemukan",
  className,
  disabled = false,
}: BankSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedItem = items.find((item) => item.value === value)

  // Group popular banks (the ones people use most)
  const popularValues = [
    "bank_bca", "bank_mandiri", "bank_bni", "bank_bri", "bank_cimb",
    "wallet_ovo", "wallet_dana", "gopay_user", "wallet_shopeepay", "wallet_linkaja"
  ]

  const popularItems = items.filter(item => popularValues.includes(item.value))
  const otherItems = items.filter(item => !popularValues.includes(item.value))

  // Filter items based on search
  const filteredPopular = popularItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )
  const filteredOthers = otherItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-medium",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedItem ? selectedItem.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <ScrollArea className="h-[300px]">
              {filteredPopular.length > 0 && (
                <CommandGroup heading="⭐ Populer">
                  {filteredPopular.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue)
                        setOpen(false)
                        setSearch("")
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {filteredOthers.length > 0 && (
                <CommandGroup heading="Semua">
                  {filteredOthers.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue)
                        setOpen(false)
                        setSearch("")
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
