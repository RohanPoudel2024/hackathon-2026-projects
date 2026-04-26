import { useEffect, useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { listWorkingHours, upsertWorkingHours, deleteWorkingHours } from '../../lib/api/availability.service';
import type { WorkingHours, UpsertWorkingHoursRequest, WeekDay } from '../../types/availability.types';
import WorkingHoursEditor from '../../components/physician/WorkingHoursEditor';
import { Clock, Info, CheckCircle } from 'lucide-react';

export default function PhysicianAvailabilityPage() {
  const { profile, loading: profileLoading } = useCurrentUser();
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

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
      setError('');
      await upsertWorkingHours({ ...data, doctorId: profile.doctorId });
      await fetchWorkingHours();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
      setError('');
      await deleteWorkingHours(day, profile.doctorId);
      await fetchWorkingHours();
    } catch {
      setError('Failed to remove schedule for that day.');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = profileLoading || loading;

  const daysConfigured = workingHours.length;

  return (
    <div className="space-y-8 pb-12">

      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Scheduling</p>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-gray-900 tracking-tight">Availability</h1>
          <p className="text-gray-500 text-sm mt-2">
            Set the hours you're available for patient appointments
          </p>
        </div>
        {!isLoading && daysConfigured > 0 && (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle size={15} className="text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">
              {daysConfigured} day{daysConfigured > 1 ? 's' : ''} configured
            </span>
          </div>
        )}
      </div>

      {/* ─── Info banner ─── */}
      <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <Info size={16} className="text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-sm font-semibold text-emerald-800 leading-relaxed">
          Changes take effect immediately. Patients can only book appointments during your available hours.
          You can configure different hours for each day of the week.
        </p>
      </div>

      {/* ─── Notifications ─── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-4 rounded-2xl flex items-center gap-2">
          <span className="shrink-0">⚠️</span> {error}
        </div>
      )}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-4 rounded-2xl flex items-center gap-2">
          <CheckCircle size={16} className="shrink-0" />
          Availability saved successfully
        </div>
      )}

      {/* ─── Content ─── */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
          <Clock size={32} className="animate-pulse text-emerald-400" />
          <p className="text-sm font-semibold">Loading your schedule…</p>
        </div>
      ) : !profile?.doctorId ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold px-5 py-4 rounded-2xl">
          ⚠️ Doctor profile not found. Please contact support.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="text-base font-extrabold text-gray-900">Weekly Schedule</h2>
            <p className="text-sm text-gray-500 mt-1">Configure your availability for each day</p>
          </div>
          <div className="p-6">
            <WorkingHoursEditor
              workingHours={workingHours}
              onSave={handleSave}
              onDelete={handleDelete}
              loading={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
}
