import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Logo from '@/components/LogoHeader';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { iconChoiceLocation } from '@/utils/imagesUtils';
import { useEvents } from '@/hooks/useEvent';
import { EventCard } from '@/components/events/EventCard';
import CategoryMenu from '@/components/CategoryMenu';
import globalStyles from '@/styles/globalStyle';
import { getIntroPhrase } from '@/utils/categoryUtils';
import { musicConnectImg } from '@/utils/imagesUtils';
import { SpotCard } from '@/components/events/SpotCard';

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

  const filteredEvents = events
  .slice(1, 11)
  .filter(event => event.originAgenda?.uid);

  return (
  <ScrollView>
    <View style={globalStyles.scrollContainer}>
    <Logo/>
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
    {events[0]?.originAgenda?.uid ? (
  <EventCard event={events[0]} />
) : null}
    </View>
    <ThemedText type='text'>{getIntroPhrase(activeCategory, city)}</ThemedText>

    {/* Scroll horizontal des autres événements */}
    {/* Afficher les evenements filtres du plus recent au plus loin */}
<ScrollView horizontal showsHorizontalScrollIndicator style={styles.horizontalScroll}>
  {filteredEvents.map(event => (
    <View key={event.uid} style={styles.miniEventCard}>
      <EventCard event={event} variant="horizontal" />
    </View>
  ))}
</ScrollView>

  </>
) : (
  <ThemedText type='text'>Aucun événement trouvé</ThemedText>
)}
      </View>
      <View style={styles.musicConnectCard}>
  <View style={styles.musicConnectContent}>
    <Text style={styles.musicConnectText}>
      Connecte ta musique pour découvrir les évènements qui te correspondent 🎵
    </Text>
    <TouchableOpacity 
      style={styles.musicConnectButton} 
      // onPress={() => router.push('/musicscreen')}
    >
      <Text style={styles.musicConnectButtonText}>Démarrer</Text>
    </TouchableOpacity>
  </View>
  <Image 
    source={musicConnectImg} 
    style={styles.musicImage}
    resizeMode="contain"
  />
</View>
<View>
  {/*  (API LIEU CATEGORIE DANS LA VILLE ) puis une fois rempli, afficher un bloc devenement propose en fonction des gouts musicaux*/}
  <ThemedText type='text'>Les derniers lieux cools près de chez toi</ThemedText>
  <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
    <SpotCard title="Élysée Montmartre" uid="elysee" image={require('@/assets/elysee.webp')} />
    <SpotCard title="Zénith Paris - La Villette" uid="zenith" image={require('@/assets/zenith.webp')} />
  </ScrollView>
</View>
      </View>
      </ScrollView>
    
  );
      
         {/* PUIS EVENEMENT PAR 10 / 20 */}
      {/* BLOC juste pour 'nom de la personne'''' */}
      {/* FAIRE DAUTRES STYLES EVENT CARD' */}

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
    // width: 300,
    marginRight: 10,
    padding: 15,
  },

  musicConnectCard: {
    backgroundColor: '#f5f0e6',
    borderRadius: 12,
    padding: 20,
    // marginVertical: 30,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  musicConnectContent: {
    flex: 1,
    marginRight: 10,
  },
  musicConnectText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'FunnelSans-Regular',
    marginBottom: 10,
  },
  musicConnectButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  musicConnectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  musicImage: {
    width: 80,
    height: 80,
  },
});

export default App;