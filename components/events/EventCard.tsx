import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '@/interfaces/event';

type Props = {
  event: Event;
  onPressDetails: () => void;
};

export const EventCard = ({ event, onPressDetails }: Props) => {
  const startDate = event.dateRange?.fr || (
    event.firstTiming?.begin
      ? new Date(event.firstTiming.begin).toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Date non disponible'
  );

  return (
    <View style={styles.eventCard}>
      <Image
        source={{ uri: `${event.image?.base || ''}${event.image?.filename}` }}
        style={styles.eventImage}
        alt="Preview de l'événement"
      />
      <Text style={styles.eventTitle}>{event.title.fr || "Titre de l'évènement indisponible"}</Text>
      <Text style={styles.eventDate}>{startDate}</Text>

      <TouchableOpacity onPress={onPressDetails} style={styles.detailButton}>
        <Text style={styles.detailButtonText}>Voir plus</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    eventCard: {
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 5,
      },
      eventImage: {
        width: "100%",
        height: 300,
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
    marginBottom:20,
    fontFamily: "FunnelSans-Regular",
  },
  detailButton: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  detailButtonText: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "FunnelSans-Regular",
  },
})