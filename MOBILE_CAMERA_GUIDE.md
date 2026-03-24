# 📱 Mobile PWA Camera - Complete Guide

## ✅ Fitur Lengkap

### 🎥 Kamera Mobile
- **Akses Kamera**: Menggunakan kamera belakang smartphone
- **Capture Photo**: Tombol besar untuk mengambil foto
- **Preview**: Lihat hasil foto langsung
- **GPS Auto-Tag**: Koordinat lokasi otomatis tersimpan

### 💾 Local Storage
- **Offline Storage**: Foto disimpan di browser
- **No Data Limit**: Selama masih ada storage browser
- **Persistent**: Foto tetap ada meski browser ditutup
- **Auto-Cleanup**: Foto terhapus setelah upload berhasil

### ☁️ Upload ke Neon Database
- **Batch Upload**: Upload banyak foto sekaligus
- **Progress Bar**: Lihat progress upload real-time
- **Status Indicator**: ✓ uploaded, ⏳ pending
- **Auto-Remove**: Foto terhapus dari localStorage setelah upload

### 📲 PWA Features
- **Installable**: Bisa ditambah ke home screen
- **Offline Mode**: Service worker caching
- **Full Screen**: App mode tanpa browser UI
- **App Icon**: Icon di home screen

## 🚀 Cara Install di HP

### Android (Chrome)
```
1. Buka Chrome → http://localhost:3000/mobile/camera
2. Tap menu (⋮) → "Install app" atau "Add to Home screen"
3. Tap "Add" atau "Install"
4. Icon muncul di home screen
5. Buka seperti app biasa!
```

### iOS (Safari)
```
1. Buka Safari → http://localhost:3000/mobile/camera
2. Tap Share button (kotak dengan panah)
3. Scroll → "Add to Home Screen"
4. Tap "Add" di pojok kanan atas
5. Icon muncul di home screen
6. Buka seperti app biasa!
```

## 📋 Cara Penggunaan

### 1. Pertama Kali
```
- Buka halaman /mobile/camera
- Izinkan akses kamera
- Izinkan akses lokasi
- Masukkan email (opsional)
```

### 2. Ambil Foto
```
- Tap tombol "Take Photo" (biru besar di bawah)
- Kamera otomatis menggunakan kamera belakang
- Tap "📸 Capture" untuk ambil foto
- Foto muncul di gallery
```

### 3. Upload Foto
```
- Setelah dapat foto yang diinginkan
- Tap "Upload All" (jika ada foto belum upload)
- Tunggu progress bar selesai
- Foto ter-upload ke database
- Foto terhapus dari local storage
```

### 4. Hapus Foto
```
- Per individual: Tap icon sampah di foto
- Semua foto: Tap "Clear All"
```

## 🎨 UI Elements

### Header
```
[Camera AI]              [Install App] [Dashboard]
- App name               - PWA prompt  - Link ke dashboard
```

### Info Panel
```
📍 -6.2088, 106.8456          [GPS coordinates]
[Email input field]           [Optional email]
```

### Camera View
```
[Live camera preview]
[Cancel] [📸 Capture]         [Bottom controls]
```

### Photo Gallery
```
Photos (5)                    [Upload All] [Clear All]

[Photo 1] [Photo 2]           Grid 2 columns
[Photo 3] [Photo 4]           ✓ = uploaded
[Photo 5]                     ⏳ = pending
```

### Bottom Action Bar
```
[      📷 Take Photo      ]    Large blue button
```

## 🔧 Technical Details

### File Structure
```
src/app/mobile/camera/page.tsx    - Main camera page
public/manifest.json               - PWA manifest
public/sw.js                       - Service worker
public/icons/
  - icon-192.png                   - Home screen icon
  - icon-512.png                   - Splash screen icon
```

### Local Storage Format
```javascript
{
  "camera-photos": [
    {
      "id": "1711286400000",
      "dataUrl": "data:image/jpeg;base64,/9j/4AAQ...",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "email": "user@example.com",
      "capturedDate": "2026-03-24T10:00:00.000Z",
      "uploaded": false
    }
  ]
}
```

### API Request Format
```javascript
POST /api/camera-data
{
  "captured_date": "2026-03-24T10:00:00.000Z",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "email": "user@example.com",
  "photo_url": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

### Permissions Required
```javascript
{
  camera: true,        // Untuk akses kamera
  geolocation: true    // Untuk GPS coordinates
}
```

## 📊 Data Flow

```
User → Take Photo
  ↓
Camera → Canvas → Base64
  ↓
LocalStorage (camera-photos array)
  ↓
User → Upload All
  ↓
API POST /api/camera-data
  ↓
Neon Database (camera_data table)
  ↓
Remove from LocalStorage ✓
```

## 🎯 Use Cases

### 1. Field Research
```
Peneliti → Foto lokasi → GPS auto-tag → Upload → Database
```

### 2. Property Inspection
```
Inspector → Foto property → Lokasi tercatat → Upload → Report
```

### 3. Travel Logging
```
Traveler → Foto destinasi → Route tracking → Upload → Memory lane
```

### 4. Evidence Collection
```
Officer → Foto bukti → Location stamp → Upload → Case file
```

## 🔐 Privacy & Security

### Data Stored
- **Local**: Foto di browser user saja
- **Cloud**: Upload ke database user
- **GPS**: Coordinates tersimpan dengan foto
- **Email**: Optional, untuk identification

### Permissions
- **Camera**: Required untuk capture
- **Location**: Optional tapi recommended
- **Storage**: Browser localStorage

### Security Notes
- Foto hanya accessible oleh user yang sama
- HTTPS required untuk production
- API authentication via NextAuth session

## 💡 Tips & Tricks

### Battery Optimization
- Camera hanya aktif saat perlu
- Video stream dimatikan setelah capture
- Dark mode hemat battery OLED

### Storage Management
- Upload berkala untuk free up space
- Clear all jika perlu reset
- Browser limits vary (5-10MB typical)

### Best Practices
- Enter email sekali di awal
- Allow GPS untuk accurate data
- Upload sebelum tutup browser
- Test di berbagai device

## 🐛 Troubleshooting

### Camera Not Working
```
- Allow camera permission
- Check browser compatibility
- Try different browser
- Restart browser
```

### GPS Not Accurate
```
- Enable high accuracy mode
- Wait for GPS lock
- Check location permission
- Move to open area
```

### Upload Failed
```
- Check internet connection
- Verify login session
- Check API endpoint
- Try one by one
```

### Install Prompt Not Showing
```
- Must use HTTPS (production)
- Service worker must be active
- Not already installed
- Supported browser
```

## 📈 Future Enhancements

### Planned Features
- [ ] Photo compression before upload
- [ ] Multiple photo selection
- [ ] Edit before upload
- [ ] Filter effects
- [ ] Album organization
- [ ] Sync status indicator
- [ ] Background upload
- [ ] Push notifications

### Technical Improvements
- [ ] IndexedDB for larger storage
- [ ] WebRTC for better camera control
- [ ] Background sync API
- [ ] Share target API
- [ ] File system access API

## 📞 Support

### Documentation
- `PWA_GUIDE.md` - Installation guide
- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide

### Testing
```bash
# Test on mobile device
- Same network → http://YOUR_IP:3000/mobile/camera
- Or deploy to Vercel for production URL
```

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2026-03-24
