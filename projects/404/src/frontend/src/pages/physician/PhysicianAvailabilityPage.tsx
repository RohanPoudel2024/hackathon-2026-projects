import { useEffect, useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { listWorkingHours, upsertWorkingHours, deleteWorkingHours } from '../../lib/api/availability.service';
import type { WorkingHours, UpsertWorkingHoursRequest, WeekDay } from '../../types/availability.types';
import WorkingHoursEditor from '../../components/physician/WorkingHoursEditor';
import { Clock } from 'lucide-react';

export default function PhysicianAvailabilityPage() {
  const { profile, loading: profileLoading } = useCurrentUser();
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchWorkingHours = async () => {
    if (!profile?.doctorId) return;
    try {
      setLoading(true);
      const data = await listWorkingHours(profile.doctorId);
      setWorkingHours(data);
    } catch {
      setError('Failed to load availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.doctorId) fetchWorkingHours();
  }, [profile?.doctorId]);

  const handleSave = async (data: UpsertWorkingHoursRequest) => {
    if (!profile?.doctorId) return;
    try {
      setSaving(true);
      await upsertWorkingHours({ ...data, doctorId: profile.doctorId });
      await fetchWorkingHours();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (day: WeekDay) => {
    if (!profile?.doctorId) return;
    try {
      setSaving(true);
      await deleteWorkingHours(day, profile.doctorId);
      await fetchWorkingHours();
    } catch {
      setError('Failed to remove schedule for that day.');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = profileLoading || loading;

  return (
    <div className="max-w-2xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Availability</h1>
        <p className="text-gray-500 text-sm mt-0.5">Set the times you're available for appointments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <Clock size={32} className="animate-pulse" />
          <p className="text-sm font-semibold">Loading your schedule…</p>
        </div>
      ) : !profile?.doctorId ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-4 py-3 rounded-xl">
          Doctor profile not found. Please contact support.
        </div>
      ) : (
        <WorkingHoursEditor
          workingHours={workingHours}
          onSave={handleSave}
          onDelete={handleDelete}
          loading={saving}
        />
      )}
    </div>
  );
}
