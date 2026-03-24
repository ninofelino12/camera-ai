'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface LocalPhoto {
  id: string;
  dataUrl: string;
  latitude: number | null;
  longitude: number | null;
  email: string;
  capturedDate: string;
  uploaded: boolean;
}

export default function MobileCameraPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [email, setEmail] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showShortcutMenu, setShowShortcutMenu] = useState(false);
  const [shortcuts, setShortcuts] = useState<Array<{id: string; name: string; email: string; color: string}>>([]);

  // Check if user is logged in
  useEffect(() => {
    if (status === 'authenticated') {
      setLoggedIn(true);
    }
  }, [status]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration);
      }).catch(console.error);
    }
  }, []);

  // Load shortcuts from localStorage
  useEffect(() => {
    const savedShortcuts = localStorage.getItem('camera-shortcuts');
    if (savedShortcuts) {
      setShortcuts(JSON.parse(savedShortcuts));
    }
  }, []);

  // Save shortcuts to localStorage
  useEffect(() => {
    if (shortcuts.length > 0) {
      localStorage.setItem('camera-shortcuts', JSON.stringify(shortcuts));
    }
  }, [shortcuts]);

  // Load photos from localStorage
  useEffect(() => {
    const savedPhotos = localStorage.getItem('camera-photos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Save photos to localStorage
  useEffect(() => {
    localStorage.setItem('camera-photos', JSON.stringify(photos));
  }, [photos]);

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      // Check if running in secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        alert('Camera requires HTTPS. Please access via HTTPS or use the PWA install feature.');
        return;
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera API not supported in this browser. Please use Chrome, Safari, or Firefox.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
      });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      let message = 'Cannot access camera. ';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        message += 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        message += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        message += 'Camera is being used by another app.';
      } else if (error.name === 'OverconstrainedError') {
        message += 'Camera constraints not met. Try a different browser.';
      } else if (error.name === 'TypeError') {
        message += 'Secure context required. Please use HTTPS.';
      } else {
        message += 'Error: ' + error.message;
      }
      alert(message);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Take photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

    const newPhoto: LocalPhoto = {
      id: Date.now().toString(),
      dataUrl,
      latitude: location.lat,
      longitude: location.lng,
      email: email || session?.user?.email || '',
      capturedDate: new Date().toISOString(),
      uploaded: false,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    stopCamera();
  };

  // Load image from gallery
  const handleLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingImage(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      const newPhoto: LocalPhoto = {
        id: Date.now().toString(),
        dataUrl,
        latitude: location.lat,
        longitude: location.lng,
        email: email || session?.user?.email || '',
        capturedDate: new Date().toISOString(),
        uploaded: false,
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      setLoadingImage(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      alert('Error loading image');
      setLoadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  // Trigger file input
  const triggerLoadImage = () => {
    fileInputRef.current?.click();
  };

  // Delete photo
  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  // Upload single photo
  const uploadPhoto = async (photo: LocalPhoto) => {
    try {
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
        setPhotos((prev) =>
          prev.map((p) => (p.id === photo.id ? { ...p, uploaded: true } : p))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Upload error:', error);
      return false;
    }
  };

  // Upload all photos
  const uploadAllPhotos = async () => {
    const unuploadedPhotos = photos.filter((p) => !p.uploaded);
    if (unuploadedPhotos.length === 0) {
      alert('No photos to upload!');
      return;
    }

    if (!confirm(`Upload ${unuploadedPhotos.length} photo(s)?`)) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: unuploadedPhotos.length });

    let successCount = 0;
    for (let i = 0; i < unuploadedPhotos.length; i++) {
      const photo = unuploadedPhotos[i];
      const success = await uploadPhoto(photo);
      if (success) successCount++;
      setUploadProgress({ current: i + 1, total: unuploadedPhotos.length });
    }

    setUploading(false);
    alert(`Uploaded ${successCount}/${unuploadedPhotos.length} photos!`);

    // Remove uploaded photos from localStorage
    setPhotos((prev) => prev.filter((p) => !p.uploaded));
  };

  // Install PWA
  const installPWA = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    });
  };

  // Clear all photos
  const clearAllPhotos = () => {
    if (confirm('Delete all photos from local storage?')) {
      setPhotos([]);
      localStorage.removeItem('camera-photos');
    }
  };

  // Create shortcut
  const createShortcut = () => {
    const name = prompt('Shortcut name (e.g., Home, Office):');
    if (!name) return;

    const emailInput = prompt('Email for this location:', email || '');
    const color = prompt('Color (e.g., blue, green, red):', 'blue') || 'blue';

    const newShortcut = {
      id: Date.now().toString(),
      name,
      email: emailInput || '',
      color,
    };

    setShortcuts((prev) => [...prev, newShortcut]);
  };

  // Apply shortcut
  const applyShortcut = (shortcut: typeof shortcuts[0]) => {
    if (shortcut.email) {
      setEmail(shortcut.email);
    }
    // Get current location and save to shortcut
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updatedShortcuts = shortcuts.map(s =>
            s.id === shortcut.id
              ? {
                  ...s,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
              : s
          );
          setShortcuts(updatedShortcuts);
          localStorage.setItem('camera-shortcuts', JSON.stringify(updatedShortcuts));
          alert(`Applied "${shortcut.name}" - Email: ${shortcut.email || 'Not set'}`);
        },
        () => {
          alert(`Applied "${shortcut.name}" - Email: ${shortcut.email || 'Not set'} (GPS failed)`);
        }
      );
    } else {
      alert(`Applied "${shortcut.name}" - Email: ${shortcut.email || 'Not set'}`);
    }
  };

  // Delete shortcut
  const deleteShortcut = (id: string) => {
    if (confirm('Delete this shortcut?')) {
      setShortcuts((prev) => prev.filter((s) => s.id !== id));
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-400 mb-4">Camera AI</h1>
          <p className="text-gray-300 mb-6">Mobile Camera App with GPS Tagging</p>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 bg-indigo-600 rounded-xl font-medium"
            >
              Sign In to Upload
            </button>
            
            <button
              onClick={() => {
                setLoggedIn(true);
                setEmail('demo@mobile.local');
              }}
              className="w-full py-3 bg-gray-700 rounded-xl font-medium"
            >
              Use Demo Mode
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              Demo mode allows camera access but upload requires login
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Shortcut Menu Modal */}
      {showShortcutMenu && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📍 Quick Shortcuts</h2>
              <button
                onClick={() => setShowShortcutMenu(false)}
                className="p-2 hover:bg-gray-700 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {shortcuts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No shortcuts yet</p>
                <p className="text-sm mt-2">Create your first shortcut!</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full bg-${shortcut.color}-500`}
                        style={{ backgroundColor: shortcut.color }}
                      />
                      <div>
                        <p className="font-medium">{shortcut.name}</p>
                        <p className="text-xs text-gray-400">
                          {shortcut.email || 'No email'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => applyShortcut(shortcut)}
                        className="px-3 py-1 bg-indigo-600 rounded text-xs"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => deleteShortcut(shortcut.id)}
                        className="p-1 bg-red-600 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={createShortcut}
              className="w-full py-3 bg-indigo-600 rounded-xl font-medium"
            >
              + Create New Shortcut
            </button>
          </div>
        </div>
      )}
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-white px-4 py-2 text-center text-sm font-medium z-50 flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.556 10a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m0 0l2.829 2.829m-2.829-2.829L3 3m6.364 0a9 9 0 0112.728 0" />
          </svg>
          <span>You're offline - Photos will be saved locally</span>
        </div>
      )}

      {/* Online Banner (hidden when online) */}
      {isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-green-600/90 text-white px-4 py-1 text-center text-xs font-medium z-50">
          ✓ Online
        </div>
      )}

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 bg-gray-800 shadow-lg z-40 ${isOnline ? 'mt-6' : 'mt-8'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-indigo-400">Camera AI</h1>
          <div className="flex items-center space-x-2">
            {showInstallPrompt && (
              <button
                onClick={installPWA}
                className="px-3 py-1 bg-indigo-600 rounded-lg text-xs font-medium"
              >
                Install App
              </button>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowShortcutMenu(true)}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium flex items-center space-x-1"
                title="Quick Shortcuts"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span>Shortcuts</span>
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-3 py-1 bg-gray-700 rounded-lg text-xs"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-24 px-4">
        {/* Quick Shortcuts Panel */}
        {shortcuts.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-300">⚡ Quick Shortcuts</h3>
              <button
                onClick={() => setShowShortcutMenu(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Manage
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {shortcuts.slice(0, 6).map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => applyShortcut(shortcut)}
                  className="p-2 bg-gray-800 rounded-lg text-xs hover:bg-gray-700 transition-colors"
                >
                  <div
                    className="w-2 h-2 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: shortcut.color }}
                  />
                  <p className="truncate">{shortcut.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Location & Email Info */}
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 6a1 1 0 110 2 1 1 0 010-2z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">
                {location.lat && location.lng
                  ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : 'Getting location...'}
              </span>
            </div>
          </div>
          <input
            type="email"
            placeholder="Your email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Camera View */}
        {showCamera && (
          <div className="mb-4 relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={stopCamera}
                className="px-6 py-3 bg-red-600 rounded-full font-medium"
              >
                Cancel
              </button>
              <button
                onClick={takePhoto}
                className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold"
              >
                📸 Capture
              </button>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">
              Photos ({photos.length})
            </h2>
            <div className="flex space-x-2">
              {photos.some((p) => !p.uploaded) && (
                <button
                  onClick={uploadAllPhotos}
                  disabled={uploading || !isOnline}
                  title={!isOnline ? 'You are offline - photos saved locally' : ''}
                  className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : !isOnline ? 'Offline' : 'Upload All'}
                </button>
              )}
              {photos.length > 0 && (
                <button
                  onClick={clearAllPhotos}
                  className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {uploading && (
            <div className="mb-4 p-3 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-2">
                Uploading {uploadProgress.current} of {uploadProgress.total}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {photos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="mx-auto w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-medium">No photos yet</p>
              <p className="text-sm mt-1">Tap "Take Photo" or "Load Image"</p>
              <p className="text-xs mt-2 text-gray-500">to add photos to your gallery</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={photo.dataUrl}
                    alt="Captured"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {photo.uploaded ? (
                      <span className="px-2 py-1 bg-green-600 rounded text-xs">✓</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-600 rounded text-xs">⏳</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">
                        {photo.latitude && photo.longitude
                          ? `${photo.latitude.toFixed(2)}, ${photo.longitude.toFixed(2)}`
                          : 'No GPS'}
                      </span>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="p-1 bg-red-600 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Hidden file input for loading images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleLoadImage}
        className="hidden"
      />

      {/* Bottom Action Bar */}
      {!showCamera && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg p-4 z-50">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={triggerLoadImage}
              disabled={loadingImage}
              className="py-4 bg-gray-700 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Load Image</span>
            </button>
            <button
              onClick={startCamera}
              className="py-4 bg-indigo-600 rounded-xl font-bold text-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Take Photo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
