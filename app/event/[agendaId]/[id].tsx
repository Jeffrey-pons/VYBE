import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEventById } from '@/hooks/useEventById';
import globalStyles from '@/styles/globalStyle';

const EventDetailPage = () => {
  const { id, agendaId } = useLocalSearchParams();
  const router = useRouter();
  const { event, loading, error } = useEventById(agendaId, id);

  if (loading) return <Text style={styles.loading}>Chargement...</Text>;
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;
  if (!event) return <Text style={styles.error}>Événement introuvable</Text>; 
  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
      <View style={styles.container}>
        {event.image && (
          <Image
            source={{ uri: `${event.image.base}${event.image.filename}` }}
            style={styles.eventImage}
            alt="Image de l'évènement"
          />
        )}
        <Text style={styles.modalTitle}>{event.title?.fr}</Text>
        <Text style={styles.modalDate}>
          {event.dateRange?.fr ||
            (event.firstTiming?.begin
              ? new Date(event.firstTiming.begin).toLocaleString('fr-FR', {
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
          {event.description?.fr || 'Aucune description disponible'}
        </Text>
        <Text style={styles.modalEventPrice}>
          {event.price ? `${event.price} €` : 'Prix non disponible'}
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
