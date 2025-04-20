import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Logo from '@/components/LogoHeader';
import { router } from 'expo-router';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { iconChoiceLocation } from '@/utils/imagesUtils';
import { useEvents } from '@/hooks/useEvent';
import { EventCard } from '@/components/events/EventCard';
import CategoryMenu from '@/components/CategoryMenu';
import globalStyles from '@/styles/globalStyle';
import { getIntroPhrase } from '@/utils/categoryUtils';

const App = () => {
  const { 
    city, 
    cities,
    showCitySelector, 
    handleCitySelect,
    handleUseLocation,  
    toggleCitySelector 
  } = useLocationHandler();
  const [activeCategory, setActiveCategory] = useState<string | null>('');
  const { events } = useEvents(activeCategory || 'upcoming');

  return (
  <ScrollView>
    <View style={globalStyles.scrollContainer}>
    <Logo></Logo>
    <View style={styles.inlineLocation}>
      <ThemedText style={styles.titleLocal}>Découvre ton prochain évènements à{' '}</ThemedText>
        <TouchableOpacity onPress={toggleCitySelector}></TouchableOpacity>
          {showCitySelector ? (
            <View style={styles.cityListWrapper}>
               <ScrollView>
              {cities.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cityItem}
                  onPress={() => {
                    handleCitySelect(item.value);
                    toggleCitySelector();
                  }}
                >
                  <Text style={styles.cityText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              </ScrollView>
            </View>
          ) : (
            <TouchableOpacity onPress={toggleCitySelector} style={styles.inlineCity}>
              <Text style={styles.underlinedCity}>{city}</Text>
              <TouchableOpacity
                onPress={handleUseLocation}
                style={styles.locationIconWrapper}
              >
                <Image
                  source={iconChoiceLocation}
                  style={styles.inlineIcon}
                  alt="Icône de géolocalisation"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
            
    </View>
    <CategoryMenu activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <View style={styles.eventsContainer}>
      {events && events.length > 0 ? (
  <>
    {/* Afficher levenement le + en vedette */}
    <View style={styles.featuredEventContainer}>
      <EventCard
        event={events[0]}
        onPressDetails={() => router.push(`/event/${events[0].uid}?category=${activeCategory}`)}
      />
    </View>
    <ThemedText type='text'>{getIntroPhrase(activeCategory, city)}</ThemedText>

    {/* Scroll horizontal des autres événements */}
        {/* Afficher les evenements filtres du plus recent au plus loin */}
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
      {events.slice(1, 11).map((event, index) => (
        <View key={index} style={styles.miniEventCard}>
          <EventCard
            event={event}
            onPressDetails={() => router.push(`/event/${event.uid}?category=${activeCategory}`)}
          />
        </View>
      ))}
    </ScrollView>
  </>
) : (
  <ThemedText type='text'>Aucun événement trouvé</ThemedText>
)}
      </View>
      </View>
      </ScrollView>
    
  );
      {/* BLOC TROUVE LES EVENEMENTS QUE TU AIMES CONNECTE TA MUSIQUE  */}
      {/* BLOC LES DERNIERS LIEUX COOL PRES DE CHEZ TOI (API LIEU CATEGORIE DANS LA VILLE ) puis une fois rempli, afficher un bloc devenement propose en fonction des gouts musicaux
        PUIS EVENEMENT PAR 10 / 20 */}
      {/* BLOC juste pour 'nom de la personne'''' */}
};

const styles = StyleSheet.create({
    cityListWrapper: {
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    maxHeight: 200,
    maxWidth: 200,
  },
  cityItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.4, 
    borderBottomColor: 'white', 
    paddingBottom: 0, 
    color: 'white', 
    fontWeight: 'bold', 
  },
  cityText: {
    fontFamily: "Fugaz-One",
    fontSize: 30,
    color: 'white',
  },
  inlineCity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  locationIconWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  inlineIcon: {
    width: 25,
    height: 25,
    // marginTop: 3,
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
  featuredEventContainer: {
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingLeft: 10,
  },
  miniEventCard: {
    width: 250,
    marginRight: 10,
  },
});

export default App;