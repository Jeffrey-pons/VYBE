import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Logo from '@/components/LogoHeader';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { iconChoiceLocation, registerIcon } from '@/utils/imagesUtils';
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
    toggleCitySelector,
  } = useLocationHandler();
  const [activeCategory, setActiveCategory] = useState<string | null>('');
  const { events, loading, refetch } = useEvents(activeCategory || 'upcoming');

  const filteredEvents = events.slice(1, 11).filter((event) => event.originAgenda?.uid);
  const usedIds = new Set<string>([
  ...(events[0]?.uid != null ? [String(events[0].uid)] : []),
  ...filteredEvents
    .map((e) => (e.uid != null ? String(e.uid) : undefined))
    .filter((v): v is string => !!v),
]);
  const secondaryEvent = events.find(
  (e) => e.originAgenda?.uid && e.uid != null && !usedIds.has(String(e.uid))
);
  const remainingHorizontal = events
  .filter((e) => e.originAgenda?.uid && e.uid != null && !usedIds.has(String(e.uid)))
  .slice(1, 12);

  return (
    <ScrollView style={styles.eventScroll} contentInsetAdjustmentBehavior="automatic" refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}>
      <View style={globalStyles.scrollContainer}>
        <Logo/>
        <View style={styles.inlineLocation}>
          <ThemedText style={styles.titleLocal}>Découvre ton prochain évènements à </ThemedText>
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
              <TouchableOpacity onPress={handleUseLocation} style={styles.locationIconWrapper}>
                <Image
                  source={iconChoiceLocation}
                  style={styles.inlineIcon}
                  alt="Icône de géolocalisation"
                  accessibilityLabel="Icône de géolocalisation"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>
        <CategoryMenu activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <View style={styles.eventsContainer}>
          {events && events.length > 0 ? (
            <>
            
             <Text style={styles.titleScreen}>{getIntroPhrase(activeCategory, city ?? '')}</Text>
              {/* Afficher levenement le + en vedette */}
              <View>
                {events[0]?.originAgenda?.uid ? <EventCard event={events[0]} /> : null}
              </View>

              {/* Scroll horizontal des autres événements */}
              {/* Afficher les evenements filtres du plus recent au plus loin */}
              <ScrollView horizontal showsHorizontalScrollIndicator>
                {filteredEvents.map((event) => (
                  <View key={event.uid} style={styles.miniEventCard}>
                    <EventCard event={event} variant="horizontal"  cardWidth={250} imageHeight={280} />
                  </View>
                ))}
              </ScrollView>
                <View style={styles.musicConnectCard}>
                <View style={styles.musicConnectContent}>
                  <Text style={styles.musicConnectText}>
                    Connecte ta musique pour découvrir les évènements qui te correspondent.
                  </Text>
                  <TouchableOpacity
                    style={styles.musicConnectButton}
                    // onPress={() => router.push('/musicscreen')}
                    accessibilityLabel='Démarrer la connexion musicale'
                  >
                    <Text style={styles.musicConnectButtonText}>Démarrer</Text>
                  </TouchableOpacity>
                </View>
                <Image source={registerIcon} style={styles.musicImage} resizeMode="contain" accessibilityLabel='Icône connexion à la musique'/>
              </View>
             {secondaryEvent && (
              <>
              <Text style={styles.titleScreen}>
                Plus d’évènements à {city}
              </Text>

                <View>
                  <EventCard event={secondaryEvent} />
                </View>
              </>
            )}
            {remainingHorizontal.length > 0 && (
            <>
              {/* Liste horizontale “comme la première” */}
              <ScrollView horizontal showsHorizontalScrollIndicator>
                {remainingHorizontal.map((event) => (
                  <View key={event.uid} style={styles.miniEventCard}>
                    <EventCard event={event} variant="horizontal" cardWidth={250} imageHeight={280}/>
                  </View>
                ))}
              </ScrollView>
            </>
          )}
            </>
          ) : (
            <Text style={styles.errorCategoryEvent}>Cette catégorie ne contient aucun événement planifié à {city} pour le moment</Text>
          )}
        </View>
        <View>
          {/*  (API LIEU CATEGORIE DANS LA VILLE ) puis une fois rempli, afficher un bloc devenement propose en fonction des gouts musicaux*/}
          {/* <ThemedText type="text">Les derniers lieux cools près de chez toi</ThemedText> */}
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.horizontalScroll}>
          <SpotCard title="Élysée Montmartre" uid="elysee" image={require('@/assets/elysee.webp')} />
          <SpotCard title="Zénith Paris - La Villette" uid="zenith" image={require('@/assets/zenith.webp')} />
        </ScrollView> */}
        </View>
      </View>
    </ScrollView>
  );
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
    fontFamily: 'Fugaz-One',
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
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'FunnelSans-Regular',
    fontSize: 31,
    textAlign: 'center',
  },
  underlinedCity: {
    fontFamily: 'Fugaz-One',
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
  miniEventCard: {
    marginRight: 0,
    paddingBottom: 10,
    paddingTop: 10,
    paddingRight: 15,
  },

  musicConnectCard: {
    backgroundColor: '#f5f0e6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
  eventScroll: {
    marginBottom: 60,
  },
  titleScreen: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
    marginBottom: 18,
    marginTop: 4,
    marginLeft: 5,
  },
  errorCategoryEvent: {
    color: 'white',
    fontSize: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  }
});

export default App;
