export const categoryInfo: Record<
  string,
  { label: string; genre: 'm' | 'f'; pluralLabel: string; special?: boolean }
> = {
  upcoming: { label: 'À venir', genre: 'm', pluralLabel: 'événements' }, //
  week: { label: 'Cette semaine', genre: 'f', pluralLabel: 'activités', special: true },
  concert: { label: 'Concert', genre: 'm', pluralLabel: 'concerts' },
  festival: { label: 'Festival', genre: 'm', pluralLabel: 'festivals' },
  spectacle: { label: 'Spectacle', genre: 'm', pluralLabel: 'spectacles' },
  exposition: { label: 'Exposition', genre: 'f', pluralLabel: 'expositions' },
  humour: { label: 'Humour', genre: 'm', pluralLabel: 'spectacles d’humour' },
  atelier: { label: 'Atelier', genre: 'm', pluralLabel: 'ateliers' },
  soiree: { label: 'Soirée', genre: 'f', pluralLabel: 'soirées' },
};

export const getIntroPhrase = (categoryKey: string | null, city: string): string => {
  if (!categoryKey || !categoryInfo[categoryKey]) return `Les prochains événements à ${city}`;

  const { genre, pluralLabel, special } = categoryInfo[categoryKey];
  if (special) return `${categoryInfo[categoryKey].label} à ${city}`;

  const determiner = genre === 'f' ? 'prochaines' : 'prochains';
  return `Les ${determiner} ${pluralLabel} à ${city}`;
};
