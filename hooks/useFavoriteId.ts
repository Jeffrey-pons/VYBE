import { useEffect, useState, useCallback } from 'react';
import { addFavoriteId, removeFavoriteId, isFavoritedId } from '@/services/favoriteService';

export function useFavoriteId(uid?: string, agendaId?: string, eventId?: string) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid || !agendaId || !eventId) return;
    isFavoritedId(uid, agendaId, eventId)
      .then(setFavorited)
      .catch(() => setFavorited(false));
  }, [uid, agendaId, eventId]);

  const toggle = useCallback(async () => {
    if (!uid || !agendaId || !eventId) return;
    setLoading(true);
    setFavorited((v) => !v); // UI optimiste
    try {
      if (favorited) await removeFavoriteId(uid, agendaId, eventId);
      else await addFavoriteId(uid, agendaId, eventId);
    } catch {
      setFavorited((v) => !v); // revert si erreur
    } finally {
      setLoading(false);
    }
  }, [uid, agendaId, eventId, favorited]);

  return { favorited, loading, toggle };
}
