import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 text-center shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          📷 Camera AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8">
          Manage your camera data with GPS tagging
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link
            href="/mobile/camera"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
          >
            📱 Mobile Camera
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
          >
            📊 Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-white">
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold mb-1">GPS Tagging</h3>
            <p className="text-sm text-gray-300">Auto-capture location data</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-3xl mb-2">📸</div>
            <h3 className="font-semibold mb-1">Camera Upload</h3>
            <p className="text-sm text-gray-300">Upload from mobile or desktop</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Dashboard</h3>
            <p className="text-sm text-gray-300">View and manage your data</p>
          </div>
        </div>

        <p className="mt-8 text-gray-300 text-sm">
          No login required - Start using immediately!
        </p>
      </div>
    </div>
  );
}
