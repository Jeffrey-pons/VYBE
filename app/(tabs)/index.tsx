import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Button, TextInput } from 'react-native';
// import LocationComponent from '@/components/Location'; 
import { ThemedText } from '@/components/ThemedText';
// import { fetchEventsByCategory, fetchEventsTonight, fetchEventsThisWeek } from '@/services/openAgenda.api';
import { Event } from '@/interfaces/Event';
import Logo from '@/components/LogoHeader';
import { auth } from '@/config/firebaseConfig';
import { router } from 'expo-router';
import globalStyles from '@/styles/globalStyle';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { iconChoiceLocation, iconTonight, iconThisWeek, iconConcert, iconFestival, iconSpectacle, iconExposition, iconHumor, iconAtelier, iconDj } from '@/utils/imagesUtils';

// A améliorer en snd partie !!!!!!!!

const App = () => {
  // const { city } = useLocation();
  const { 
    city, 
    manualCity, 
    showInput, 
    handleManualCityChange, 
    handleUseLocation, 
    handleCityNext,
    toggleInput 
  } = useLocationHandler();
  // const [city, setCity] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
// A améliorer en snd partie

// Gérer l'événement quand l'utilisateur appuie sur "Entrée"
const handleCitySubmit = () => {
  // Enregistrer la ville dans le contexte et en base de données
  handleManualCityChange(manualCity || '');
  handleCityNext(auth.currentUser, router);
};

  useEffect(() => {
    if (city && events.length === 0) {
      fetchEvents4Tonight(city);
      fetchEvents4Weeks(city);
    }
  }, [city, events.length]);

  const fetchEvents4Tonight = async (city: string) => {
    try {
      // const eventsData = await fetchEventsTonight(city);  
      // setEvents(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  };

  const fetchEvents4Weeks = async (city: string) => {
    try {
      // const eventsData = await fetchEventsThisWeek(city);  
      // setEvents(eventsData); 
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  };

  const handleCategoryClick = async (city: string, category: string) => {
    if (!city || !category) {
      console.error("Ville ou catégorie manquante");
      return;
    }
    setActiveCategory(category);
    try {
      // const eventsDataCategory = await fetchEventsByCategory({
      //   city,
      //   category
      // });
      // setEvents(eventsDataCategory);
    } catch (error){
      console.error('Erreur lors de la récupération des événements:', error);
    } 
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);  
    setModalVisible(true);     
  };

  const closeModal = () => {
    setModalVisible(false);   
    setSelectedEvent(null);  
  };

  const handleCityDetected = (detectedCity: string) => {
    setCity(detectedCity);
  };
 
  
  return (
    <ScrollView>
    <Logo></Logo>
     <ThemedText style={styles.titleLocal}>
      Trouve ton prochain évènements à{' '}
      <TouchableOpacity onPress={toggleInput}>
          <Text style={styles.underlinedCity}>{city || "Choisir une ville"}</Text>
        </TouchableOpacity>
      <Image
        style={styles.iconSize}
        source={iconChoiceLocation}
        alt="Icône de choix de localisation"
      />
    </ThemedText>
    {showInput && (
          <>
            <TextInput
               style={styles.textInput}
              value={manualCity || ''}
              onChangeText={handleManualCityChange}
              placeholder="Entrez votre ville"
              onSubmitEditing={handleCitySubmit} 
              returnKeyType="done" 
            />
          </>
        )}
     {!showInput && (
        <TextInput
          style={styles.textInputInvisible}
          value={manualCity || ''}
          onChangeText={handleManualCityChange}
          placeholder="Entrez votre ville"
          onSubmitEditing={handleCitySubmit}
          returnKeyType="done"
        />
      )}

        
          <View style={styles.categoriesContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow} contentOffset={{ x: 0, y: 0 }} >
          <TouchableOpacity
          style={[
            styles.categoryCard,
            activeCategory === 'tonight' && styles.activeCategory,
          ]}
          onPress={() => {
            city && fetchEvents4Tonight(city);
            setActiveCategory('tonight');
          }}
        >
          <Image
            style={styles.iconSize}
            source={iconTonight}
            alt="Icône de la catégorie Ce soir"
          />
            <Text style={styles.categoryText}>Ce soir</Text>
          </TouchableOpacity>

             <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'week' && styles.activeCategory,
              ]}
              onPress={() => {
                city && fetchEvents4Weeks(city);
                setActiveCategory('week');
              }}
            >
          <Image
            style={styles.iconSize}
            source={iconThisWeek}
            alt="Icône de la catégorie Cette semaine"
          />
            <Text style={styles.categoryText}>Cette semaine</Text>
          </TouchableOpacity>
          
            <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'concert' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'concert');
                setActiveCategory('concert');
              }}
            >
            <Image
            style={styles.iconSize}
            source={iconConcert}
            alt="Icône de la catégorie Concert"
            />
            <Text style={styles.categoryText}>Concerts</Text>
          </TouchableOpacity>
          
            <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'festival' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'festival');
                setActiveCategory('festival');
              }}
            >
            <Image
            style={styles.iconSize}
            source={iconFestival}
            alt="Icône de la catégorie Festival"
            />
            <Text style={styles.categoryText}>Festivals</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'spectacle' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'spectacle');
                setActiveCategory('spectacle');
              }}
            >
            <Image
              style={styles.iconSize}
              source={iconSpectacle}
              alt="Icône de la catégorie Spectacle"
            />
            <Text style={styles.categoryText}>Spectacles</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'exposition' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'exposition');
                setActiveCategory('exposition');
              }}
            >
            <Image
              style={styles.iconSize}
              source={iconExposition}
              alt="Icône de la catégorie Exposition"
            />
            <Text style={styles.categoryText}>Expositions</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'humour' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'humour');
                setActiveCategory('humour');
              }}
            >
            <Image
              style={styles.iconSize}
              source={iconHumor}
              alt="Icône de la catégorie Humour"
            />
            <Text style={styles.categoryText}>Humours</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'atelier' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'atelier');
                setActiveCategory('atelier');
              }}
            >
            <Image
              style={styles.iconSize}
              source={iconAtelier}
              alt="Icône de la catégorie Atelier"
            />
            <Text style={styles.categoryText}>Ateliers</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'soiree' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'soiree');
                setActiveCategory('soiree');
              }}
            >
            <Image
            style={styles.iconSize}
            source={iconFestival}
            alt="Icône de la catégorie Soirée"
            />
            <Text style={styles.categoryText}>Soirées</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[
                styles.categoryCard,
                activeCategory === 'techno' && styles.activeCategory,
              ]}
              onPress={() => {
                city && handleCategoryClick(city, 'techno');
                setActiveCategory('techno');
              }}
            >
            <Image
              style={styles.iconSize}
              source={iconDj}
              alt="Icône de la catégorie Techno"
            />
            <Text style={styles.categoryText}>DJ</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.eventsContainer}>
        {events.length > 0 ? (
          events.map((event, index) => (
            <View style={styles.eventCard} key={index}>
              <Image 
                source={{ uri: `${event.image?.base || ''}${event.image?.filename}` }}
                style={styles.eventImage}
                alt="Preview de l'évènement"
              />
              
              <Text style={styles.eventTitle}>{event.title?.fr || 'Titre indisponible'}</Text>
              <Text style={styles.eventDate}>
              {event.dateRange?.fr || 
                (event.firstTiming?.begin ? new Date(event.firstTiming.begin).toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : 'Date non disponible')
              }
            </Text>
              <TouchableOpacity style={styles.detailsButton} onPress={() => handleEventClick(event)}>
                <Text style={styles.detailsButtonText}>Voir plus</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>Aucun événement trouvé</Text>
        )}
      </View>

      {selectedEvent && (
        <Modal visible={modalVisible} transparent animationType="none">
          <View style={globalStyles.modalOverlay}>
            <View style={globalStyles.modalContainer}>
              {selectedEvent.image && (
                 <Image 
                 source={{ uri: `${selectedEvent.image?.base || ''}${selectedEvent.image?.filename}` }}
                 style={styles.eventImage}
                 alt="Image de l'évènement"
               />
              )}
                <Text style={globalStyles.modalTitle}>{selectedEvent.title?.fr}</Text>
              <Text style={globalStyles.modalDate}>
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
              <Text style={globalStyles.modalDescription}>
                {selectedEvent.description?.fr || 'Aucune description disponible'}
              </Text>
              <Text style={globalStyles.modalEventPrice}>
                  {selectedEvent.price ? `${selectedEvent.price} €` : 'Prix non disponible'}
                </Text>
              <TouchableOpacity style={globalStyles.closeModalButton} onPress={closeModal}>
                <Text style={globalStyles.closeModalButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    fontFamily: "Fugaz-One",
  },
  textInput: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    fontSize: 18,
    borderBottomWidth: 1,
    
    borderBottomColor: 'black',
    width: '100%', 
    height: '100%', 
    opacity: 1, 
  },
  textInputInvisible: {
    position: 'absolute', 
    top: 0,
    left: 0,
    fontSize: 18,
    opacity: 0, 
    height: 0, 
    width: '100%', 
  },
  iconSize: {
    width: 50,  
    height: 50,  
  },
  whiteText: {
    color: 'white',
  },
  categoriesContainer: {
    marginVertical: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: "row",
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  titleLocal: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: 'FunnelSans-Regular',
    fontSize: 28,
    textAlign: "center",
    position: 'relative',
  },
  underlinedCity: {
    fontFamily: "Fugaz-One",
    borderBottomWidth: 1, 
    borderBottomColor: 'white', 
    paddingBottom: 0.5, 
    color: 'white', 
    fontWeight: 'bold', 
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: "center",
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 2,
    color: "green",
    width: '12%',
    padding: 10,
  },
  activeCategory: {
    borderColor: 'yellow', 
  },
  categoryText: {
    fontSize: 17,
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
    fontFamily: "FunnelSans-Regular",
  },
  eventsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
  },
  eventImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    margin: 10,
    fontFamily: "FunnelSans-Regular",
  },
  eventDate: {
    fontSize: 14,
    color: "#ffdd59",
    marginHorizontal: 10,
    marginBottom:20,
    fontFamily: "FunnelSans-Regular",
  },
  eventDescription: {
    fontSize: 14,
    color: "lightgray",
    marginHorizontal: 10,
    marginBottom: 10,
    fontFamily: "FunnelSans-Regular",
  },
  detailsButton: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detailsButtonText: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "FunnelSans-Regular",
  },
  noEventsText: {
    textAlign: "center",
    color: "white",
    marginTop: 20,
    fontSize: 18,
    fontFamily: "FunnelSans-Regular",
  },
});

export default App;