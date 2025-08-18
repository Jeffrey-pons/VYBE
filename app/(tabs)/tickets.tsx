import Logo from '@/components/LogoHeader';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView, View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import globalStyles from '@/styles/globalStyle';
import { iconChoiceLocation } from '@/utils/imagesUtils';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { useEvents } from '@/hooks/useEvent';
import { EventCard } from '@/components/events/EventCard';

const TicketsScreen = () => {
  const {
    city,
    cities,
    showCitySelector,
    handleCitySelect,
    handleUseLocation,
    toggleCitySelector,
  } = useLocationHandler();
  const { events: popularEvents } = useEvents('featured');
  const { events: recentEvents } = useEvents('recent');
  return (
    <ScrollView>
      <View style={globalStyles.scrollContainer}>
        <Logo />
        <View style={styles.inlineLocation}>
          <ThemedText style={styles.titleLocal}>Derniers billets disponibles à </ThemedText>
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
        <View style={globalStyles.scrollContainer}>
          <ThemedText>Les dernières nouveautés</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentEvents.map((event) => (
              <View key={event.uid}>
                <EventCard event={event} variant="horizontal" />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={globalStyles.scrollContainer}>
          <ThemedText>Les plus populaires</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularEvents.map((event) => (
              <View key={event.uid}>
                <EventCard event={event} variant="horizontal" />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={globalStyles.scrollContainer}>
          <ThemedText>Par catégorie</ThemedText>
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
});

export default TicketsScreen;
