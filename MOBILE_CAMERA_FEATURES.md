# 📱 Mobile Camera - Fitur Lengkap

## ✅ Fitur Utama

### 1. 📷 **Take Photo** (Kamera)
- Tombol biru di bottom bar
- Menggunakan kamera belakang
- Preview langsung sebelum capture
- Auto-save ke local storage
- GPS coordinates otomatis

### 2. 🖼️ **Load Image** (Gallery)
- Tombol abu-abu di bottom bar
- Pilih dari gallery HP
- Support: JPG, PNG, WEBP
- Auto-save ke local storage
- GPS coordinates otomatis

### 3. 💾 **Local Storage**
- Semua foto tersimpan di browser
- Offline accessible
- Persistent (tetap ada setelah close browser)
- Key: `camera-photos`

### 4. ☁️ **Upload to Server**
- Tombol "Upload All" di gallery
- Kirim semua foto ke database Neon
- Progress bar real-time
- Auto-delete setelah upload berhasil
- Status indicator per foto

### 5. 🗑️ **Delete Photos**
- Delete individual: Tap icon sampah di foto
- Delete all: Tombol "Clear All"
- Confirm sebelum hapus

## 🎨 UI Layout

```
┌─────────────────────────────────┐
│ [Camera AI]    [Install][Dash]  │ ← Header
├─────────────────────────────────┤
│ 📍 -6.2088, 106.8456            │ ← GPS Info
│ [Email input field]             │
├─────────────────────────────────┤
│ Photos (5)    [Upload][Clear]   │ ← Gallery Header
├─────────────────────────────────┤
│ ┌───────┐ ┌───────┐             │
│ │ Photo │ │ Photo │             │
│ │ ✓     │ │ ⏳    │             │ ← Photo Grid
│ │ GPS   │ │ GPS   │             │
│ └───────┘ └───────┘             │
│ ┌───────┐ ┌───────┐             │
│ │ Photo │ │ Photo │             │
│ └───────┘ └───────┘             │
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐       │
│ │🖼️ Load  │ │📷 Take   │       │ ← Bottom Bar
│ │  Image   │ │  Photo   │       │
│ └──────────┘ └──────────┘       │
└─────────────────────────────────┘
```

## 📊 Data Flow

### Take Photo Flow
```
User → Tap "Take Photo"
  ↓
Camera opens
  ↓
User → Tap "Capture"
  ↓
Canvas captures frame
  ↓
Convert to Base64
  ↓
Add to LocalPhoto array
  ↓
Save to localStorage ✓
```

### Load Image Flow
```
User → Tap "Load Image"
  ↓
File picker opens
  ↓
User selects image
  ↓
FileReader reads file
  ↓
Convert to Base64
  ↓
Add to LocalPhoto array
  ↓
Save to localStorage ✓
```

### Upload Flow
```
User → Tap "Upload All"
  ↓
Confirm dialog
  ↓
For each photo:
  → POST /api/camera-data
  → Wait response
  → Mark as uploaded
  ↓
Delete from localStorage ✓
  ↓
Show success message
```

## 🔧 Technical Implementation

### Take Photo
```typescript
const startCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  videoRef.current.srcObject = stream;
}

const takePhoto = () => {
  canvas.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  // Save to localStorage
}
```

### Load Image
```typescript
const handleLoadImage = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const dataUrl = event.target?.result as string;
    // Create LocalPhoto and save
  };
  
  reader.readAsDataURL(file);
}
```

### Upload to Server
```typescript
const uploadPhoto = async (photo: LocalPhoto) => {
  const response = await fetch('/api/camera-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      captured_date: photo.capturedDate,
      latitude: photo.latitude || 0,
      longitude: photo.longitude || 0,
      email: photo.email,
      photo_url: photo.dataUrl,
    }),
  });
  
  if (response.ok) {
    // Mark as uploaded
    // Remove from localStorage
  }
}
```

## 📱 Bottom Action Bar

### Two Buttons Layout
```
┌─────────────────────┬─────────────────────┐
│   LOAD IMAGE        │    TAKE PHOTO       │
│   (Gray #374151)    │   (Indigo #4f46e5)  │
│   Gallery Icon      │   Camera Icon       │
└─────────────────────┴─────────────────────┘
```

### Button States
- **Normal**: Full color
- **Disabled**: 50% opacity
- **Active**: Press effect

