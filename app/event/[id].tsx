import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvents } from '@/hooks/useEvent';
import globalStyles from '@/styles/globalStyle';

const EventDetailPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { events, loading, error } = useEvents();

  const selectedEvent = events.find(event => String(event.uid) === id);

  if (loading) return <Text style={styles.loading}>Chargement...</Text>;
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;
  if (!selectedEvent) return <Text style={styles.error}>Événement introuvable</Text>;

  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={styles.container}>
        {selectedEvent.image && (
          <Image
            source={{ uri: `${selectedEvent.image.base}${selectedEvent.image.filename}` }}
            style={styles.eventImage}
            alt="Image de l'évènement"
          />
        )}
        <Text style={styles.modalTitle}>{selectedEvent.title?.fr}</Text>
        <Text style={styles.modalDate}>
          {selectedEvent.dateRange?.fr ||
            (selectedEvent.firstTiming?.begin
              ? new Date(selectedEvent.firstTiming.begin).toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date non disponible')}
        </Text>
        <Text style={styles.modalDescription}>
          {selectedEvent.description?.fr || 'Aucune description disponible'}
        </Text>
        <Text style={styles.modalEventPrice}>
          {selectedEvent.price ? `${selectedEvent.price} €` : 'Prix non disponible'}
        </Text>
        <TouchableOpacity style={styles.closeModalButton} onPress={() => router.back()}>
          <Text style={styles.closeModalButtonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EventDetailPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 20,
    flex: 1,
  },
  eventImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    fontFamily: 'FunnelSans-Regular',
  },
  modalDate: {
    fontSize: 16,
    color: '#ffdd59',
    marginVertical: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  modalDescription: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  modalEventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    fontFamily: 'FunnelSans-Regular',
  },
  closeModalButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  closeModalButtonText: {
    color: 'white',
    fontFamily: 'FunnelSans-Regular',
  },
  loading: {
    textAlign: 'center',
    marginTop: 40,
    color: 'white',
  },
  error: {
    textAlign: 'center',
    marginTop: 40,
    color: '#ff4d4d',
  },
});
