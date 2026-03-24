# 📱 QR Code Scanner Page

## 🎯 Fitur

Halaman QR Code untuk memudahkan akses ke Mobile Camera dari HP.

## 📍 Lokasi

```
/scan-qr
```

## 🎨 Tampilan

```
┌─────────────────────────────────┐
│     📱 Camera AI                │
│  Scan QR Code to open Mobile    │
├─────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │    ██████  ████████     │    │
│  │    ██  ██  ██    ██     │    │
│  │    ██████  ████████     │    │
│  │                         │    │
│  │      QR CODE            │    │
│  │                         │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  Mobile Camera URL              │
│  http://.../mobile/camera [Copy]│
├─────────────────────────────────┤
│  📋 How to Use                  │
│  1. Open camera app             │
│  2. Point at QR code            │
│  3. Tap notification            │
│  4. Start taking photos!        │
├─────────────────────────────────┤
│  [Mobile]     [Dashboard]       │
└─────────────────────────────────┘
```

## 🔧 Features

### 1. **Dynamic QR Code**
- Auto-generate QR code dengan URL yang sesuai
- Support localhost dan production URL
- High error correction level (H)

### 2. **URL Display**
- Show full mobile camera URL
- Copy to clipboard button
- Visual feedback saat copy

### 3. **Instructions**
- Step-by-step guide
- Visual numbered steps
- Clear and concise

### 4. **Quick Actions**
- Link ke Mobile Camera
- Link ke Dashboard
- Large touch-friendly buttons

### 5. **Network Detection**
- Detect localhost vs production
- Show warning untuk localhost
- Suggest IP address untuk akses network

## 💻 Implementation

### QR Code Generation
```typescript
import { QRCodeSVG } from 'qrcode.react';

<QRCodeSVG
  value={mobileUrl}
  size={256}
  level="H"
  includeMargin={true}
/>
```

### URL Detection
```typescript
useEffect(() => {
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    const protocol = window.location.protocol;
    setBaseUrl(`${protocol}//${host}`);
  }
}, []);
```

### Copy to Clipboard
```typescript
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
```

## 🎨 Styling

### Gradient Background
```css
bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
```

### Glassmorphism Card
```css
bg-white/10 backdrop-blur-lg border border-white/20
```

### QR Code Container
```css
bg-white rounded-2xl p-6 shadow-lg
```

## 📱 Usage Scenarios

### Scenario 1: Development (Localhost)
```
1. Developer runs app on localhost:3000
2. Opens /scan-qr on desktop
3. Shows QR code with localhost URL
4. Warning: "Use IP address for mobile access"
5. Developer finds IP: 192.168.1.100
6. Manually updates URL or uses IP directly
```

### Scenario 2: Production
```
1. App deployed to Vercel
2. URL: https://camera-ai.vercel.app
3. Opens /scan-qr
4. QR code: https://camera-ai.vercel.app/mobile/camera
5. Scan with phone → Works immediately!
```

### Scenario 3: Same Network
```
1. App running on computer (192.168.1.100:3000)
2. Phone connected to same WiFi
3. Scan QR code
4. Opens mobile camera on phone
5. Can take photos and upload!
```

## 🔐 Security Notes

### QR Code Security
- QR code hanya berisi URL publik
- No sensitive data in QR
- Safe to display publicly

### Access Control
- Mobile camera still requires login/demo mode
- QR code doesn't bypass authentication
- Same security as direct URL access

## 💡 Tips

### For Best Experience

1. **Production:**
   - Deploy to Vercel
   - QR code works perfectly
   - HTTPS enabled by default

2. **Local Development:**
   - Use IP address instead of localhost
   - Ensure same network
   - Allow firewall access

3. **Display:**
   - Show on desktop monitor
   - Print and keep on desk
   - Share in documentation

## 🚀 Access

### From Dashboard
```
Dashboard → Navigation → "QR Code"
```

### Direct URL
```
http://localhost:3000/scan-qr
```

### Quick Link
```
Click QR Code icon in navigation
```

## 📊 QR Code Specs

### Technical Details
- **Format**: SVG
- **Size**: 256x256 pixels
- **Error Correction**: Level H (30% recovery)
- **Margin**: 4 modules
- **Colors**: Black on white

### Scanning Compatibility
- ✅ iOS Camera (iOS 11+)
- ✅ Android Camera (most devices)
- ✅ QR Scanner apps
- ✅ Google Lens
- ✅ WeChat, Line, etc.

## 🎯 Use Cases

### 1. Office/Studio
```
Display QR code on monitor
→ Team members scan easily
→ Quick access to mobile camera
```

### 2. Field Work
```
Print QR code
→ Share with team
→ Everyone can access camera app
```

### 3. Documentation
```
Include QR code in docs
→ Readers scan with phone
→ Instant mobile app access
```

### 4. Testing
```
QA team scans QR code
→ Quick mobile testing
→ No need to type URLs
```

## 🔄 Flow

```
User opens /scan-qr
    ↓
Page detects current URL
    ↓
Generates mobile camera URL
    ↓
Creates QR code
    ↓
User scans with phone
    ↓
Phone opens mobile/camera
    ↓
User starts taking photos!
```

## ✅ Features Checklist

- [x] Dynamic QR code generation
- [x] URL detection
- [x] Copy to clipboard
- [x] Visual feedback
- [x] Step-by-step instructions
- [x] Quick action buttons
- [x] Network detection
- [x] Localhost warning
- [x] Glassmorphism design
- [x] Responsive layout
- [x] Touch-friendly buttons

## 📱 Screenshot Description

When you open `/scan-qr`:

1. **Header**: "📱 Camera AI" with subtitle
2. **QR Code**: Large, scannable code in white container
3. **URL Bar**: Shows full URL with copy button
4. **Instructions**: 4-step guide with numbered badges
5. **Action Buttons**: "Mobile" and "Dashboard" links
6. **Network Info**: Warning for localhost users

## 🎨 Color Scheme

```
Background: Indigo → Purple → Pink gradient
Card: White with 10% opacity + blur
Text: White with varying opacity
Buttons: Indigo and white with hover effects
QR Code: Black on white (standard)
```

## 📈 Future Enhancements

### Possible Additions
- [ ] Download QR code as PNG
- [ ] Share QR code via email
- [ ] Custom QR code colors
- [ ] Multiple QR codes (dev/prod)
- [ ] Analytics on scans
- [ ] Short URL integration

---

**Created**: 2026-03-24
**Status**: ✅ Complete
**Version**: 1.0.0
