# ⚡ Quick Shortcuts Feature

## 📱 Fitur Shortcut

Buat dan gunakan shortcut untuk setting email & lokasi dengan cepat!

## 🎯 Fungsi Shortcut

Shortcut menyimpan:
- **Name**: Nama lokasi (Home, Office, dll)
- **Email**: Email yang digunakan
- **Color**: Warna identifier
- **Location**: GPS coordinates (opsional)

## 🎨 UI Layout

### Header Button
```
[Camera AI]  [Shortcuts] [Install] [Dashboard]
                  ↑
            Purple button
```

### Quick Panel (jika ada shortcut)
```
⚡ Quick Shortcuts           [Manage]

┌─────────┬─────────┬─────────┐
│  🔴     │  🔵     │  🟢     │
│  Home   │  Office │  Site   │
└─────────┴─────────┴─────────┘
```

### Shortcut Menu Modal
```
┌─────────────────────────────┐
│ 📍 Quick Shortcuts      [X] │
├─────────────────────────────┤
│ 🔴 Home                     │
│    user@example.com         │
│              [Apply] [🗑️]   │
├─────────────────────────────┤
│ 🔵 Office                   │
│    admin@work.com           │
│              [Apply] [🗑️]   │
├─────────────────────────────┤
│ [+ Create New Shortcut]     │
└─────────────────────────────┘
```

## 🔧 Cara Membuat Shortcut

### Step 1: Buka Menu
```
Tap tombol "Shortcuts" di header
   ↓
Modal menu terbuka
```

### Step 2: Create New
```
Tap "+ Create New Shortcut"
   ↓
Form input muncul
```

### Step 3: Input Data
```
1. Name: "Home" (required)
2. Email: "user@example.com" (optional)
3. Color: "blue" (optional, default: blue)
```

### Step 4: Save
```
Shortcut tersimpan di localStorage
   ↓
Muncul di Quick Panel
   ↓
Bisa langsung digunakan!
```

## ⚡ Cara Menggunakan Shortcut

### Quick Apply
```
1. Tap shortcut di Quick Panel
   ↓
2. Email otomatis ter-set
   ↓
3. GPS location di-capture
   ↓
4. Ready to take photos!
```

### Full Apply
```
1. Buka menu Shortcuts
   ↓
2. Tap "Apply" pada shortcut
   ↓
3. Email ter-set
   ↓
4. GPS location updated
   ↓
5. Alert konfirmasi
```

## 💾 LocalStorage

### Data Structure
```javascript
{
  "camera-shortcuts": [
    {
      "id": "1711286400000",
      "name": "Home",
      "email": "user@example.com",
      "color": "blue",
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    {
      "id": "1711286500000",
      "name": "Office",
      "email": "admin@work.com",
      "color": "green",
      "latitude": -6.1751,
      "longitude": 106.8650
    }
  ]
}
```

### Persistence
- ✅ Auto-save saat create
- ✅ Auto-save saat update GPS
- ✅ Auto-delete saat remove
- ✅ Persistent across sessions

## 🎨 Color Options

### Predefined Colors
```
- blue (default)
- green
- red
- yellow
- purple
- pink
- orange
- indigo
```

### Custom Colors
```
Support:
- Named colors: "red", "blue"
- Hex: "#FF0000"
- RGB: "rgb(255, 0, 0)"
```

## 📊 Use Cases

### 1. Field Worker
```
Shortcuts:
- Site A → siteA@company.com
- Site B → siteB@company.com
- Warehouse → warehouse@company.com

Benefit: Quick switch between locations!
```

### 2. Real Estate Agent
```
Shortcuts:
- Property 1 → agent@realty.com
- Property 2 → agent@realty.com
- Office → office@realty.com

Benefit: Organized by property!
```

### 3. Research Team
```
Shortcuts:
- Lab → researcher@uni.edu
- Field Site 1 → field1@research.org
- Field Site 2 → field2@research.org

Benefit: Easy data categorization!
```

## 🔧 Implementation

### Create Shortcut Function
```typescript
const createShortcut = () => {
  const name = prompt('Shortcut name:');
  const email = prompt('Email:');
  const color = prompt('Color:', 'blue');

  const shortcut = {
    id: Date.now(),
    name,
    email,
    color
  };

  setShortcuts(prev => [...prev, shortcut]);
};
```

### Apply Shortcut Function
```typescript
const applyShortcut = (shortcut) => {
  // Set email
  setEmail(shortcut.email);

  // Capture current GPS
  navigator.geolocation.getCurrentPosition((pos) => {
    // Update shortcut with GPS
    updateShortcutGPS(shortcut.id, pos.coords);
  });
};
```

### Quick Panel Component
```tsx
{shortcuts.length > 0 && (
  <div className="grid grid-cols-3 gap-2">
    {shortcuts.slice(0, 6).map(shortcut => (
      <button onClick={() => applyShortcut(shortcut)}>
        <div style={{ backgroundColor: shortcut.color }} />
        {shortcut.name}
      </button>
    ))}
  </div>
)}
```

## 🎯 User Flow

### First Time User
```
1. Open mobile/camera
2. See "Shortcuts" button
3. Tap to open menu
4. Create first shortcut
5. Shortcut appears in Quick Panel
6. Tap shortcut → Applied!
```

### Regular User
```
1. Open mobile/camera
2. See Quick Panel with shortcuts
3. Tap relevant shortcut
4. Email & GPS auto-set
5. Start taking photos!
```

### Power User
```
1. Multiple shortcuts for different locations
2. Quick switch between sites
3. Each with own email & GPS
4. Organized workflow
5. Maximum efficiency!
```

## ✅ Features

### Create
- [x] Name input
- [x] Email input
- [x] Color picker
- [x] Auto-save

### Manage
- [x] View all shortcuts
- [x] Apply shortcut
- [x] Delete shortcut
- [x] Update GPS

### UI
- [x] Header button
- [x] Quick panel
- [x] Modal menu
- [x] Color indicators

### Storage
- [x] LocalStorage
- [x] Persistent
- [x] Auto-sync

## 💡 Tips

### Best Practices
1. **Descriptive Names**: Use clear location names
2. **Consistent Emails**: Same email per location
3. **Color Coding**: Different colors for easy ID
4. **Regular Updates**: Update GPS when needed

### Efficiency Tips
1. **Create Beforehand**: Set up shortcuts before field work
2. **Quick Panel**: Use for fastest access
3. **Menu Management**: Organize in menu
4. **Delete Old**: Remove unused shortcuts

## 📈 Benefits

### Time Saving
```
Manual: Type email + wait GPS = ~10 seconds
Shortcut: Tap = ~1 second
Savings: 9 seconds per session!
```

### Accuracy
```
Manual: Risk typos in email
Shortcut: Always correct!
```

### Organization
```
Manual: Mixed data
Shortcut: Categorized by location!
```

## 🚀 Future Enhancements

### Planned Features
- [ ] GPS auto-capture on create
- [ ] Shortcut import/export
- [ ] Share shortcuts
- [ ] Default shortcuts
- [ ] Shortcut groups
- [ ] Search shortcuts

---

**Created**: 2026-03-24
**Status**: ✅ Complete
**Version**: 1.0.0
**Location**: `/mobile/camera` → Shortcuts button
