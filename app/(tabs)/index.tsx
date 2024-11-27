import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Button, TouchableOpacity, ScrollView} from 'react-native';
import LocationComponent from '@/components/Location'; 
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "expo-router";
import { fetchEventsByCategory, fetchEventsTonight } from '@/services/openAgenda.api';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/FontAwesome'; 
const App = () => {
  const [city, setCity] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false); 
        navigation.navigate("login")
      }
      setLoading(false);
    };

    checkUserToken();
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

   const handleCityDetected = async (cityName) => {
    setCity(cityName);
    fetchEvents4Tonight(cityName);  
  };

  const fetchEvents4Tonight = async (city) => {
    try {
      const eventsData = await fetchEventsTonight(city);  
      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    } finally {
      setLoading(false);
    }
  };
 
  return (

    <ScrollView>
      <Image 
        source={require('../../assets/images/logos/VYBE_logo2.png')}  
        resizeMode="contain" 
        style={styles.logoIndex}
      />
      <ThemedText style={styles.titleLocal}>Trouve ton prochain évènements à {city} 
      <EvilIcons name="location" size={40} color="white" />
      </ThemedText>

      <LocationComponent onCityDetected={handleCityDetected}/>
      <View style={styles.categoriesContainer}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEvents4Tonight(city, '')}>
          <MaterialCommunityIcons name="weather-night" size={40} color="white" />
            <Text style={styles.categoryText}>Ce soir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, '')}>
          <MaterialCommunityIcons name="calendar-weekend-outline" size={44} color="white" />
            <Text style={styles.categoryText}>Cette semaine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'concert')}>
            <Icon name="music" size={40} color="white" />
            <Text style={styles.categoryText}>Concerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'festival')}>
            <Icon name="fire" size={40} color="white" />
            <Text style={styles.categoryText}>Festivals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'spectacle')}>
          <MaterialCommunityIcons name="theater" size={44} color="white" />
            <Text style={styles.categoryText}>Spectacles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'exposition')}>
          <SimpleLineIcons name="picture" size={40} color="white" />
            <Text style={styles.categoryText}>Expositions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'humour')}>
            <Icon name="smile-o" size={40} color="white" />
            <Text style={styles.categoryText}>Humours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'soirée')}>
            <Icon name="glass" size={40} color="white" />
            <Text style={styles.categoryText}>Soirées</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'theatre')}>
          <MaterialCommunityIcons name="drama-masks" size={40} color="white" />
            <Text style={styles.categoryText}>Théâtres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => fetchEventsByCategory(city, 'atelier')}>
          <MaterialCommunityIcons name="brush" size={40} color="white" />
            <Text style={styles.categoryText}>Ateliers</Text>
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
              />
              <Text style={styles.eventTitle}>{event.title?.fr || 'Titre indisponible'}</Text>
               <Text style={styles.eventDate}>
                {event.dateRange?.fr || 
                  new Date(event.firstTiming?.begin).toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }) || 
                  'Date non disponible'}
              </Text>
              <Text style={styles.eventDescription}>
                {event.description?.fr ? `${event.description.fr.slice(0, 80)}...` : 'Description non disponible'}
              </Text>
              <TouchableOpacity style={styles.detailsButton} onPress={() => alert(`Détails pour: ${event.title?.fr}`)}>
                <Text style={styles.detailsButtonText}>Voir plus</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>Aucun événement trouvé</Text>
        )}
      </View>
      
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
  logoIndex: {
    width: 100,  
    height: 100,  
    resizeMode: "contain", 
  },
  whiteText: {
    color: 'white',
  },
  categoriesContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
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
    fontFamily: "Fugaz-One",
    fontSize: 28,
    textAlign: "center",
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  categoryCard: {
    alignItems: 'center',
    width: '12%',
    padding: 15,
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
    height: 200,
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
    backgroundColor: "#ff5a5f",
    padding: 10,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detailsButtonText: {
    color: "white",
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