## 🗂️ File Structure

```
src/app/mobile/camera/
└── page.tsx          # Main component (520 lines)
    ├── useState      # 10 states
    ├── useEffect     # 6 effects
    ├── Functions:
    │   ├── startCamera()
    │   ├── takePhoto()
    │   ├── handleLoadImage()
    │   ├── uploadPhoto()
    │   ├── deletePhoto()
    │   └── clearAllPhotos()
    └── UI:
        ├── Header
        ├── Info Panel
        ├── Camera View
        ├── Photo Gallery
        └── Bottom Action Bar
```

## 💾 LocalStorage Schema

```typescript
{
  "camera-photos": [
    {
      "id": "1711286400000",           // Timestamp
      "dataUrl": "data:image/jpeg...", // Base64
      "latitude": -6.2088,             // GPS
      "longitude": 106.8456,           // GPS
      "email": "user@example.com",     // Email
      "capturedDate": "2026-03-24...", // ISO
      "uploaded": false                // Status
    }
  ]
}
```

## 🎯 User Journey

### First Time User
```
1. Open /mobile/camera
2. Tap "Use Demo Mode"
3. Allow camera permission ✓
4. Allow location permission ✓
5. See two buttons: Load Image & Take Photo
```

### Take Photo Path
```
1. Tap "Take Photo" (blue button)
2. Camera preview opens
3. Tap "📸 Capture"
4. Photo saved to gallery
5. See thumbnail with GPS coords
```

### Load Image Path
```
1. Tap "Load Image" (gray button)
2. Gallery picker opens
3. Select photo
4. Photo saved to gallery
5. See thumbnail with GPS coords
```

### Upload Path
```
1. Take/Load multiple photos
2. Tap "Upload All"
3. Confirm upload
4. Watch progress bar
5. Photos uploaded ✓
6. Gallery cleared
```

## 🎨 Visual Indicators

### Upload Status
- **✓ Green badge**: Uploaded to server
- **⏳ Yellow badge**: Pending upload
- **No badge**: Not yet attempted

### Photo Card
```
┌──────────────────┐
│                  │
│    Thumbnail     │ ← Image
│                  │
│ [✓]              │ ← Status (top-right)
├──────────────────┤
│ -6.21, 106.85 🗑️ │ ← GPS + Delete
└──────────────────┘
```

## 📈 Features Comparison

| Feature | Take Photo | Load Image |
|---------|-----------|------------|
| Source | Camera | Gallery |
| Button | Blue | Gray |
| Icon | Camera | Image |
| Format | JPEG | Any image |
| GPS | Auto | Auto |
| Storage | Local | Local |
| Upload | Yes | Yes |

## ✅ Checklist

- [x] Take Photo button
- [x] Load Image button
- [x] Camera access
- [x] Gallery picker
- [x] Local storage save
- [x] GPS auto-tag
- [x] Photo gallery view
- [x] Upload all button
- [x] Progress bar
- [x] Delete individual
- [x] Delete all
- [x] Status indicators
- [x] Email input
- [x] Demo mode
- [x] PWA installable

## 🚀 Usage Stats

### Typical Session
- Take 3-5 photos with camera
- Load 1-2 existing images
- Upload all at once
- Takes ~2 minutes total

### Storage Usage
- Average photo: ~500KB (Base64)
- 10 photos: ~5MB
- Browser limit: 5-10MB typical
- Recommendation: Upload regularly

## 💡 Tips

### For Users
1. Enter email once at start
2. Allow GPS for accurate tags
3. Upload before closing browser
4. Use WiFi for faster upload

### For Developers
1. Compress photos before upload (optional)
2. Handle upload errors gracefully
3. Show clear feedback to users
4. Test on real devices

## 🎉 Summary

### What We Have
✅ **Take Photo** - Camera capture
✅ **Load Image** - Gallery picker
✅ **Local Storage** - Persistent storage
✅ **Upload** - Batch upload to server
✅ **Delete** - Individual & bulk delete
✅ **GPS** - Auto location tagging
✅ **PWA** - Installable app
✅ **Offline** - Works without internet

### Ready to Use!
All features implemented and tested.
Open http://localhost:3000/mobile/camera

---

**Updated**: 2026-03-24
**Status**: ✅ Complete
**Version**: 1.1.0 (with Load Image)
