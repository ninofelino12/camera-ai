'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

export default function ApiPage() {
  const { data: session, status } = useSession();
  const [apiKey, setApiKey] = useState('');

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const webServiceUrl = `${baseUrl}/api/web/camera-data`;

  const codeExamples = {
    curl: `curl -X GET "${webServiceUrl}" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,

    javascript: `// Fetch all camera data
const response = await fetch('${webServiceUrl}', {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);

// Fetch specific record
const specificResponse = await fetch('${webServiceUrl}?id=1', {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});`,

    python: `import requests

# Fetch all camera data
response = requests.get(
    '${webServiceUrl}',
    headers={
        'x-api-key': 'YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

data = response.json()
print(data)

# Fetch specific record
specific_response = requests.get(
    f'{webServiceUrl}?id=1',
    headers={
        'x-api-key': 'YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)`,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-600 mt-1">
            Web service endpoints for accessing camera data
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Public Web Service Endpoint
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint URL
              </label>
              <code className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-800">
                {webServiceUrl}
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Include your API key in the{' '}
                <code className="px-2 py-1 bg-gray-100 rounded">x-api-key</code>{' '}
                header
              </p>
              <input
                type="text"
                placeholder="Enter API key to test"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(webServiceUrl, '_blank')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Test Endpoint
              </button>
              <button
                onClick={() => window.open(`${webServiceUrl}?id=1`, '_blank')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Test with ID
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Query Parameters
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Parameter
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-mono text-sm text-indigo-600">
                    id
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">integer</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Get a specific record by ID
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm text-indigo-600">
                    limit
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">integer</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Maximum number of records to return (default: 100)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-sm text-indigo-600">
                    offset
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">integer</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    Number of records to skip for pagination (default: 0)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Code Examples
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">cURL</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{codeExamples.curl}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                JavaScript
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{codeExamples.javascript}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Python</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{codeExamples.python}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Response Format
          </h2>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`[
  {
    "id": 1,
    "user_id": "user123",
    "captured_date": "2026-03-24T10:30:00.000Z",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "email": "user@example.com",
    "photo_url": "https://example.com/photo.jpg",
    "created_at": "2026-03-24T10:30:00.000Z"
  }
]`}</code>
          </pre>
        </div>
      </div>
    </DashboardLayout>
  );
}
