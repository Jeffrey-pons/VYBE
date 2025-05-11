import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import iconLoupe from '../../assets/images/icons/icon_loupe.png';
import { cities } from '@/utils/citiesUtils';
import iconCalendar from '../../assets/images/icons/icon_calender.png';
import iconChoiceLocation from '../../assets/images/icons/icon_choice_location.png';
import globalStyles from '@/styles/globalStyle';
import { Theme } from '@/constants/Theme';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import EventList from '@/components/events/EventListCard';

const FilterScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityInput, setShowCityInput] = useState(false);
  const { events, loading, error } = useFilteredEvents({ city, date, keyword });

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;
    if (error) return <Text style={styles.error}>Erreur : {error}</Text>;
    if (!event) return <Text style={styles.error}>Événement introuvable</Text>;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; 
    setDate(selectedDate);
    setShowDatePicker(false);
  };
  // const toggleDatePicker = () => {
  //   setShowDatePicker(!showDatePicker); 
  // };

  const handleCitySelect = (enteredCity: string) => {
    setCity(enteredCity);
    setShowCityInput(false);
  };

  const handleKeywordChange = (text: string) => {
    setKeyword(text); 
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = !search || (event.title.fr && event.title.fr.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = !date || event.dateRange?.fr?.includes(date);
    const matchesCity = !city || (event.location?.city && event.location.city.toLowerCase() === city.toLowerCase());
    
    const matchesKeyword = !keyword || (
      event.keywords && Array.isArray(event.keywords.fr) && event.keywords.fr.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    return matchesSearch && matchesDate && matchesCity && matchesKeyword;
    
  });  

  return (
    <ScrollView>
      <View style={globalStyles.containerX}>
        <View style={styles.searchContainer}>
          <Image
            style={styles.searchIcon}
            source={iconLoupe}
            alt="Icône de recherche"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un événement ou un.e artiste"
            value={keyword}
            onChangeText={handleKeywordChange}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Image
              style={styles.searchIcon}
              source={iconCalendar}
              alt="Icône de calendrier"
            />
            <Text style={styles.filterButtonText}>{date || 'DATE'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowCityInput(true)}>
            <Image
              style={styles.searchIcon}
              source={iconChoiceLocation}
              alt="Icône de lieu"
            />
            <Text style={styles.filterButtonText}>{city || 'LIEU'}</Text>
          </TouchableOpacity>
             <TouchableOpacity style={styles.filterButton} onPress={() => setShowCityInput(true)}>
            <Image
              style={styles.searchIcon}
              source={iconChoiceLocation}
              alt="Icône de lieu"
            />
            <Text style={styles.filterButtonText}>{city || 'PRIX A METTRE EN PLACE'}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            // style={styles.dateInput}
          />
        )}

        <Modal visible={showCityInput} transparent animationType="none">
          <View style={styles.modalContainer}>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.gridContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCitySelect(item.value)} // Sélectionner la ville
                >
                  <Text style={styles.cityButtonText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
              <TouchableOpacity
                style={styles.buttonModaleCity}
                onPress={() => {
                  setCity(''); // Réinitialiser la ville
                  setShowCityInput(false); // Fermer la modale
                }}
              >
                <Text style={styles.textButtonModaleCity}>
                  Réinitialiser le lieu
                </Text>
              </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonModaleCity}
              onPress={() => setShowCityInput(false)}
            >
              <Text style={styles.textButtonModaleCity}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <EventList events={filteredEvents}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#535353',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 100,
    paddingHorizontal: 10,
    padding: 8,
    marginVertical: 10,
    marginBottom: 0,
  },
  searchIcon: {
    marginRight: 5,
    color: "#aaa",
    width: 20,
    height: 20
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontFamily: "FunnelSans-Regular",
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#535353',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderColor: '#333',
    borderWidth: 1,
  },
  buttonModaleCity:{
    backgroundColor: '#b36dff',
    padding: 10, 
    borderRadius: 5, 
    marginVertical: 10
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "FunnelSans-Regular",
    marginLeft: 4,
    marginBottom: 2,
  },
  modalContainer: {
    backgroundColor: Theme.colors.background,
    padding: 20,
    margin: 40,
    borderRadius: 10,
    borderColor: '#333',
    borderWidth: 1,
  },
  gridContainer: {
    justifyContent: 'center', 
    flexDirection: 'column',
  },
  cityButtonText: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    fontFamily: "FunnelSans-Regular"
  },
    loading: {
    textAlign: 'center',
    marginTop: 40,
    color: 'white',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    color: '#ff4d4d',
  },
  textButtonModaleCity: {
    color: 'white',
    textAlign: 'center',
    fontFamily: "FunnelSans-Regular",
  }
});

export default FilterScreen;