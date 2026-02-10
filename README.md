# Cek Rekening & E-Wallet Checker

Platform web modern untuk memverifikasi identitas pemilik rekening bank dan akun e-wallet di Indonesia secara akurat dan real-time. Project ini dirancang untuk meminimalisir kesalahan transfer dan penipuan dengan memvalidasi tujuan pembayaran sebelum transaksi dilakukan.

Live Website: [https://cekrekening.naufalsidiq.xyz](https://cekrekening.naufalsidiq.xyz)

---

## Fitur Utama

- **Multi-Bank Support**: Mendukung pengecekan ke lebih dari 140 bank di Indonesia (BCA, Mandiri, BRI, BNI, BSI, Jenius, dll).
- **E-Wallet Integration**: Dukungan luas untuk dompet digital populer (DANA, OVO, GoPay, ShopeePay, LinkAja, i.Saku).
- **Real-time Verification**: Mendapatkan data nama pemilik rekening secara instan dengan latensi rendah.
- **Privacy Focused**: Arsitektur *stateless* memastikan tidak ada data rekening atau nomor HP sensitif yang disimpan di database kami.
- **Responsive Design**: Antarmuka pengguna yang adaptif untuk kenyamanan akses melalui Desktop, Tablet, maupun Mobile.

## Teknologi yang Digunakan

Project ini dibangun menggunakan standar pengembangan web modern untuk performa dan maintainability yang optimal:

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Memulai Pengembangan (Local Development)

Ikuti langkah-langkah berikut untuk menjalankan project ini di lingkungan lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi LTS disarankan)
- [pnpm](https://pnpm.io/installation)

### Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/username/cekrekening.git
   cd cekrekening
   ```

2. **Install dependencies**
   Kami menggunakan `pnpm` untuk manajemen paket yang lebih cepat dan efisien.
   ```bash
   pnpm install
   ```

3. **Jalankan Development Server**
   ```bash
   pnpm dev
   ```

4. **Akses Aplikasi**
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Kontribusi

Kontribusi sangat dihargai. Jika Anda memiliki saran fitur atau menemukan bug, silakan buat *issue* atau kirimkan *pull request*.

## Lisensi

Project ini dilisensikan di bawah lisensi [MIT](LICENSE).

---

*Dikembangkan untuk meningkatkan keamanan transaksi digital di Indonesia.*
