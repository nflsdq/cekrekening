import type { BankList, AccountResult } from "./types"
import { BANK_DATA } from "./bank-data"

// Mirror endpoints dengan fallback
const API_MIRRORS = ["https://rfpdevid.site", "https://rfpdev.me"]

/**
 * Fetch dengan fallback otomatis ke mirror endpoint
 * Akan mencoba mirror pertama, jika gagal (network error/timeout/5xx) akan coba mirror kedua
 */
async function fetchWithFallback(
  endpoint: string,
  options: RequestInit
): Promise<Response> {
  let lastError: Error | null = null

  for (const baseUrl of API_MIRRORS) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, options)

      // Jika response 5xx, coba mirror berikutnya
      if (response.status >= 500) {
        lastError = new Error(`Server error: ${response.status}`)
        continue
      }

      // Response berhasil atau 4xx (client error) langsung return
      return response
    } catch (error) {
      // Network error atau timeout, coba mirror berikutnya
      lastError = error as Error
      continue
    }
  }

  // Semua mirror gagal
  throw lastError || new Error("All API mirrors failed")
}

/**
 * Fetch bank list dari data statis
 */
export async function fetchBankList(): Promise<BankList> {
  // Return data statis karena API baru tidak punya endpoint untuk bank list
  return BANK_DATA
}

/**
 * Check rekening bank
 * API Endpoint: POST /api/check-rekening
 * Parameters: { account_number, bank_code }
 */
export async function checkBankAccount(
  accountNumber: string,
  bankCode: string
): Promise<AccountResult> {
  try {
    const response = await fetchWithFallback("/api/check-rekening", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: accountNumber,
        bank_code: bankCode,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to check account: ${response.status}`)
    }

    const data = await response.json()

    // Transform response dari format baru ke format lama untuk backward compatibility
    if (data.status === "success") {
      return {
        success: true,
        message: data.message || "ACCOUNT FOUND",
        data: {
          account_number: data.data.account_number || accountNumber,
          account_holder: data.data.customer_name || data.data.account_holder,
          account_bank: data.data.bank_name || data.data.bank_code,
        },
      }
    } else {
      return {
        success: false,
        message: data.message || "Account not found",
        data: {
          account_number: accountNumber,
          account_holder: "",
          account_bank: bankCode,
        },
      }
    }
  } catch (error) {
    console.error("Error checking bank account:", error)
    throw error
  }
}

/**
 * Check e-wallet
 * API Endpoint: POST /api/check-ewallet
 * Parameters: { phone_number, ewallet_code }
 */
export async function checkEwalletAccount(
  phoneNumber: string,
  ewalletCode: string
): Promise<AccountResult> {
  try {
    const response = await fetchWithFallback("/api/check-ewallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        ewallet_code: ewalletCode,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to check e-wallet: ${response.status}`)
    }

    const data = await response.json()

    // Transform response dari format baru ke format lama untuk backward compatibility
    if (data.status === "success") {
      return {
        success: true,
        message: data.message || "ACCOUNT FOUND",
        data: {
          account_number: data.data.phone_number || phoneNumber,
          account_holder: data.data.customer_name,
          account_bank: data.data.ewallet_name || data.data.ewallet_code,
        },
      }
    } else {
      return {
        success: false,
        message: data.message || "Account not found",
        data: {
          account_number: phoneNumber,
          account_holder: "",
          account_bank: ewalletCode,
        },
      }
    }
  } catch (error) {
    console.error("Error checking e-wallet account:", error)
    throw error
  }
}

/**
 * Legacy function untuk backward compatibility
 * Akan otomatis mendeteksi apakah bank atau ewallet berdasarkan accountBank code
 */
export async function checkAccount(
  accountNumber: string,
  accountBank: string
): Promise<AccountResult> {
  // Deteksi apakah ini ewallet atau bank berdasarkan prefix code
  const isEwallet =
    accountBank.startsWith("wallet_") ||
    accountBank.startsWith("gopay_") ||
    accountBank.startsWith("grab_")

  if (isEwallet) {
    return checkEwalletAccount(accountNumber, accountBank)
  } else {
    return checkBankAccount(accountNumber, accountBank)
  }
}
