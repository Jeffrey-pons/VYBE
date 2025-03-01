import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { Event } from '@/interfaces/Event';
import { cities } from '@/utils/citiesUtils';
import globalStyles from '@/styles/globalStyle';
import { ThemedText } from '@/components/ThemedText';
import { Theme } from '@/constants/Theme';

// A améliorer en snd partie !!!!!!!!

const FilterScreen: React.FC = () => {
  // const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [keyword, setKeyword] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityInput, setShowCityInput] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); 
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      const filters = {
        city,
        timings: date ? { gte: `${date}T00:00:00Z`, lte: `${date}T23:59:59Z` } : undefined,
        keyword: keyword,
      };
      try {
        // const upcomingEvents = await fetchFiveUpcomingEvents(filters);
        // setEvents(upcomingEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      }
    };

    fetchFilteredEvents();
  }, [date, city, keyword]); 

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; 
    setDate(selectedDate);
    setShowDatePicker(false);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker); 
  };

  const handleCitySelect = (enteredCity: string) => {
    setCity(enteredCity);
    setShowCityInput(false);
  };

  const handleKeywordChange = (text: string) => {
    setKeyword(text); 
  };

  const filteredEvents = events.filter((event) => {
    // const matchesSearch = !search || (event.title.fr && event.title.fr.toLowerCase().includes(search.toLowerCase()));
    const matchesDate = !date || event.dateRange?.fr?.includes(date);
    const matchesCity = !city || (event.location?.city && event.location.city.toLowerCase() === city.toLowerCase());
    
    const matchesKeyword = !keyword || (
      event.keywords && Array.isArray(event.keywords.fr) && event.keywords.fr.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    // return matchesSearch && matchesDate && matchesCity && matchesKeyword;
    
  });  

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <ScrollView>
      <View style={globalStyles.containerX}>
        <View style={styles.searchContainer}>
          <Image
            style={styles.searchIcon}
            source={require('../../assets/images/icons/icon_loupe.png')}
            accessibilityLabel="Icône de recherche"
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
              source={require('../../assets/images/icons/icon_calender.png')}
              accessibilityLabel="Icône de calendrier"
            />
            <Text style={styles.filterButtonText}>{date || 'DATE'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowCityInput(true)}>
            <Image
              style={styles.searchIcon}
              source={require('../../assets/images/icons/icon_choice_location.png')}
              accessibilityLabel="Icône de calendrier"
            />
            <Text style={styles.filterButtonText}>{city || 'LIEU'}</Text>
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
                style={[styles.buttonModaleCity, { padding: 10, borderRadius: 5, marginVertical: 10 }]}
                onPress={() => {
                  setCity(''); // Réinitialiser la ville
                  setShowCityInput(false); // Fermer la modale
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center', fontFamily: "FunnelSans-Regular" }}>
                  Réinitialiser le lieu
                </Text>
              </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonModaleCity, { padding: 10, borderRadius: 5 }]}
              onPress={() => setShowCityInput(false)}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontFamily: "FunnelSans-Regular" }}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* EVENTS */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={<ThemedText type="text">Aucun événement trouvé</ThemedText>}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              {item.image && item.image.base && item.image.filename ? (
              <Image source={{ uri: `${item.image.base}${item.image.filename}` }} style={styles.eventImage} accessibilityLabel="Preview de l'évènements"/>
            ) : (
              <View /> 
            )}
              <View>
                <Text style={styles.eventTitle}>{item.title.fr || "Titre non disponible"}</Text>
                <Text style={styles.eventTextDate}>
                  {item.location?.city || "Ville inconnue"} - {item.dateRange?.fr || "Date non disponible"}
                </Text>
                {item.location?.latitude && item.location?.longitude && (
                  <Text style={styles.eventText}>
                    Adresse: {item.location.name} | {item.location.address} 
                  </Text>
                )}
                <Text style={styles.eventText}>Prix: {item.price || "Non spécifié"}</Text>
                <TouchableOpacity onPress={() => handleEventClick(item)}>
                  <Text style={styles.eventText}>Voir plus</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {selectedEvent && (
          <Modal visible={modalVisible} transparent animationType="none">
            <View >
              <View >
                {selectedEvent.image && (
                  <Image 
                    source={{ uri: `${selectedEvent.image?.base || ''}${selectedEvent.image?.filename}` }}
                    style={styles.eventImageDetail}
                    accessibilityLabel="Image de l'évènement"
                  />
                )}
                <Text>{selectedEvent.title?.fr || 'Titre non disponible'}</Text>
                <Text>
                  {selectedEvent.dateRange?.fr || 'Date non disponible'}
                </Text>
                <Text >
                  {selectedEvent.description?.fr || 'Aucune description disponible'}
                </Text>
                <Text >
                  {selectedEvent.price ? `${selectedEvent.price} €` : 'Prix non disponible'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Text >Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
    // flexWrap: 'wrap-reverse',
    // paddingVertical: 10,
  },
  cityButtonText: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    fontFamily: "FunnelSans-Regular"
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  modalInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
    marginVertical: 10,
  },
  eventCard: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    flexDirection: 'row',  
    alignItems: 'center'
  },
  eventTitle: {
    color: 'white',
    fontWeight: 500,
    fontSize: 19,
     fontFamily: "FunnelSans-Regular"
  },
  eventText: {
    color: '#fff',
     fontFamily: "FunnelSans-Regular"
  },
  eventTextDate: {
    color:  "#ffdd59",
    fontSize: 13,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  eventImageDetail: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
});

export default FilterScreen;