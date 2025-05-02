import type { BankList } from "./types"

const API_BASE_URL = "https://cekrekening-api.belibayar.online/api/v1"

export async function fetchBankList(): Promise<BankList> {
  try {
    const response = await fetch(`${API_BASE_URL}/bank-list`)

    if (!response.ok) {
      throw new Error(`Failed to fetch bank list: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch bank list")
    }

    return data.data
  } catch (error) {
    console.error("Error fetching bank list:", error)
    throw error
  }
}

export async function checkAccount(accountNumber: string, accountBank: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/account-inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        account_bank: accountBank,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to check account: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "Account not found")
    }

    return data
  } catch (error) {
    console.error("Error checking account:", error)
    throw error
  }
}
