# PWA Mobile Camera App

## 📱 Install on Your Phone

### Android (Chrome)
1. Open the app in Chrome: `http://localhost:3000/mobile/camera`
2. Tap the menu (⋮) → **"Install app"** or **"Add to Home screen"**
3. Confirm installation
4. App icon will appear on your home screen

### iOS (Safari)
1. Open the app in Safari: `http://localhost:3000/mobile/camera`
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** in the top right corner
5. App icon will appear on your home screen

## 📸 Features

### Take Photos
- Tap **"Take Photo"** button
- Uses back camera by default
- Photo captured instantly

### GPS Tagging
- Automatically captures your location
- Coordinates saved with each photo
- Location shown at top of screen

### Local Storage
- Photos stored in browser's localStorage
- Works offline
- No data limit (within browser limits)

### Upload to Cloud
- Tap **"Upload All"** to sync photos to database
- Progress bar shows upload status
- Photos removed from local storage after successful upload

### Manage Photos
- View all captured photos in gallery
- Delete individual photos
- Clear all photos at once
- See upload status (pending/uploaded)

## 🎨 UI Features

- **Dark mode** - Easy on battery and eyes
- **Responsive** - Works on all phone sizes
- **Touch optimized** - Large buttons for easy tapping
- **Status indicators** - See upload status at a glance
- **Progress bar** - Track upload progress

## 📡 API Integration

Photos are uploaded to:
```
POST /api/camera-data
```

Each photo includes:
- `captured_date` - When photo was taken
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `email` - User's email
- `photo_url` - Base64 encoded image data

## 🔧 Technical Details

### Service Worker
- Located at: `/sw.js`
- Caches app for offline use
- Fast loading from cache

### Manifest
- Located at: `/manifest.json`
- App name: "Camera AI"
- Theme color: Indigo (#4f46e5)
- Display mode: Standalone (full-screen app)

### Local Storage Key
- `camera-photos` - Stores all captured photos

## 🚀 Usage Flow

1. **Open App** → Navigate to `/mobile/camera`
2. **Grant Permissions** → Allow camera and location access
3. **Take Photo** → Tap camera button
4. **Review** → See photo in gallery with GPS coordinates
5. **Upload** → Tap "Upload All" when ready
6. **Done** → Photos synced to cloud, removed from local storage

## 💡 Tips

- **Email**: Enter your email once, it persists during session
- **GPS**: Allow location access for accurate coordinates
- **Offline**: Take photos anywhere, upload when online
- **Batch Upload**: Upload multiple photos at once
- **Storage**: Photos auto-removed after successful upload

## 📱 Add to Home Screen Prompt

The app shows an **"Install App"** button when:
- Running in supported browser
- Not already installed
- Service worker is active

## 🎯 Use Cases

- **Field Work** - Document locations with photos
- **Inspections** - Capture evidence with GPS tags
- **Travel** - Log your journey with geotagged photos
- **Real Estate** - Document properties with location data
- **Research** - Collect visual data with coordinates

---

**Note**: For production deployment, replace placeholder icons with actual app icons (192x192 and 512x512 PNG files).
