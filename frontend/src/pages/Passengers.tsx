import { useEffect, useState } from 'react';
import { api, type PassengerSummary } from '../api';
import PassengerChart from '../components/PassengerChart';

export default function PassengersPage() {
  const [data, setData] = useState<PassengerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getPassengerSummary()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center text-gray-500">Loading passenger data…</div>;
  if (error) return <div className="flex-1 flex items-center justify-center text-red-400">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white">Passengers</h1>
        <p className="text-sm text-gray-500 mt-0.5">Occupancy rates and passenger load by route</p>
      </div>
      <PassengerChart data={data} />
    </div>
  );
}
