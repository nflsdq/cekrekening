# 🔍 Website Cek Nama Pemilik Rekening & E-Wallet

Website ini memungkinkan pengguna untuk mengecek **nama pemilik rekening bank maupun e-wallet (OVO, DANA, GoPay, dll)** berdasarkan nomor rekening/nomor HP dan nama bank/provider yang dimasukkan.

🟢 **Live Website:** [https://cekrekening.naufalsidiq.xyz](https://cekrekening.naufalsidiq.xyz)

---

## 🚀 Fitur

- ✅ Cek nama pemilik **rekening bank** dan **e-wallet**
- 🏦 Mendukung berbagai bank di Indonesia (BCA, BRI, Mandiri, dll)
- 💳 Dukungan e-wallet seperti OVO, DANA, ShopeePay, GoPay, dan lainnya
- 📱 Antarmuka yang responsif dan mudah digunakan
- 🔐 Aman — data rekening dan e-wallet tidak disimpan

---

## 🔗 API Reference

API menggunakan mirror endpoints dengan fallback otomatis:
- Primary: `https://rfpdevid.site`
- Fallback: `https://rfpdev.me`

### Endpoints

#### Check Rekening Bank
- **Method:** `POST`
- **Endpoint:** `/api/check-rekening`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "account_number": "string",
    "bank_code": "string"
  }
  ```

#### Check E-Wallet
- **Method:** `POST`
- **Endpoint:** `/api/check-ewallet`
- **Content-Type:** `application/json`
- **Body:**
  ```json
  {
    "phone_number": "string",
    "ewallet_code": "string"
  }
  ```

### Bank Codes

Aplikasi ini mendukung 140+ bank di Indonesia dengan kode seperti:
- `bank_bca` - BCA
- `bank_bri` - BRI
- `bank_mandiri` - MANDIRI
- `bank_bni` - BNI
- dan lainnya...

### E-Wallet Codes

- `wallet_dana` - DANA
- `wallet_ovo` - OVO
- `gopay_user` - GOPAY USER
- `gopay_driver` - GOPAY DRIVER
- `wallet_shopeepay` - SHOPEEPAY
- `wallet_linkaja` - LINK AJA
- `grab_user` - GRAB USER
- `wallet_isaku` - I.SAKU
