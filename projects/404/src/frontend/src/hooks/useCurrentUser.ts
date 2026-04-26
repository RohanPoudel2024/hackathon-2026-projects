import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../lib/api/axios';

export interface CurrentUserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  patientId: string | null;
  doctorId: string | null;
}

let cachedProfile: CurrentUserProfile | null = null;

export function useCurrentUser() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CurrentUserProfile | null>(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);

  useEffect(() => {
    if (!user?.id) return;
    if (cachedProfile && cachedProfile.id === user.id) {
      setProfile(cachedProfile);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .get<{ id: string; fullName: string; email: string; role: string; patient?: { id: string } | null; doctor?: { id: string } | null }>(`/users/${user.id}`)
      .then((r) => {
        const p: CurrentUserProfile = {
          id: r.data.id,
          fullName: r.data.fullName,
          email: r.data.email,
          role: r.data.role,
          patientId: r.data.patient?.id ?? null,
          doctorId: r.data.doctor?.id ?? null,
        };
        cachedProfile = p;
        setProfile(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { profile, loading };
}
