# Vaulted Web

## Deskripsi Aplikasi

Vaulted adalah platform aplikasi web untuk manajemen koleksi, marketplace, dan lelang secara realtime. Aplikasi ini dibangun menggunakan
stack MERN (MongoDB, Express.js, React.js, Node.js) dengan dukungan TypeScript di backend dan Vite di frontend. Vaulted Web juga dilengkapi
dengan integrasi payment gateway Xendit untuk memfasilitasi transaksi pembayaran dengan aman menggunakan kartu kredit/debit (mendukung fitur saved cards),
serta menggunakan Socket.io untuk pengalaman bidding lelang secara realtime yang interaktif.

## Fitur Utama

- **Dashboard Koleksi (Collection Dashboard)**: Menampilkan ringkasan aset/koleksi milik user, total nilai koleksi, dan statistik portofolio.
- **Lelang Realtime (Realtime Auction)**: Sistem bidding langsung antar pengguna yang terintegrasi dengan WebSocket (Socket.io) agar timer dan status tawaran harga terupdate secara instan.
- **Marketplace**: Fasilitas bagi pengguna untuk membeli atau menjual item koleksi secara *fixed price* di luar sistem lelang.
- **Integrasi Pembayaran Xendit**: Mendukung transaksi pembayaran menggunakan kartu kredit, penyimpanan token kartu (saved cards) untuk transaksi masa depan yang lebih cepat, dan pemrosesan webhook secara otomatis.
- **Price History & Grafik Harga**: Melacak fluktuasi harga item koleksi dari waktu ke waktu dan memvisualisasikan data riwayat harga menggunakan chart interaktif (Recharts).
- **Wishlist**: Fitur untuk menyimpan item yang diminati agar dapat dipantau atau diikuti lelangnya di kemudian hari.
- **Riwayat Transaksi (Transaction History)**: Rekap lengkap untuk semua pembelian, penjualan, dan kemenangan lelang pengguna.
- **Realtime Notifications**: Sistem pemberitahuan *in-app* yang otomatis menginformasikan pengguna mengenai lelang yang akan berakhir, tawaran yang terlampaui (outbid), atau transaksi yang berhasil.

## Screenshots

### Landing Page

<p align="center">
  <img alt="landing" width="800" src="https://github.com/user-attachments/assets/b735cdd6-a20b-457f-aaf7-a5d8a03b35fd" />
</p>

### Auth Page

<p align="center">
  <img alt="auth" width="800" src="https://github.com/user-attachments/assets/58fa0dee-d5c5-42d1-9140-f69ccb895e1b" />
</p>

### Marketplace Page

<p align="center">
  <img alt="marketplace" width="800" src="https://github.com/user-attachments/assets/451c5734-a905-4fd3-9168-a6d88aaace20" />
  <img alt="marketplace-detail" width="800" src="https://github.com/user-attachments/assets/c41f9384-018e-4e11-816b-b61b0968edd8" />
</p>

### Auction Page

<p align="center">
  <img alt="auction" width="800" src="https://github.com/user-attachments/assets/b009bb1b-bc1d-45ce-929e-e77b6a7dc812" />
  <img alt="auction-detail" width="800" src="https://github.com/user-attachments/assets/5f7538a5-ebe0-4783-bb10-5947c8ab4122" />
</p>

### Create Asset Page

<p align="center">
  <img alt="create-asset" width="800" src="https://github.com/user-attachments/assets/d9fe03a2-42a6-4dfc-a78b-4b121d6f35a5" />
</p>

### Portfolio Page

<p align="center">
  <img alt="portfolio" width="800" src="https://github.com/user-attachments/assets/10c463c3-87d4-43ef-a2b6-0def3bdf6ad2" />
</p>

### Wishlist Page

<p align="center">
  <img alt="wishlist" width="800" src="https://github.com/user-attachments/assets/590e9290-1f80-41e0-afc6-095979d26db5" />
</p>

### Profile Page

<p align="center">
  <img alt="profile" width="800" src="https://github.com/user-attachments/assets/bc27a49f-31d4-48e9-89e4-e7c4096a8c4b" />
</p>

### Notification Page

<p align="center">
  <img alt="notifications" width="800" src="https://github.com/user-attachments/assets/cc59d251-6924-4b27-92f0-7c0627f46ee5" />
</p>

### Settlement Page

<p align="center">
  <img alt="settlement" width="800" src="https://github.com/user-attachments/assets/957d507d-34f7-4616-b219-74a7c05eb186" />
</p>

### Asset Detail Page

<p align="center">
  <img alt="asset-detail" width="800" src="https://github.com/user-attachments/assets/d27fe6f3-a8b7-4c7b-a447-78add38de501" />
</p>

## Instalasi & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Ampasan/Vaulted.git
cd Vaulted
```

### 2. Setup Environment Variables

**Backend**
Buat file `.env` di dalam folder `backend/` dan masukkan konfigurasi berikut (sesuaikan dengan environment lokal Anda):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vaulted
JWT_SECRET=rahasia_jwt_super_aman
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MIN_BID_INCREMENT=1000

# Xendit Payment Gateway Keys
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=...
```

**Frontend**
Buat file `.env` di dalam folder `frontend/` untuk menyimpan Public Key Xendit Anda:

```env
VITE_XENDIT_PUBLIC_KEY=xnd_public_development_...
```

### 3. Install Dependencies & Menjalankan Aplikasi

**Backend**
Buka terminal baru dan jalankan:
```bash
cd backend
npm install
npm run dev
```

**Frontend**
Buka terminal lain dan jalankan:
```bash
cd frontend
npm install
npm run dev
```

Aplikasi web dapat diakses di `http://localhost:5173` (atau port default Vite lainnya), dan backend server akan berjalan di `http://localhost:5000`.
