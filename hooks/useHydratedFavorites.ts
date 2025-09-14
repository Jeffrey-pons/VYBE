import { useEffect, useState } from 'react';
import { listenFavoriteIds } from '@/services/favoriteService';
import { getEventByIdOpenAgenda } from '@/api/openAgenda';
import type { Event } from '@/interfaces/event';

type HydratedFavorite = { event: Event; agendaId: string; eventId: string };

export function useHydratedFavorites(uid?: string) {
  const [items, setItems] = useState<HydratedFavorite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid) return;

    const unsub = listenFavoriteIds(uid, async (ids) => {
      setLoading(true);
      try {
        const results = await Promise.all(
          ids.map(async ({ agendaId, eventId }) => {
            const ev = await getEventByIdOpenAgenda(agendaId, eventId);
            return ev ? ({ event: ev, agendaId, eventId } as HydratedFavorite) : null;
          })
        );
        setItems(results.filter(Boolean) as HydratedFavorite[]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub?.();
  }, [uid]);

  return { items, loading };
}
