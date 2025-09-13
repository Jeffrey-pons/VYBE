import Logo from '@/components/LogoHeader';
import { ThemedText } from '@/components/ThemedText';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import globalStyles from '@/styles/globalStyle';
import { iconChoiceLocation } from '@/utils/imagesUtils';
import { useLocationHandler } from '@/hooks/useLocationHandler';
import { useEvents } from '@/hooks/useEvent';
import { EventCard } from '@/components/events/EventCard';
import React, { useState, useCallback } from 'react';

const TicketsScreen = () => {
  const {
    city,
    cities,
    showCitySelector,
    handleCitySelect,
    handleUseLocation,
    toggleCitySelector,
  } = useLocationHandler();

  const { events: popularEvents, refetch: refetchPopular } = useEvents('featured');

  const { events: recentEvents, refetch: refetchRecent } = useEvents('recent');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchRecent(), refetchPopular()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchRecent, refetchPopular]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
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
          <Text style={styles.titleScreen}>Les dernières nouveautés</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventScroll}>
            {recentEvents.map((event) => (
              <View key={event.uid} style={styles.eventCardContainer}>
                <EventCard event={event} variant="horizontal" cardWidth={250} imageHeight={280} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={globalStyles.scrollContainer}>
          <Text style={styles.titleScreenPopularity}>Les plus populaires</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.eventScrollTwo}
          >
            {popularEvents.map((event) => (
              <View key={event.uid} style={styles.eventCardContainer}>
                <EventCard event={event} variant="horizontal" cardWidth={250} imageHeight={280} />
              </View>
            ))}
          </ScrollView>
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
    paddingLeft: 5,
    paddingRight: 5,
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
  eventCardContainer: {
    paddingBottom: 20,
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 5,
  },
  eventScroll: {
    marginBottom: -30,
  },
  eventScrollTwo: {
    marginBottom: 70,
  },
  titleScreen: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 8,
  },
  titleScreenPopularity: {
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
    marginBottom: 10,
    marginTop: 35,
    marginLeft: 8,
  },
});

export default TicketsScreen;
