export interface Bank {
  value: string
  label: string
}

export interface BankList {
  banks: Bank[]
  ewallets: Bank[]
}

// Response format dari API lama (untuk backward compatibility)
export interface AccountResult {
  success: boolean
  message: string
  data: {
    account_number: string
    account_holder: string
    account_bank: string
  }
}

// Response format baru dari API
export interface ApiResponse<T> {
  status: "success" | "error"
  message: string
  data: T
}

// Response data untuk bank check
export interface BankCheckData {
  customer_name: string
  account_number: string
  bank_name?: string
  bank_code: string
}

// Response data untuk e-wallet check
export interface EwalletCheckData {
  customer_name: string
  phone_number: string
  ewallet_name: string
  ewallet_code: string
}

// Type untuk membedakan bank vs ewallet
export type AccountType = "bank" | "ewallet"
