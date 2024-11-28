import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchFiveUpcomingEvents } from '@/services/openAgenda.api';

const FilterScreen = () => {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [events, setEvents] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPricePicker, setShowPricePicker] = useState(false);
  const [showCityInput, setShowCityInput] = useState(false);

  const sampleEvents = [
    { id: '1', name: 'Concert de DJ à l\'IBoat', city: 'Bordeaux', date: '2024-12-10', price: 'payant' },
    { id: '2', name: 'Soirée rock à la Rock School Barbey', city: 'Bordeaux', date: '2024-12-12', price: 'gratuit' },
    { id: '3', name: 'Techno Night à l\'IBoat', city: 'Bordeaux', date: '2024-12-15', price: 'payant' },
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
      setDate(formattedDate);
    }
  };

  const handlePriceSelect = (selectedPrice) => {
    setPrice(selectedPrice);
    setShowPricePicker(false);
  };

  const handleCitySelect = (enteredCity) => {
    setCity(enteredCity);
    setShowCityInput(false);
  };

  // Filtrage des événements
  const filteredEvents = sampleEvents.filter((event) => {
    return (
      (!search || event.name.toLowerCase().includes(search.toLowerCase())) &&
      (!date || event.date === date) &&
      (!price || event.price === price) &&
      (!city || event.city.toLowerCase() === city.toLowerCase())
    );
  });

  return (
    <View style={styles.container}>
      {/* Recherche avec icône */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un événement ou un.e artiste"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtres sous forme de boutons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.filterButtonText}>{date || 'DATE'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowPricePicker(true)}>
          <Text style={styles.filterButtonText}>{price || 'PRIX'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowCityInput(true)}>
          <Text style={styles.filterButtonText}>{city || 'LIEU'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      {/* Modal Price Picker */}
      <Modal visible={showPricePicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOption} onPress={() => handlePriceSelect('gratuit')}>
            <Text style={styles.modalOptionText}>Gratuit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={() => handlePriceSelect('payant')}>
            <Text style={styles.modalOptionText}>Payant</Text>
          </TouchableOpacity>
          <Button title="Annuler" onPress={() => setShowPricePicker(false)} color="#1e90ff" />
        </View>
      </Modal>

      {/* Modal City Input */}
      <Modal visible={showCityInput} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.modalInput}
            placeholder="Entrez une ville"
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={handleCitySelect}
          />
          <Button title="Annuler" onPress={() => setShowCityInput(false)} color="#1e90ff" />
        </View>
      </Modal>

      {/* Liste des événements */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.name}</Text>
            <Text style={styles.eventText}>{item.city} - {item.date}</Text>
            <Text style={styles.eventText}>Prix: {item.price}</Text>
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
  filterButton: {
    backgroundColor: '#535353',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    borderColor: '#333',
    borderWidth: 1,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight:"bold",
    fontFamily: "FunnelSans-Regular",
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
