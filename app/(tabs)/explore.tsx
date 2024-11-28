import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchFiveUpcomingEvents } from '@/services/openAgenda.api';
import EvilIcons from 'react-native-vector-icons/EvilIcons'; 
import { Event } from '@/interfaces/Event';
import { cities } from '@/utils/cities.utils';

const FilterScreen = () => {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [keyword, setKeyword] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCityInput, setShowCityInput] = useState(false);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      const filters = {
        city,
        timings: date ? { start: date, end: date } : undefined,
        keyword: keyword,
      };
      try {
        const upcomingEvents = await fetchFiveUpcomingEvents(filters);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      }
    };

    fetchFilteredEvents();
  }, [date, city, keyword]); 


  // const handleDateChange = (event, selectedDate) => {
  //   setShowDatePicker(false);
  //   if (selectedDate) {
  //     const formattedDate = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
  //     setDate(formattedDate);
  //   }
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
    
    // Vérification de keywords avec la nouvelle logique
    const matchesKeyword = !keyword || (
      event.keywords && Array.isArray(event.keywords.fr) && event.keywords.fr.some((k) => k.toLowerCase().includes(keyword.toLowerCase()))
    );
    return matchesSearch && matchesDate && matchesCity && matchesKeyword;
    
  });  

  return (
    <View style={styles.container}>
      {/* Recherche par mot clé */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un événement ou un.e artiste"
          placeholderTextColor="#aaa"
          value={keyword}
          onChangeText={handleKeywordChange}
        />
      </View>

      {/* Filtres sous forme de boutons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowDatePicker(true)}>
        <EvilIcons name="calendar" size={20} color="white" style={styles.cityIcon} />

          <Text style={styles.filterButtonText}>{date || 'DATE'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowCityInput(true)}>
        <EvilIcons name="location" size={20} color="white" style={styles.cityIcon} />
          <Text style={styles.filterButtonText}>{city || 'LIEU'}</Text>
        </TouchableOpacity>
      </View>

      {/* DATE */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          // onChange={handleDateChange}
        />
      )}

      {/* LIEU */}
      <Modal visible={showCityInput} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={cities}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCitySelect(item.value)} // Sélectionner la ville
              >
                <Text >{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <Button title="Fermer" onPress={() => setShowCityInput(false)} />
        </View>
      </Modal>

      {/* EVENTS */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={<Text>Aucun événement trouvé</Text>}  // Ajout d'un message pour les événements vides
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title.fr || "Titre non disponible"}</Text>
            <Text style={styles.eventText}>
              {item.location?.city || "Ville inconnue"} - {item.dateRange?.fr || "Date non disponible"}
            </Text>
            <Text style={styles.eventText}>Prix: {item.price || "Non spécifié"}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
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
  cityIcon: {
    marginLeft: 2,
    marginRight: 2,
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
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "FunnelSans-Regular",
    marginLeft: 10,
    marginBottom: 2,
  },
  modalContainer: {
    backgroundColor: '#121212',
    padding: 20,
    margin: 40,
    borderRadius: 10,
    borderColor: '#333',
    borderWidth: 1,
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
  },
  eventTitle: {
    color: '#1e90ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventText: {
    color: '#fff',
  },
});

export default FilterScreen;
