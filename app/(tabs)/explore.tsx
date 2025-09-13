import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity,
  Modal, Image, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import iconLoupe from '../../assets/images/icons/icon_loupe.png';
import { cities } from '@/utils/citiesUtils';
import iconCalendar from '../../assets/images/icons/icon_calender.png';
import iconChoiceLocation from '../../assets/images/icons/icon_choice_location.png';
import { Theme } from '@/constants/Theme';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import EventList from '@/components/events/EventListCard';
import { useFilterStore } from '@/stores/useFilterStore';
import { useDebounce } from '@/hooks/useDebounce';

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

const FilterScreen: React.FC = () => {
  const {
    search, date, city,
    showCityInput, setDate, setCity, setShowCityInput,
  } = useFilterStore();

  // pilotage local de l’ouverture du picker + date en attente
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [pendingYMD, setPendingYMD] = useState<string | null>(null);

  const keyword = useFilterStore((s) => s.keyword);
  const setKeyword = useFilterStore((s) => s.setKeyword);

  const debouncedKeyword = useDebounce(keyword, 500);
  const { events, loading, error } = useFilteredEvents({ city, date, keyword: debouncedKeyword });

  if (loading) return <Text style={styles.loading}>Chargement...</Text>;
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;

  const handleCitySelect = (enteredCity: string) => {
    setCity(enteredCity);
    setShowCityInput(false);
  };

  // Ouvrir le calendrier en initialisant la valeur affichée
  const openDatePicker = () => {
    setPendingYMD(date || toYMD(new Date()));
    setIsDateOpen(true);
  };

  // Appliquer la date choisie uniquement quand l’utilisateur tape OK
  const confirmDate = () => {
    if (pendingYMD != null) {
      setDate(pendingYMD);
    }
    // petit délai pour éviter le "tap-through" qui rouvre le bouton dessous sur iOS
    setTimeout(() => setIsDateOpen(false), 80);
  };

  // Réinitialiser le filtre date
  const resetDate = () => {
    setPendingYMD(null);
    setDate('');
    setIsDateOpen(false);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !search || (event.title.fr && event.title.fr.toLowerCase().includes(search.toLowerCase()));
    const matchesDate =
      !date ||
      event.firstTiming?.begin?.slice(0, 10) === date ||
      event.dateRange?.fr?.includes(date);
    const matchesCity =
      !city || (event.location?.city && event.location.city.toLowerCase() === city.toLowerCase());
    const matchesKeyword =
      !keyword ||
      (event.keywords &&
        Array.isArray(event.keywords.fr) &&
        event.keywords.fr.some((k) => k.toLowerCase().includes(keyword.toLowerCase())));
    return matchesSearch && matchesDate && matchesCity && matchesKeyword;
  });

  // valeur Date affichée dans le picker (fallback aujourd’hui)
  const pickerDateObj =
    pendingYMD ? new Date(pendingYMD) : (date ? new Date(date) : new Date());

  return (
    <View style={styles.containerExplore}>
      <View style={styles.searchContainer}>
        <Image style={styles.searchIcon} source={iconLoupe} accessibilityLabel="Icône de recherche" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un événement ou un.e artiste"
          value={keyword}
          placeholderTextColor="white"
          onChangeText={setKeyword}
          accessibilityLabel="Champ pour entrer la recherche"
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openDatePicker}
          accessibilityLabel="Ouvrir le sélecteur de date"
        >
          <Image style={styles.searchIcon} source={iconCalendar} accessibilityLabel="Icône de calendrier" />
          <Text style={styles.filterButtonText}>{date || 'DATE'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCityInput(true)}
          accessibilityLabel="Ouvrir le sélecteur de ville"
        >
          <Image style={styles.searchIcon} source={iconChoiceLocation} accessibilityLabel="Icône de lieu" />
          <Text style={styles.filterButtonText}>{city || 'LIEU'}</Text>
        </TouchableOpacity>
      </View>

      {/* iOS : modal avec picker inline (on stocke seulement dans pendingYMD) */}
      {Platform.OS === 'ios' && (
        <Modal visible={isDateOpen} transparent animationType="fade">
          <View style={styles.dateModalBackdrop}>
            <View style={styles.dateModalCard}>
              <DateTimePicker
                value={pickerDateObj}
                mode="date"
                display="inline"
                onChange={(_, selected) => {
                  if (selected) setPendingYMD(toYMD(selected));
                }}
              />
              {/* Réinitialiser + OK côte à côte */}
              <View style={styles.dateActionsRow}>
                <TouchableOpacity
                  style={styles.dateResetBtn}
                  onPress={resetDate}
                  accessibilityLabel="Réinitialiser la date"
                >
                  <Text style={styles.dateResetText}>Réinitialiser</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateOkBtn}
                  onPress={confirmDate}
                  accessibilityLabel="Valider la date"
                >
                  <Text style={styles.dateOkText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Android : dialogue natif (l’OK natif confirme la date) */}
      {Platform.OS === 'android' && isDateOpen && (
        <DateTimePicker
          value={pickerDateObj}
          mode="date"
          display="default"
          onChange={(event, selected) => {
            // 'set' déclenche quand l'utilisateur appuie sur OK dans le dialogue natif
            if (event.type === 'set' && selected) {
              setDate(toYMD(selected));
            }
            setIsDateOpen(false);
          }}
        />
      )}

      {/* Web : input date + boutons Réinitialiser / OK */}
      {Platform.OS === 'web' && isDateOpen && (
        <View style={styles.webDateWrapper}>
          <input
            type="date"
            value={pendingYMD ?? date ?? ''}
            onChange={(e) => setPendingYMD(e.target.value || null)}
          />
          <View style={styles.dateActionsRow}>
            <button onClick={resetDate}>Réinitialiser</button>
            <button onClick={confirmDate}>OK</button>
          </View>
        </View>
      )}

      <Modal visible={showCityInput} transparent animationType="none">
        <View style={styles.modalContainer}>
          <FlatList
            data={cities}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.gridContainer}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCitySelect(item.value)}>
                <Text style={styles.cityButtonText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.buttonModaleCity}
            onPress={() => { setCity(''); setShowCityInput(false); }}
            accessibilityLabel="Réinitialiser le lieu"
          >
            <Text style={styles.textButtonModaleCity}>Réinitialiser le lieu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonModaleCity}
            onPress={() => setShowCityInput(false)}
            accessibilityLabel="Fermer le sélecteur de ville"
          >
            <Text style={styles.textButtonModaleCity}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <EventList events={filteredEvents} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#535353',
    borderWidth: 1, borderColor: '#333', borderRadius: 100, paddingHorizontal: 10, padding: 8,
    marginVertical: 10, marginBottom: 0,
  },
  searchIcon: { marginRight: 5, width: 20, height: 20 },
  searchInput: { flex: 1, color: 'white', fontSize: 17, fontFamily: 'FunnelSans-Regular' },
  filterContainer: { flexDirection: 'row', marginVertical: 10, gap: 10 },
  filterButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#535353',
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 100, borderColor: '#333', borderWidth: 1,
  },
  filterButtonText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'FunnelSans-Regular',
    marginLeft: 4, marginBottom: 2,
  },
  modalContainer: {
    backgroundColor: '#333', padding: 20, margin: 40, marginTop: 100, marginBottom: 200,borderRadius: 10,
    borderColor: '#333', borderWidth: 1,
  },
  gridContainer: { justifyContent: 'center', flexDirection: 'column' },
  cityButtonText: {
    color: Theme.colors.text, fontSize: 18, fontWeight: 'bold', textAlign: 'center',
    width: '100%', fontFamily: 'FunnelSans-Regular', paddingVertical: 5,
  },
  buttonModaleCity: { backgroundColor: '#b36dff', padding: 10, borderRadius: 5, marginVertical: 10 },
  textButtonModaleCity: { color: 'white', textAlign: 'center', fontFamily: 'FunnelSans-Regular', fontSize: 16 },
  loading: { textAlign: 'center', marginTop: 40, color: 'white' },
  error: { textAlign: 'center', marginTop: 40, color: '#ff4d4d' },

  // iOS date modal
  dateModalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  dateModalCard: {
    backgroundColor: '#111', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12, borderColor: '#333', borderWidth: 1,
  },
  dateActionsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  dateResetBtn: {
    backgroundColor: 'transparent',
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateResetText: { color: 'white', fontWeight: 'bold' },
  dateOkBtn: {
    backgroundColor: '#b36dff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateOkText: { color: 'white', fontWeight: 'bold' },

  webDateWrapper: { 
    gap: 8 
  },
  containerExplore : {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginBottom: 60,
    marginTop: 30,
  }
});

export default FilterScreen;
