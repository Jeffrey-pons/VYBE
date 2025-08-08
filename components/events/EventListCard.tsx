import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Event } from '@/interfaces/event';
import { useRouter } from 'expo-router';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const router = useRouter();

  const handlePressDetails = (event: Event) => {
    if (event?.uid && event.originAgenda?.uid) {
      router.push(`/event/${event.originAgenda.uid}/${event.uid}`);
    } else {
      console.warn('UID ou originAgenda manquant');
    }
  };
  return (
    <FlatList
      data={events}
      keyExtractor={(item, index) => String(index)}
      ListEmptyComponent={<ThemedText type="text">Aucun événement trouvé</ThemedText>}
      renderItem={({ item }) => (
        <View style={styles.eventCard}>
          {item.image && item.image.base && item.image.filename ? (
            <Image
              source={{ uri: `${item.image.base}${item.image.filename}` }}
              style={styles.eventImage}
              alt="Image événement"
            />
          ) : (
            <View />
          )}
          <View>
            <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.title?.fr || 'Titre non disponible'}
            </Text>
            <Text style={styles.eventTextDate}>
              {item.location?.city || 'Ville inconnue'} -{' '}
              {item.dateRange?.fr || 'Date non disponible'}
            </Text>
            <TouchableOpacity onPress={() => handlePressDetails(item)}>
              <Text style={styles.eventText}>Voir plus </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  eventCard: {
    padding: 8,
    marginVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
    flexShrink: 1,
    maxWidth: '90%',
    overflow: 'hidden',
  },
  eventText: {
    color: '#fff',
    marginTop: 5,
    fontFamily: 'FunnelSans-Regular',
  },
  eventTextDate: {
    color: '#ffdd59',
    fontSize: 13,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
});

export default EventList;
