'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ScanQRPage() {
  const { data: session, status } = useSession();
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get current host (localhost or production URL)
      const host = window.location.host;
      const protocol = window.location.protocol;
      setBaseUrl(`${protocol}//${host}`);
    }
  }, []);

  const mobileUrl = `${baseUrl}/mobile/camera`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              📱 Camera AI
            </h1>
            <p className="text-white/70">
              Scan QR Code to open Mobile Camera
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <QRCodeSVG
              value={mobileUrl}
              size={256}
              level="H"
              includeMargin={true}
              className="w-full h-auto"
            />
          </div>

          {/* URL Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Mobile Camera URL
            </label>
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-3 border border-white/20">
              <code className="flex-1 text-white text-sm truncate">
                {mobileUrl}
              </code>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How to Use
            </h3>
            <ol className="space-y-2 text-white/80 text-sm">
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">1</span>
                Open camera app on your phone
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">2</span>
                Point at QR code above
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">3</span>
                Tap the notification to open
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">4</span>
                Start taking photos!
              </li>
            </ol>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/mobile/camera"
              className="flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile
            </a>
            <a
              href="/dashboard"
              className="flex items-center justify-center px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            🌐 Works on same network or production URL
          </p>
          {baseUrl.includes('localhost') && (
            <div className="mt-3 bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-3">
              <p className="text-yellow-200 text-xs">
                ⚠️ For mobile access on same network, use your computer's IP address instead of localhost
              </p>
              <p className="text-yellow-100 text-xs mt-1 font-mono">
                Example: http://192.168.1.100:3000/mobile/camera
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
