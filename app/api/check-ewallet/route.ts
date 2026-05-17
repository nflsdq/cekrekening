import { NextResponse } from "next/server"
import got from "got"
import { CookieJar } from "tough-cookie"

const API_MIRRORS = ["https://rfpdevid.site", "https://rfpdev.xyz"]
const cookieJar = new CookieJar()

const gotClient = got.extend({
  cookieJar,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  timeout: { request: 10000 },
  retry: { limit: 0 },
})

async function proxyRequest(endpoint: string, bodyStr: string) {
  let lastError: Error | null = null

  for (const baseUrl of API_MIRRORS) {
    try {
      const response = await gotClient.post(`${baseUrl}${endpoint}`, {
        json: JSON.parse(bodyStr),
      })

      return new NextResponse(response.body, {
        status: response.statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      lastError = error as Error
      continue
    }
  }

  return new NextResponse(
    JSON.stringify({
      success: false,
      message: lastError?.message || "All API mirrors failed",
    }),
    {
      status: 502,
      headers: { "Content-Type": "application/json" },
    }
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  return proxyRequest("/api/check-ewallet", body)
}
