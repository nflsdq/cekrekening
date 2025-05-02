export interface Bank {
  value: string
  label: string
}

export interface BankList {
  banks: Bank[]
  ewallets: Bank[]
}

export interface AccountResult {
  success: boolean
  message: string
  data: {
    account_number: string
    account_holder: string
    account_bank: string
  }
}
