import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '@/interfaces/event';
import { router } from 'expo-router';

type Props = {
  event: Event;
  variant?: 'featured' | 'horizontal' | 'grid';
  cardWidth?: number;     
  imageHeight?: number;  
  style?: StyleProp<ViewStyle>;
};

const TEXT_BLOCK_HEIGHT = 120;

export const EventCard = ({ event, variant = 'featured', cardWidth = 250, imageHeight = 200, style, }: Props) => {
  const startDate =
    event.dateRange?.fr ||
    (event.firstTiming?.begin
      ? new Date(event.firstTiming.begin).toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Date non disponible');
  const handlePressDetails = (event: Event) => {
    if (event?.uid && event.originAgenda?.uid) {
      router.push(`/event/${event.originAgenda.uid}/${event.uid}`);
    } else {
      console.warn('UID ou originAgenda manquant');
    }
  };
const isHorizontal = variant === 'horizontal';
  return (
       <View
      style={[
        styles.eventCard,
        isHorizontal && styles.horizontalCard,
        // Contraint FERMEMENT largeur + hauteur totale en horizontal
        // eslint-disable-next-line react-native/no-inline-styles
        isHorizontal && { width: cardWidth, height: imageHeight + TEXT_BLOCK_HEIGHT, justifyContent: 'space-between' },
        style,
      ]}
    >
      <Image
        source={{ uri: `${event.image?.base || ''}${event.image?.filename}` }}
        style={[styles.eventImage, variant === 'horizontal' && styles.horizontalImage]}
        alt="Preview de l'événement"
        accessibilityLabel="Preview de l'événement"
      />
      <Text style={styles.eventTitle}>{event.title.fr || "Titre de l'évènement indisponible"}</Text>
      <Text style={styles.eventDate}>{startDate}</Text>
      <Text style={styles.eventLocation}>{event.location?.name}</Text>

      <TouchableOpacity onPress={() => handlePressDetails(event)} style={styles.detailButton} accessibilityLabel='Voir les détails de l’événement'>
        <Text style={styles.detailButtonText} accessibilityLabel="Voir le détails de l'événement">Voir plus</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: 'black',
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  horizontalCard: {
    padding: 5,
    marginBottom: 10,
    width: 250,
    borderWidth: 0.5,
    borderColor: '#999',
  },
  horizontalImage: {
    height: 200,
    width: 250,
    alignSelf: 'center',
    textAlign: 'center',
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  eventDate: {
    fontSize: 14,
    color: '#ffdd59',
    marginHorizontal: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  eventLocation: {
    fontSize: 14,
    color: 'grey',
    marginHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'FunnelSans-Regular',
  },
  detailButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 100,
    width: '35%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'FunnelSans-Regular',
  },
});
