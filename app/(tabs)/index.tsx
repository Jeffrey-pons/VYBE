import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform  } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Event } from '@/interfaces/event';
import Logo from '@/components/LogoHeader';
import { auth } from '@/config/firebaseConfig';
import { router } from 'expo-router';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { iconChoiceLocation } from '@/utils/imagesUtils';
import { useEvents } from '@/hooks/useEvent';
import { EventCard } from '@/components/events/EventCard';
import CategoryMenu from '@/components/CategoryMenu';
import globalStyles from '@/styles/globalStyle';

const App = () => {
  const { 
    city, 
    manualCity, 
    showInput, 
    handleManualCityChange, 
    handleCityNext,
    toggleInput
  } = useLocationHandler();
  const textInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState<string | null>('');
  const { events, loading, error } = useEvents(activeCategory);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Changer la ville depuis l'index.tsx
const handleCitySubmit = () => {
  handleManualCityChange(manualCity || '');
  handleCityNext(auth.currentUser, router);
  toggleInput();
};

  // Aggrandir la modale d'un évènement
const handleEventClick = (event: Event) => {
    setSelectedEvent(event);  
    setModalVisible(true);     
  };

  // Fermer la modale d'un évènement
  const closeModal = () => {
    setModalVisible(false);   
    setSelectedEvent(null);  
  };

  return (
  <ScrollView>
      <View style={globalStyles.scrollContainer}>
    <Logo></Logo>
     <ThemedText style={styles.titleLocal}>
      Découvre ton prochain évènements à{' '}
      {/* <View style={styles.cityContainer}> */}
      {showInput ? (
  <TextInput
    ref={textInputRef}
    style={styles.inlineInput}
    value={manualCity || ''}
    onChangeText={handleManualCityChange}
    placeholder="Ville"
    onSubmitEditing={handleCitySubmit}
    returnKeyType="done"
    autoFocus
    placeholderTextColor="#ccc"
  />
) : (
  <TouchableOpacity onPress={toggleInput}>
    <Text style={styles.underlinedCity}>{city}</Text>
  </TouchableOpacity>
)}
        {/* </View> */}
    </ThemedText>
    <Image
        style={styles.iconSize}
        source={iconChoiceLocation}
        alt="Icône de choix de localisation"
      />
    <CategoryMenu activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <View style={styles.eventsContainer}>
        {events && events.length  > 0 ? (
          events.map((event, index) => (
            <EventCard
            key={index}
            event={event}
            onPressDetails={() => handleEventClick(event)} 
          />
          ))
        ) : (
          <ThemedText type='text'>Aucun événement trouvé</ThemedText>
        )}
      </View>

      {selectedEvent && (
        <Modal visible={modalVisible} transparent animationType="none">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedEvent.image && (
                 <Image 
                 source={{ uri: `${selectedEvent.image?.base || ''}${selectedEvent.image?.filename}` }}
                 style={styles.eventImage}
                 alt="Image de l'évènement"
               />
              )}
                <Text style={styles.modalTitle}>{selectedEvent.title?.fr}</Text>
              <Text style={styles.modalDate}>
                {selectedEvent.dateRange?.fr ||
                  (selectedEvent.firstTiming?.begin ? new Date(selectedEvent.firstTiming.begin).toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : 'Date non disponible')}
              </Text>
              <Text style={styles.modalDescription}>
                {selectedEvent.description?.fr || 'Aucune description disponible'}
              </Text>
              <Text style={styles.modalEventPrice}>
                  {selectedEvent.price ? `${selectedEvent.price} €` : 'Prix non disponible'}
                </Text>
              <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
                <Text style={styles.closeModalButtonText}>Fermer</Text>
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
  inlineInput: {
    fontFamily: "Fugaz-One",
    fontSize: 30,
    borderBottomWidth: 0.4,
    borderBottomColor: 'white',
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 0,
    minWidth: 80,
  },
  iconSize: {
    width: 30,  
    height: 30,  
    position: 'absolute',
    top: 155,
    right: 0,
  },
  titleLocal: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: 'FunnelSans-Regular',
    fontSize: 31,
    textAlign: "center",
  },
  underlinedCity: {
    fontFamily: "Fugaz-One",
    fontSize: 30,
    borderBottomWidth: 0.4, 
    borderBottomColor: 'white', 
    paddingBottom: 0, 
    color: 'white', 
    fontWeight: 'bold', 
  },
  eventsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  
  },

  /// modale
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    fontFamily: "FunnelSans-Regular",
  },
  modalDate: {
    fontSize: 16,
    color: '#ffdd59',
    marginVertical: 10,
    fontFamily: "FunnelSans-Regular",
  },
  modalEventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    fontFamily: "FunnelSans-Regular",
  },
  modalDescription: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
    fontFamily: "FunnelSans-Regular",

  },
  closeModalButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  closeModalButtonText: {
    color: 'white',
    fontFamily: "FunnelSans-Regular",
  },
  eventImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
});

export default App;