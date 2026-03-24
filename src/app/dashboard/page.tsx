'use client';

import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import DataTable from '@/components/DataTable';
import { useEffect, useState } from 'react';
import { CameraData } from '@/lib/db/camera-data';

export default function DashboardPage() {
  const [data, setData] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dataRes, statsRes] = await Promise.all([
        fetch('/api/camera-data'),
        fetch('/api/camera-data/stats'),
      ]);

      if (dataRes.ok) {
        const data = await dataRes.json();
        setData(data);
      }

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            View and manage your camera data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Records"
            value={stats.total.toString()}
            icon="📊"
            trend="+0%"
          />
          <StatsCard
            title="Today"
            value={stats.today.toString()}
            icon="📅"
            trend="+0%"
          />
          <StatsCard
            title="This Week"
            value={stats.thisWeek.toString()}
            icon="📈"
            trend="+0%"
          />
        </div>

        <DataTable data={data} />
      </div>
    </DashboardLayout>
  );
}
